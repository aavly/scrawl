// The house-player cast (DESIGN.md §6). Plain data, no UI. How each one plays
// is added with the game engine.

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
};

export const HOUSE_PLAYERS: readonly HousePlayer[] = [
  { id: 'pip', name: 'Pip', level: 1, label: 'EASY', band: { min: 0, max: 1399 }, hiddenRating: 1300 },
  { id: 'dash', name: 'Dash', level: 2, label: 'CASUAL', band: { min: 1400, max: 1599 }, hiddenRating: 1500 },
  { id: 'bolt', name: 'Bolt', level: 3, label: 'SKILLED', band: { min: 1600, max: 1799 }, hiddenRating: 1700 },
  { id: 'nova', name: 'Nova', level: 4, label: 'HARD', band: { min: 1800, max: 2099 }, hiddenRating: 1950 },
  { id: 'titan', name: 'Titan', level: 5, label: 'BRUTAL', band: { min: 2100, max: Infinity }, hiddenRating: 2200 },
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
