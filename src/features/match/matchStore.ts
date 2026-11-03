// Hands a finished match from the round screen to the results screen. Word
// lists are too long for route params, and a result only needs to live until
// the next match starts.

import type { HousePlayerId } from '@/game/housePlayers';
import type { MatchMode, MatchResult } from '@/game/results';

export type FinishedMatch = { result: MatchResult; opponentId: HousePlayerId; seed: number };

let last: FinishedMatch | null = null;

export function setLastMatch(match: FinishedMatch) {
  last = match;
}

export function lastMatch(): FinishedMatch | null {
  return last;
}

export function newSeed(): number {
  return Math.floor(Math.random() * 2 ** 31);
}

/** Route params shared by Reveal, Round and Results. */
export type MatchParams = { mode: MatchMode; opponent: HousePlayerId; seed: string };
