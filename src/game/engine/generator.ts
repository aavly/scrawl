import type { Board } from './board';
import type { Dictionary } from './dictionary';
import { createRng, type Rng } from './rng';
import { solveBoard, type Solved } from './solver';

// Letter weights, roughly English frequency tuned for word games. No Q: a lone
// Q is nearly unplayable, and harder letters are a later mode (DESIGN.md §16).
const LETTER_WEIGHTS: Record<string, number> = {
  E: 12, A: 9, I: 8, O: 8, U: 4,
  T: 9, N: 7, S: 7, R: 7, L: 5, H: 4, D: 4, C: 3, G: 3, M: 3, P: 3,
  B: 2, F: 2, Y: 2, W: 2, K: 1.5, V: 1.5, X: 0.5, J: 0.4, Z: 0.4,
};
const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);
const RARE = new Set(['J', 'K', 'V', 'X', 'Z']);
const LETTERS = Object.keys(LETTER_WEIGHTS);
const TOTAL_WEIGHT = LETTERS.reduce((sum, l) => sum + LETTER_WEIGHTS[l], 0);

export type BoardRules = {
  size: number;
  /** Reject boards with fewer findable words. */
  minWords: number;
  /** Reject boards whose longest word is shorter. */
  minLongestWord: number;
  maxAttempts: number;
};

// Calibrated on 300 random boards (2026-11-02): median 97 words, bottom 10%
// under 47 words or with no word longer than 6 letters.
export const DEFAULT_BOARD_RULES: BoardRules = { size: 4, minWords: 70, minLongestWord: 6, maxAttempts: 60 };

export type GeneratedBoard = { board: Board; solved: Solved; seed: number; attempts: number };

function drawLetter(rng: Rng): string {
  let r = rng() * TOTAL_WEIGHT;
  for (const l of LETTERS) {
    r -= LETTER_WEIGHTS[l];
    if (r <= 0) return l;
  }
  return 'E';
}

function drawLetters(rng: Rng, count: number): string[] {
  const minVowels = Math.round(count * 0.25);
  const maxVowels = Math.round(count * 0.45);
  for (;;) {
    const letters: string[] = [];
    const counts: Record<string, number> = {};
    while (letters.length < count) {
      const l = drawLetter(rng);
      const limit = RARE.has(l) ? 1 : 3;
      if ((counts[l] ?? 0) >= limit) continue;
      counts[l] = (counts[l] ?? 0) + 1;
      letters.push(l);
    }
    const vowels = letters.filter((l) => VOWELS.has(l)).length;
    if (vowels >= minVowels && vowels <= maxVowels) return letters;
  }
}

/**
 * Generates a playable board from a seed. The same seed always gives the same
 * board, so both players (and later the server) can rebuild it.
 */
export function generateBoard(seed: number, dictionary: Dictionary, rules: Partial<BoardRules> = {}): GeneratedBoard {
  const r = { ...DEFAULT_BOARD_RULES, ...rules };
  const rng = createRng(seed);
  let best: GeneratedBoard | null = null;

  for (let attempt = 1; attempt <= r.maxAttempts; attempt++) {
    const board: Board = { size: r.size, letters: drawLetters(rng, r.size * r.size) };
    const solved = solveBoard(board, dictionary);
    const candidate = { board, solved, seed, attempts: attempt };
    const longest = solved.words.reduce((m, w) => Math.max(m, w.word.length), 0);
    if (solved.words.length >= r.minWords && longest >= r.minLongestWord) return candidate;
    if (!best || solved.words.length > best.solved.words.length) best = candidate;
  }
  return best!;
}
