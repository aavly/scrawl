// The first-run tutorial (DESIGN.md §5.2): a real round against a gentle Pip
// on the sample board, with Pip coaching the first word, ONE.

import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar/Avatar';
import { StickerBox } from '@/components/StickerBox';
import { setLastMatch } from '@/features/match/matchStore';
import { useProfile } from '@/features/profile/ProfileProvider';
import { recordMatch } from '@/features/profile/recordMatch';
import { RoundView } from '@/features/round/RoundView';
import { useLocalRound } from '@/features/round/useLocalRound';
import { TUTORIAL_PIP_STYLE } from '@/game/housePlayers';
import { buildMatchResult } from '@/game/results';
import { lineHeightFor, useTheme } from '@/theme';

/** The DESIGN.md sample board, which the tutorial mockup uses. */
const TUTORIAL_BOARD = 'CHAS/LORT/ENIE/PSDA';
/** O, N, E on that board. */
const FIRST_WORD = { word: 'ONE', path: [5, 9, 8] };
const SEED = 7;

export default function Tutorial() {
  const { profile, update } = useProfile();
  const r = useLocalRound('pip', SEED, { boardText: TUTORIAL_BOARD, style: TUTORIAL_PIP_STYLE });
  const foundFirst = r.player.finds.some((f) => f.word === FIRST_WORD.word);
  const done = useRef(false);
  const toResults = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Point at the next letter of ONE while the trace is following it.
  const traced = r.trace.look === 'tracing' ? r.trace.path : [];
  const following = traced.every((t, i) => t === FIRST_WORD.path[i]);
  const hintTile = !foundFirst && following && traced.length < FIRST_WORD.path.length ? FIRST_WORD.path[traced.length] : null;

  const coachText = foundFirst
    ? 'Nice one! Longer words score way more. Find as many as you can before the time runs out.'
    : traced.length >= 2 && following
      ? 'Drag across touching letters. Diagonals count! Slide on to the E to finish ONE.'
      : 'Drag across touching letters. Start on the O and slide down to the N.';

  useEffect(() => () => {
    if (toResults.current) clearTimeout(toResults.current);
  }, []);

  useEffect(() => {
    if (!r.finished || done.current) return;
    done.current = true;
    const result = buildMatchResult({
      mode: 'tutorial',
      solved: r.solved,
      yourWords: r.player.finds.map((f) => f.word),
      theirWords: r.opponentFinds.map((f) => f.word),
      yourRating: profile.rating,
      theirRating: r.opponent.hiddenRating,
      rankedPlayed: profile.rankedPlayed,
    });
    setLastMatch({ result, opponentId: 'pip', seed: SEED });
    update((p) => recordMatch(p, result));
    toResults.current = setTimeout(() => router.replace('/tutorial-results'), 1100);
  }, [r.finished, r.solved, r.player.finds, r.opponentFinds, r.opponent, profile, update]);

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
      hintTile={hintTile}
      coach={<CoachCard text={coachText} />}
    />
  );
}

function CoachCard({ text }: { text: string }) {
  const { colors, fonts } = useTheme();
  return (
    <StickerBox radius={22} contentStyle={styles.coach} accessibilityLiveRegion="polite">
      <Avatar id="pip" size={52} />
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={{ fontFamily: fonts.mono[700], fontSize: 11, lineHeight: lineHeightFor(11), letterSpacing: 0.44, color: colors.cardText }}>
          PIP · YOUR PRACTICE PARTNER
        </Text>
        <Text style={{ fontFamily: fonts.display[700], fontSize: 16, lineHeight: 20, color: colors.cardText }}>{text}</Text>
      </View>
    </StickerBox>
  );
}

const styles = StyleSheet.create({
  coach: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
});
