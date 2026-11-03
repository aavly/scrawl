// Turns a finished round into what the Results screen shows. Plain logic, no UI.

import { ratingChange, type RatingChange } from './engine/rating';
import type { Solved } from './engine/solver';

export type MatchMode = 'ranked' | 'practice' | 'tutorial';

export type ResultWord = { word: string; points: number; /** Only this player found it. */ unique: boolean };

export type MatchResult = {
  mode: MatchMode;
  outcome: 'win' | 'loss' | 'tie';
  you: { score: number; words: ResultWord[] };
  them: { score: number; words: ResultWord[] };
  /** Ranked only. */
  rating: RatingChange | null;
  oldRating: number;
  /** The three best words you didn't find: familiar words first, never mild words. */
  missed: { word: string; points: number }[];
};

type Input = {
  mode: MatchMode;
  solved: Solved;
  yourWords: readonly string[];
  theirWords: readonly string[];
  yourRating: number;
  /** A human's rating, or a house player's hidden rating. */
  theirRating: number;
  rankedPlayed: number;
};

export function buildMatchResult(input: Input): MatchResult {
  const info = new Map(input.solved.words.map((s) => [s.word, s]));
  const points = (w: string) => info.get(w)?.points ?? 0;
  const yours = new Set(input.yourWords);
  const theirs = new Set(input.theirWords);

  // Highest-scoring first, then alphabetical (DESIGN.md §6 sample order).
  const list = (words: Set<string>, other: Set<string>): ResultWord[] =>
    [...words]
      .map((word) => ({ word, points: points(word), unique: !other.has(word) }))
      .sort((a, b) => b.points - a.points || a.word.localeCompare(b.word));

  const you = { words: list(yours, theirs), score: 0 };
  const them = { words: list(theirs, yours), score: 0 };
  you.score = you.words.reduce((s, w) => s + w.points, 0);
  them.score = them.words.reduce((s, w) => s + w.points, 0);
  const outcome = you.score > them.score ? 'win' : you.score < them.score ? 'loss' : 'tie';

  const rating =
    input.mode === 'ranked'
      ? ratingChange({
          playerRating: input.yourRating,
          opponentRating: input.theirRating,
          playerScore: you.score,
          opponentScore: them.score,
          matchesPlayed: input.rankedPlayed,
        })
      : null;

  // Suggest words a player could have known: everyday and familiar words
  // first (by points), obscure ones only if there aren't enough.
  const unfound = input.solved.words.filter((s) => !yours.has(s.word) && !s.mild);
  const missed = [...unfound.filter((s) => s.commonness <= 2), ...unfound.filter((s) => s.commonness > 2)]
    .slice(0, 3)
    .map((s) => ({ word: s.word, points: s.points }));

  return { mode: input.mode, outcome, you, them, rating, oldRating: input.yourRating, missed };
}
