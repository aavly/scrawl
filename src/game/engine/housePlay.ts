import type { PlayStyle } from '../housePlayers';

import { PLAUSIBILITY_RULES } from './plausibility';
import { ROUND_MS } from './round';
import { createRng, randomInt } from './rng';
import type { Solved } from './solver';

export type PlannedFind = { word: string; points: number; atMs: number };

/**
 * Plans a house player's round in advance: which words it finds and when.
 * Deterministic for a seed, so the server can replay it. The UI plays the
 * plan back against the clock to drive the live opponent score.
 */
export function planHouseRound(style: PlayStyle, solved: Solved, seed: number, roundMs = ROUND_MS): PlannedFind[] {
  const rng = createRng(seed);
  const target = Math.max(1, randomInt(rng, style.words - style.wordsSpread, style.words + style.wordsSpread));

  // The words it "knows" on this board, each with a pick weight.
  // House players never spell mild profanity or clinical terms at anyone.
  const pool = solved.words
    .filter((s) => !s.mild && rng() < style.vocabulary[s.commonness - 1])
    .map((s) => ({ s, weight: style.lengthBias ** (s.word.length - 3) }));

  // Weighted picks without replacement.
  const picked: typeof pool = [];
  while (picked.length < target && pool.length > 0) {
    const total = pool.reduce((sum, p) => sum + p.weight, 0);
    let r = rng() * total;
    let i = 0;
    for (; i < pool.length - 1; i++) {
      r -= pool[i].weight;
      if (r <= 0) break;
    }
    picked.push(pool.splice(i, 1)[0]);
  }

  // Spread the finds over the round: nothing in the first 2.5 s (it has to
  // read the board too) or the last second; frontLoad pulls finds earlier.
  const start = 2500;
  const end = roundMs - 1000;
  const times = picked.map(() => start + (end - start) * rng() ** (1 + style.frontLoad)).sort((a, b) => a - b);

  // A person needs time to trace each word, so never find two words faster
  // than that. Words pushed past the end of the round are dropped.
  const plan: PlannedFind[] = [];
  let last = -Infinity;
  for (let i = 0; i < picked.length; i++) {
    const word = picked[i].s.word;
    const earliest = last + PLAUSIBILITY_RULES.minTraceMs(word.length) + 250 + rng() * 400;
    const at = Math.max(times[i], earliest);
    if (at > end) break;
    plan.push({ word, points: picked[i].s.points, atMs: Math.round(at) });
    last = at;
  }
  return plan;
}
