// Word reward ladder (DESIGN.md §13). Placeholder values, tuned in playtests.

export const MIN_WORD_LENGTH = 3;

const POINTS_BY_LENGTH: Record<number, number> = { 3: 100, 4: 300, 5: 600, 6: 1000, 7: 1600 };
const LONG_WORD_POINTS = 2400; // 8 letters and up

export function pointsForWord(word: string): number {
  if (word.length < MIN_WORD_LENGTH) return 0;
  return POINTS_BY_LENGTH[word.length] ?? LONG_WORD_POINTS;
}

/** The celebration label for a word (§13): none, NICE!, GREAT!, AMAZING! or LEGENDARY!. */
export function wordTier(word: string): 'none' | 'nice' | 'great' | 'amazing' | 'legendary' {
  if (word.length >= 8) return 'legendary';
  if (word.length === 7) return 'amazing';
  if (word.length === 6) return 'great';
  if (word.length === 5) return 'nice';
  return 'none';
}
