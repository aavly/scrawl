import type { Board } from './board';
import type { Dictionary } from './dictionary';
import { MIN_WORD_LENGTH, pointsForWord } from './scoring';
import { readTrace } from './trace';

export const ROUND_MS = 80_000;

export type SubmitResult =
  | { kind: 'valid'; word: string; points: number; score: number }
  | { kind: 'duplicate'; word: string; score: number }
  | { kind: 'invalid'; word: string; score: number }
  | { kind: 'too-short'; word: string; score: number }
  | { kind: 'bad-trace'; score: number };

export type Find = { word: string; points: number; atMs: number };

/**
 * One player's side of a round: what they've found and their score. Pure
 * logic; the UI and the server both drive it with traced paths.
 */
export class PlayerRound {
  private readonly found = new Map<string, Find>();
  private total = 0;

  constructor(
    private readonly board: Board,
    private readonly dictionary: Dictionary,
  ) {}

  get score(): number {
    return this.total;
  }

  /** Found words, newest first. */
  get finds(): Find[] {
    return [...this.found.values()].reverse();
  }

  submit(path: readonly number[], atMs: number): SubmitResult {
    const trace = readTrace(this.board, path);
    if (!trace.ok) return { kind: 'bad-trace', score: this.total };
    const word = trace.word;
    if (word.length < MIN_WORD_LENGTH) return { kind: 'too-short', word, score: this.total };
    if (this.found.has(word)) return { kind: 'duplicate', word, score: this.total };
    if (!this.dictionary.has(word)) return { kind: 'invalid', word, score: this.total };
    const points = pointsForWord(word);
    this.found.set(word, { word, points, atMs });
    this.total += points;
    return { kind: 'valid', word, points, score: this.total };
  }
}
