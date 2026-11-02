// Rating maths (docs/PRODUCT.md "Rating"). The numbers are beta placeholders.

import { RATING_FLOOR } from '../tiers';

export const RATING_RULES = {
  k: 32,
  kPlacement: 48,
  kHigh: 24,
  placementMatches: 10,
  highRatingFrom: 2000,
  cap: 40,
  capPlacement: 60,
  /** Losses cost this share of the base change, whatever the margin. */
  lossFactor: 0.75,
  /** Win margin (share of the winner's score) → multiplier. Checked top down. */
  marginTiers: [
    { from: 0.5, multiplier: 1.5 },
    { from: 0.25, multiplier: 1.3 },
    { from: 0.1, multiplier: 1.15 },
    { from: 0, multiplier: 1 },
  ],
} as const;

export type RatingInput = {
  playerRating: number;
  /** A human's rating, or a house player's hidden rating. */
  opponentRating: number;
  playerScore: number;
  opponentScore: number;
  /** Ranked matches the player had finished before this one. */
  matchesPlayed: number;
  /** False if the player's win looked inhuman: no margin bonus. Defaults to true. */
  plausible?: boolean;
};

export type RatingChange = {
  delta: number;
  newRating: number;
  result: 'win' | 'loss' | 'tie';
  multiplier: number;
};

export function expectedScore(player: number, opponent: number): number {
  return 1 / (1 + 10 ** ((opponent - player) / 400));
}

export function marginMultiplier(winnerScore: number, loserScore: number): number {
  if (winnerScore <= 0) return 1;
  const margin = (winnerScore - loserScore) / winnerScore;
  return RATING_RULES.marginTiers.find((t) => margin >= t.from)!.multiplier;
}

export function ratingChange(input: RatingInput): RatingChange {
  const r = RATING_RULES;
  const placement = input.matchesPlayed < r.placementMatches;
  const k = placement ? r.kPlacement : input.playerRating >= r.highRatingFrom ? r.kHigh : r.k;
  const cap = placement ? r.capPlacement : r.cap;

  const result = input.playerScore > input.opponentScore ? 'win' : input.playerScore < input.opponentScore ? 'loss' : 'tie';
  const actual = result === 'win' ? 1 : result === 'loss' ? 0 : 0.5;
  const base = k * (actual - expectedScore(input.playerRating, input.opponentRating));

  let multiplier = 1;
  if (result === 'win' && input.plausible !== false) multiplier = marginMultiplier(input.playerScore, input.opponentScore);
  // Losses (and ties that cost points) are softened, never amplified.
  if (base < 0) multiplier = r.lossFactor;

  const raw = Math.max(-cap, Math.min(cap, base * multiplier));
  // Round half away from zero so +16.5 and −16.5 behave the same way.
  let delta = Math.sign(raw) * Math.round(Math.abs(raw));
  if (delta === 0) delta = 0; // avoid −0
  const newRating = Math.max(RATING_FLOOR, input.playerRating + delta);
  return { delta: newRating - input.playerRating, newRating, result, multiplier };
}
