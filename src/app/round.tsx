// A round against a house player, on the device. Reached from the specimen
// page for now; Finding, Reveal and Results wrap it in step 4.

import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StickerBox } from '@/components/StickerBox';
import { RoundView } from '@/features/round/RoundView';
import { useLocalRound } from '@/features/round/useLocalRound';
import { isHousePlayerId, type HousePlayerId } from '@/game/housePlayers';
import { useTheme } from '@/theme';

// Sample player until profiles exist (DESIGN.md §6).
const ME = { avatar: 'marlow', username: 'wordfox_' } as const;

export default function RoundScreen() {
  // ?seed= replays a specific board, for testing and bug reports.
  const params = useLocalSearchParams<{ opponent?: string; seed?: string }>();
  const opponentId: HousePlayerId = params.opponent && isHousePlayerId(params.opponent) ? params.opponent : 'bolt';
  const [seed, setSeed] = useState(() => (params.seed ? Number(params.seed) : Math.floor(Math.random() * 2 ** 31)));
  // Remount on rematch so the round starts fresh.
  return <Round key={seed} opponentId={opponentId} seed={seed} onRematch={() => setSeed(Math.floor(Math.random() * 2 ** 31))} />;
}

function Round({ opponentId, seed, onRematch }: { opponentId: HousePlayerId; seed: number; onRematch: () => void }) {
  const r = useLocalRound(opponentId, seed);
  return (
    <RoundView
      board={r.board}
      msLeft={r.msLeft}
      me={{ ...ME, score: r.player.score }}
      opponent={{ player: r.opponent, score: r.opponentScore, bubble: r.bubble }}
      word={r.word}
      finds={r.player.finds}
      highlightNewest={r.highlightNewest}
      duplicate={r.duplicate}
      trace={r.trace}
      disabled={r.finished}
      onTraceChange={r.onTraceChange}
      onTraceEnd={r.onTraceEnd}
      overlay={
        r.finished && (
          <EndCard
            you={r.player.score}
            them={r.opponentScore}
            opponentName={r.opponent.name}
            words={r.player.finds.length}
            possible={r.solved.words.length}
            onRematch={onRematch}
          />
        )
      }
    />
  );
}

/** Temporary end-of-round card until the Results screen arrives in step 4. */
function EndCard(props: { you: number; them: number; opponentName: string; words: number; possible: number; onRematch: () => void }) {
  const { colors, type } = useTheme();
  const result = props.you > props.them ? 'YOU WIN!' : props.you < props.them ? 'SO CLOSE' : 'TIE!';
  return (
    <View style={[StyleSheet.absoluteFill, styles.center, { backgroundColor: 'rgba(20,20,20,.55)', padding: 28 }]}>
      <StickerBox shadow="cardLarge" contentStyle={{ padding: 20, gap: 12, alignItems: 'center' }} style={{ alignSelf: 'stretch' }}>
        <Text style={[type.scoreResults, { color: props.you >= props.them ? colors.mint : colors.bubblegum }]}>{result}</Text>
        <Text style={[type.bodyStrong, { color: colors.cardText }]}>
          You {props.you.toLocaleString('en-US')} · {props.opponentName} {props.them.toLocaleString('en-US')}
        </Text>
        <Text style={[type.monoLabel, { color: colors.cardText }]}>
          {props.words} OF {props.possible} WORDS FOUND
        </Text>
        <StickerBox fill={colors.cobalt} shadow="step" radius={22} style={{ alignSelf: 'stretch', height: 60 }}>
          <Pressable accessibilityRole="button" onPress={props.onRematch} style={[styles.fill, styles.center]}>
            <Text style={[type.cardTitle, { color: colors.paper }]}>Rematch</Text>
          </Pressable>
        </StickerBox>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={{ padding: 8 }}>
          <Text style={[type.bodyStrong, { color: colors.cardText }]}>Back</Text>
        </Pressable>
      </StickerBox>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
});
