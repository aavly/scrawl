import { neighbours, type Board } from './board';
import type { Commonness, Dictionary } from './dictionary';
import { MIN_WORD_LENGTH, pointsForWord } from './scoring';

export type Solution = {
  /** Upper case. */
  word: string;
  /** One path that spells it. */
  path: number[];
  points: number;
  commonness: Commonness;
};

export type Solved = {
  /** Every findable word, longest and highest-scoring first, then alphabetical. */
  words: Solution[];
  /** The score for finding every word. */
  maxScore: number;
};

/** Finds every dictionary word that can be traced on the board. */
export function solveBoard(board: Board, dictionary: Dictionary): Solved {
  const adj = neighbours(board.size);
  const letters = board.letters.map((l) => l.toLowerCase());
  const found = new Map<string, number[]>();
  const used = new Array<boolean>(letters.length).fill(false);
  const path: number[] = [];

  const visit = (tile: number, prefix: string) => {
    const word = prefix + letters[tile];
    if (!dictionary.hasPrefix(word)) return;
    used[tile] = true;
    path.push(tile);
    if (word.length >= MIN_WORD_LENGTH && !found.has(word) && dictionary.has(word)) found.set(word, [...path]);
    for (const next of adj[tile]) if (!used[next]) visit(next, word);
    path.pop();
    used[tile] = false;
  };

  for (let t = 0; t < letters.length; t++) visit(t, '');

  const words: Solution[] = [...found.entries()].map(([w, p]) => ({
    word: w.toUpperCase(),
    path: p,
    points: pointsForWord(w),
    commonness: dictionary.commonness(w),
  }));
  words.sort((a, b) => b.points - a.points || a.word.localeCompare(b.word));
  return { words, maxScore: words.reduce((sum, s) => sum + s.points, 0) };
}
