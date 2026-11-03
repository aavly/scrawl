// A ranked, practice or tutorial round against a house player, on the
// device. When the clock runs out the result is recorded and Results (or the
// tutorial's results) takes over.

import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';

import { setLastMatch } from '@/features/match/matchStore';
import { useProfile } from '@/features/profile/ProfileProvider';
import { recordMatch } from '@/features/profile/recordMatch';
import { RoundView } from '@/features/round/RoundView';
import { useLocalRound } from '@/features/round/useLocalRound';
import { isHousePlayerId, TUTORIAL_PIP_STYLE, type HousePlayerId } from '@/game/housePlayers';
import { buildMatchResult, type MatchMode } from '@/game/results';

/** A beat after the buzzer before Results, so the end isn't abrupt. */
const END_PAUSE_MS = 1100;

export default function RoundScreen() {
  // ?seed= replays a specific board, for testing and bug reports.
  const params = useLocalSearchParams<{ mode?: string; opponent?: string; seed?: string }>();
  const mode: MatchMode = params.mode === 'practice' || params.mode === 'tutorial' ? params.mode : 'ranked';
  const opponentId: HousePlayerId = params.opponent && isHousePlayerId(params.opponent) ? params.opponent : 'bolt';
  const seed = params.seed ? Number(params.seed) : 1;
  const { profile, update } = useProfile();
  // The tutorial match uses a gentler Pip so a new player can win it.
  const r = useLocalRound(opponentId, seed, mode === 'tutorial' ? { style: TUTORIAL_PIP_STYLE } : {});
  const done = useRef(false);
  const toResults = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (toResults.current) clearTimeout(toResults.current);
  }, []);

  useEffect(() => {
    if (!r.finished || done.current) return;
    done.current = true;
    const result = buildMatchResult({
      mode,
      solved: r.solved,
      yourWords: r.player.finds.map((f) => f.word),
      theirWords: r.opponentFinds.map((f) => f.word),
      yourRating: profile.rating,
      theirRating: r.opponent.hiddenRating,
      rankedPlayed: profile.rankedPlayed,
    });
    setLastMatch({ result, opponentId, seed });
    update((p) => recordMatch(p, result));
    // Not cleaned up by this effect: recording the match changes the profile,
    // which re-runs it, and that must not cancel the move to Results.
    toResults.current = setTimeout(() => router.replace(mode === 'tutorial' ? '/tutorial-results' : '/results'), END_PAUSE_MS);
  }, [r.finished, r.solved, r.player.finds, r.opponentFinds, r.opponent, mode, opponentId, seed, profile, update]);

  return (
    <RoundView
      board={r.board}
      msLeft={r.msLeft}
      me={{ avatar: profile.avatar, username: profile.username, score: r.player.score }}
      opponent={{ player: r.opponent, score: r.opponentScore, bubble: r.bubble }}
      word={r.word}
      finds={r.player.finds}
      highlightNewest={r.highlightNewest}
      duplicate={r.duplicate}
      trace={r.trace}
      disabled={r.finished}
      onTraceChange={r.onTraceChange}
      onTraceEnd={r.onTraceEnd}
    />
  );
}
