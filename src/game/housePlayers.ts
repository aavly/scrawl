// The house-player cast (DESIGN.md §6). Plain data, no UI. The engine's
// housePlay.ts turns a style into a round of timed finds.

export type HousePlayerId = 'pip' | 'dash' | 'bolt' | 'nova' | 'titan';

export type HousePlayer = {
  id: HousePlayerId;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  label: 'EASY' | 'CASUAL' | 'SKILLED' | 'HARD' | 'BRUTAL';
  /** Player ratings this house player is matched against, inclusive. */
  band: { min: number; max: number };
  /** Hidden rating used only for rating maths, never shown (docs/PRODUCT.md "Rating"). */
  hiddenRating: number;
  style: PlayStyle;
};

/** How a house player plays. First-pass numbers, to be tuned in the beta. */
export type PlayStyle = {
  /** Typical words found per round, and the random spread around it. */
  words: number;
  wordsSpread: number;
  /** Chance it knows a word, by commonness: everyday, familiar, uncommon, rare. */
  vocabulary: [number, number, number, number];
  /** Above 1 favours long words, below 1 short ones. Applied per letter over 3. */
  lengthBias: number;
  /** 0 spreads finds evenly over the round; higher front-loads them. */
  frontLoad: number;
};

export const HOUSE_PLAYERS: readonly HousePlayer[] = [
  {
    id: 'pip', name: 'Pip', level: 1, label: 'EASY', band: { min: 0, max: 1399 }, hiddenRating: 1300,
    // "Just discovered words": slow, short, everyday words.
    style: { words: 6, wordsSpread: 1, vocabulary: [0.9, 0.15, 0, 0], lengthBias: 0.6, frontLoad: 0 },
  },
  {
    id: 'dash', name: 'Dash', level: 2, label: 'CASUAL', band: { min: 1400, max: 1599 }, hiddenRating: 1500,
    // "Quick but sloppy": fast early, fades.
    style: { words: 9, wordsSpread: 2, vocabulary: [1, 0.4, 0.05, 0], lengthBias: 0.85, frontLoad: 0.8 },
  },
  {
    id: 'bolt', name: 'Bolt', level: 3, label: 'SKILLED', band: { min: 1600, max: 1799 }, hiddenRating: 1700,
    // "Solid all-rounder".
    style: { words: 13, wordsSpread: 2, vocabulary: [1, 0.8, 0.25, 0.02], lengthBias: 1.1, frontLoad: 0.2 },
  },
  {
    id: 'nova', name: 'Nova', level: 4, label: 'HARD', band: { min: 1800, max: 2099 }, hiddenRating: 1950,
    // "Finds the long ones".
    style: { words: 19, wordsSpread: 3, vocabulary: [1, 1, 0.6, 0.08], lengthBias: 1.5, frontLoad: 0.2 },
  },
  {
    id: 'titan', name: 'Titan', level: 5, label: 'BRUTAL', band: { min: 2100, max: Infinity }, hiddenRating: 2200,
    // "Hardly misses".
    style: { words: 27, wordsSpread: 3, vocabulary: [1, 1, 0.85, 0.15], lengthBias: 1.35, frontLoad: 0.1 },
  },
];

const byId = new Map(HOUSE_PLAYERS.map((h) => [h.id, h]));

export function housePlayer(id: HousePlayerId): HousePlayer {
  return byId.get(id)!;
}

export function isHousePlayerId(id: string): id is HousePlayerId {
  return byId.has(id as HousePlayerId);
}

/** The house player whose band contains the rating (the ranked fallback opponent). */
export function housePlayerForRating(rating: number): HousePlayer {
  return HOUSE_PLAYERS.find((h) => rating >= h.band.min && rating <= h.band.max) ?? HOUSE_PLAYERS[0];
}
