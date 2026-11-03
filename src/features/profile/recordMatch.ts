import { pointsForWord } from '@/game/engine/scoring';
import type { MatchResult } from '@/game/results';

import type { Profile } from './ProfileProvider';

/**
 * The profile after a match. Rating, wins and losses move on ranked matches
 * only; best word and high score count from ranked and practice (not the
 * tutorial).
 */
export function recordMatch(profile: Profile, result: MatchResult): Profile {
  if (result.mode === 'tutorial') return { ...profile, tutorialDone: true };
  const next = { ...profile };
  const best = result.you.words[0];
  if (best && (!next.bestWord || best.points > pointsForWord(next.bestWord))) next.bestWord = best.word;
  next.highScore = Math.max(next.highScore, result.you.score);
  if (result.mode === 'ranked' && result.rating) {
    next.rating = result.rating.newRating;
    next.rankedPlayed += 1;
    if (result.outcome === 'win') next.wins += 1;
    if (result.outcome === 'loss') next.losses += 1;
  }
  return next;
}
