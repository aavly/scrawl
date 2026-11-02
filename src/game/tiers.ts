// The rank ladder (DESIGN.md §8). Plain data, no UI: shared by the app, the
// web build and the server.

export type TierFamily = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'legend';
/** 2 is the lower division ("II"), 1 the upper ("I"). Legend has none. */
export type Division = 1 | 2 | null;

export type Tier = {
  id: string;
  name: string;
  family: TierFamily;
  division: Division;
  /** Lowest rating in this tier. */
  min: number;
};

export const TIERS: readonly Tier[] = [
  { id: 'bronze2', name: 'BRONZE II', family: 'bronze', division: 2, min: 1200 },
  { id: 'bronze1', name: 'BRONZE I', family: 'bronze', division: 1, min: 1300 },
  { id: 'silver2', name: 'SILVER II', family: 'silver', division: 2, min: 1400 },
  { id: 'silver1', name: 'SILVER I', family: 'silver', division: 1, min: 1500 },
  { id: 'gold2', name: 'GOLD II', family: 'gold', division: 2, min: 1600 },
  { id: 'gold1', name: 'GOLD I', family: 'gold', division: 1, min: 1700 },
  { id: 'plat2', name: 'PLATINUM II', family: 'platinum', division: 2, min: 1800 },
  { id: 'plat1', name: 'PLATINUM I', family: 'platinum', division: 1, min: 1900 },
  { id: 'dia2', name: 'DIAMOND II', family: 'diamond', division: 2, min: 2000 },
  { id: 'dia1', name: 'DIAMOND I', family: 'diamond', division: 1, min: 2100 },
  { id: 'legend', name: 'LEGEND', family: 'legend', division: null, min: 2200 },
];

export type TierId = (typeof TIERS)[number]['id'];

export const START_RATING = 1300;
export const RATING_FLOOR = 1000;

/** The tier for a rating. Ratings below 1,200 (down to the 1,000 floor) show as Bronze II. */
export function tierForRating(rating: number): Tier {
  let tier = TIERS[0];
  for (const t of TIERS) if (rating >= t.min) tier = t;
  return tier;
}

export function tierById(id: string): Tier | undefined {
  return TIERS.find((t) => t.id === id);
}

/** Points needed to reach the next tier, or null at Legend. */
export function pointsToNextTier(rating: number): { next: Tier; points: number } | null {
  const next = TIERS.find((t) => t.min > rating);
  return next ? { next, points: next.min - rating } : null;
}
