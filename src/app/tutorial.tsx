// Tutorial, part 1 (user feedback, 2026-11-03): learn on your own first. No
// opponent and no clock: Pip coaches three words, then offers a first match
// (part 2 is a normal round against a gentle Pip, mode "tutorial").

import { router } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

import { CoachBubble } from '@/components/round/CoachBubble';
import { StickerButton } from '@/components/StickerButton';
import { newSeed } from '@/features/match/matchStore';
import { useProfile } from '@/features/profile/ProfileProvider';
import { RoundView } from '@/features/round/RoundView';
import { useLocalRound } from '@/features/round/useLocalRound';
import { useTheme } from '@/theme';

/** The DESIGN.md sample board, which the tutorial mockup uses. */
const LEARN_BOARD = 'CHAS/LORT/ENIE/PSDA';

type Step = { say: string; word?: string; path?: number[] };

// Short lines only: one instruction each.
const STEPS: Step[] = [
  // O(5) down to N(9), left to E(8).
  { say: 'Start on the O. Slide down to N, then left to E.', word: 'ONE', path: [5, 9, 8] },
  // T(7) diagonally to I(10), down to D(14), diagonally to E(11).
  { say: 'Diagonals count too. Trace TIDE.', word: 'TIDE', path: [7, 10, 14, 11] },
  { say: 'Your turn. Find any word.' },
];

export default function Tutorial() {
  const { colors, type } = useTheme();
  const { profile } = useProfile();
  const [seed] = useState(1);
  const r = useLocalRound('pip', seed, { boardText: LEARN_BOARD, untimed: true });
  const found = new Set(r.player.finds.map((f) => f.word));

  // The first step whose word isn't found yet; the free step needs any new word.
  const guidedDone = STEPS.filter((s) => s.word).every((s) => found.has(s.word!));
  const freeDone = guidedDone && r.player.finds.some((f) => !STEPS.some((s) => s.word === f.word));
  const stepIndex = STEPS.findIndex((s) => (s.word ? !found.has(s.word) : !freeDone));
  const step = stepIndex >= 0 ? STEPS[stepIndex] : null;

  // Point at the next letter of a guided word while the trace follows it.
  const traced = r.trace.look === 'tracing' ? r.trace.path : [];
  const path = step?.path;
  const following = !!path && traced.every((t, i) => t === path[i]);
  const hintTile = path && following && traced.length < path.length ? path[traced.length] : null;

  const playPip = () => router.replace({ pathname: '/reveal', params: { mode: 'tutorial', opponent: 'pip', seed: String(newSeed()) } });

  return (
    <RoundView
      board={r.board}
      msLeft={r.msLeft}
      me={{ avatar: profile.avatar, username: profile.username, score: r.player.score }}
      opponent={{ player: r.opponent, score: 0 }}
      word={r.word}
      finds={r.player.finds}
      highlightNewest={r.highlightNewest}
      duplicate={r.duplicate}
      trace={r.trace}
      onTraceChange={r.onTraceChange}
      onTraceEnd={r.onTraceEnd}
      hintTile={hintTile}
      header={
        step ? (
          <CoachBubble speaker="pip" label={`PIP · STEP ${stepIndex + 1} OF ${STEPS.length}`} text={step.say} />
        ) : (
          <CoachBubble
            speaker="pip"
            label="PIP · YOU'RE READY"
            text="Nice! Now play me."
            action={
              <StickerButton onPress={playPip} fill={colors.cobalt} radius={16} contentStyle={{ alignItems: 'center', paddingVertical: 10 }}>
                <Text style={[type.cardTitle, { color: colors.paper }]}>Play Pip</Text>
              </StickerButton>
            }
          />
        )
      }
    />
  );
}
