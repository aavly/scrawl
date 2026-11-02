// Flags rounds that look inhuman (docs/PRODUCT.md "Rating"). A flagged win gets
// no margin bonus and goes for review. These checks only mean something on
// the server, which a cheater can't edit; they live here so they're shared and
// tested. Thresholds are placeholders to tune against real beta data.

import type { Solved } from './solver';

export type TimedFind = { word: string; atMs: number };

export type PlausibilityFlag =
  /** Several words entered faster than a finger can trace them. */
  | 'too-fast'
  /** Mostly obscure words, the signature of a solver. */
  | 'too-many-rare-words'
  /** An implausibly large share of everything on the board. */
  | 'too-much-of-board'
  /** Gaps between words so even they look automated. */
  | 'robotic-timing';

export const PLAUSIBILITY_RULES = {
  /** Fastest believable time to trace a word: a base plus per letter. */
  minTraceMs: (letters: number) => 150 + 70 * letters,
  tooFastCount: 3,
  // A full solver dump runs about 40% rare words; people (and house players)
  // stay well under this.
  rareShare: 0.35,
  rareMinWords: 10,
  boardShare: 0.6,
  timingMinWords: 12,
  /** Coefficient of variation of the gaps between words. Humans are lumpy. */
  minGapVariation: 0.15,
} as const;

export function checkPlausibility(finds: readonly TimedFind[], solved: Solved): { plausible: boolean; flags: PlausibilityFlag[] } {
  const r = PLAUSIBILITY_RULES;
  const flags: PlausibilityFlag[] = [];
  const ordered = [...finds].sort((a, b) => a.atMs - b.atMs);

  let fast = 0;
  const gaps: number[] = [];
  for (let i = 1; i < ordered.length; i++) {
    const gap = ordered[i].atMs - ordered[i - 1].atMs;
    gaps.push(gap);
    if (gap < r.minTraceMs(ordered[i].word.length)) fast++;
  }
  if (fast >= r.tooFastCount) flags.push('too-fast');

  const info = new Map(solved.words.map((s) => [s.word, s]));
  if (ordered.length >= r.rareMinWords) {
    const rare = ordered.filter((f) => (info.get(f.word.toUpperCase())?.commonness ?? 4) === 4).length;
    if (rare / ordered.length > r.rareShare) flags.push('too-many-rare-words');
  }

  const points = ordered.reduce((sum, f) => sum + (info.get(f.word.toUpperCase())?.points ?? 0), 0);
  if (solved.maxScore > 0 && points / solved.maxScore > r.boardShare) flags.push('too-much-of-board');

  if (gaps.length + 1 >= r.timingMinWords) {
    const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const sd = Math.sqrt(gaps.reduce((a, b) => a + (b - mean) ** 2, 0) / gaps.length);
    if (mean > 0 && sd / mean < r.minGapVariation) flags.push('robotic-timing');
  }

  return { plausible: flags.length === 0, flags };
}
