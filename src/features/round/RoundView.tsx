// The board screen's layout, with no game logic: the live round and the dev
// state previews both render it.

import { useEffect, type ReactNode } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { AvatarId } from '@/components/avatar/Avatar';
import { Board, type TraceLook } from '@/components/board/Board';
import { boardLayout } from '@/components/board/geometry';
import { DotBackground } from '@/components/DotBackground';
import { Icon } from '@/components/icons';
import { FoundWords, OpponentWords } from '@/components/round/FoundWords';
import { ScoreCard, SubPill } from '@/components/round/ScoreCard';
import { Timer } from '@/components/round/Timer';
import { WordDisplay, type WordLook } from '@/components/round/WordDisplay';
import { StickerBox } from '@/components/StickerBox';
import type { Board as BoardData } from '@/game/engine/board';
import type { HousePlayer } from '@/game/housePlayers';
import { lineHeightFor, useTheme } from '@/theme';

export type RoundViewProps = {
  board: BoardData;
  msLeft: number;
  me: { avatar: AvatarId; username: string; score: number };
  /** `found` is how many words the opponent has; leave it out for solo play (the tutorial's learning part). */
  opponent: { player: HousePlayer; score: number; found?: number; bubble?: { text: string; key: number } | null };
  word: { look: WordLook; text: string; points?: number; exclamation?: string; key: number };
  finds: { word: string; points: number }[];
  highlightNewest: boolean;
  duplicate: { word: string; key: number } | null;
  trace: { path: number[]; look: TraceLook };
  disabled?: boolean;
  onTraceChange: (path: number[]) => void;
  onTraceEnd: (path: number[]) => void;
  /** Drawn over the whole screen, e.g. a dialog. */
  overlay?: ReactNode;
  /** Replaces the score cards and timer, e.g. Pip's coaching in the tutorial. */
  header?: ReactNode;
  /** Tutorial: the tile to point at next. */
  hintTile?: number | null;
};

export function RoundView(p: RoundViewProps) {
  const { colors, fonts, type } = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const layout = boardLayout(width, height, height - insets.top - insets.bottom);
  const compact = layout.mode === 'compact';
  const diff = p.me.score - p.opponent.score;
  const last10 = !p.disabled && p.msLeft <= 10_000 && p.msLeft > 0;

  if (layout.tile === 0) {
    return (
      <View style={[styles.fill, styles.center, { backgroundColor: colors.bg, padding: 24 }]}>
        <StickerBox contentStyle={{ padding: 20 }}>
          <Text style={[type.cardTitle, { color: colors.cardText, textAlign: 'center' }]}>This screen is too small to play</Text>
        </StickerBox>
      </View>
    );
  }

  const youFooter =
    diff > 0 ? (
      <SubPill label={`AHEAD ${diff.toLocaleString('en-US')}`} fill={colors.mint} color={colors.ink} icon={<Icon name="up" size={9} color={colors.ink} />} />
    ) : diff < 0 ? (
      <SubPill label={`BEHIND ${(-diff).toLocaleString('en-US')}`} fill={colors.paper} color={colors.ink} icon={<Icon name="down" size={9} color={colors.ink} />} />
    ) : (
      <Text style={{ fontFamily: fonts.mono[700], fontSize: 10, lineHeight: lineHeightFor(10), color: colors.cardText }}>{p.me.username}</Text>
    );

  return (
    <View style={[styles.fill, { backgroundColor: colors.bg }]}>
      <DotBackground />
      <View
        style={[
          styles.fill,
          {
            // Room above the cards for the opponent's "+points" bubble.
            paddingTop: Math.max(insets.top, 14) + (compact ? 4 : 6),
            paddingBottom: insets.bottom + (compact ? 14 : 22),
            paddingHorizontal: 12,
            gap: compact ? 8 : 14,
          },
        ]}
      >
        {p.header ?? (
          <View style={styles.header}>
            <ScoreCard side="you" avatar={p.me.avatar} name="YOU" score={p.me.score} footer={youFooter} compact={compact} />
            <Timer msLeft={p.msLeft} compact={compact} />
            <ScoreCard
              side="opponent"
              avatar={p.opponent.player.id}
              name={p.opponent.player.name.toUpperCase()}
              score={p.opponent.score}
              footer={<SubPill label={`LV ${p.opponent.player.level} · ${p.opponent.player.label}`} fill={colors.ink} color={colors.paper} />}
              bubble={p.opponent.bubble}
              compact={compact}
            />
          </View>
        )}

        <WordDisplay
          look={p.word.look}
          word={p.word.text}
          points={p.word.points}
          exclamation={p.word.exclamation}
          resultKey={p.word.key}
          compact={compact}
        />
        {/* The found words fill the spare height above the board. */}
        <View style={styles.fill}>
          {p.opponent.found === undefined ? (
            <FoundWords words={p.finds} highlightNewest={p.highlightNewest} duplicate={p.duplicate} compact={compact} />
          ) : (
            // Your words on the left, the opponent's hidden words on the right.
            <View style={styles.split}>
              <View style={styles.yourSide}>
                <FoundWords
                  words={p.finds}
                  highlightNewest={p.highlightNewest}
                  duplicate={p.duplicate}
                  compact={compact}
                  label={`YOU · ${p.finds.length}`}
                />
              </View>
              <View style={styles.theirSide}>
                <OpponentWords count={p.opponent.found} label={`${p.opponent.player.name.toUpperCase()} · ${p.opponent.found}`} compact={compact} />
              </View>
            </View>
          )}
          {last10 && (
            <View style={[styles.last10Tag, { backgroundColor: colors.bubblegum, borderColor: colors.ink }]}>
              <Text style={{ fontFamily: fonts.mono[700], fontSize: 13, lineHeight: lineHeightFor(13), color: colors.ink }}>LAST 10!</Text>
            </View>
          )}
        </View>
        <View style={styles.center}>
          <Board
            board={p.board}
            tile={layout.tile}
            gap={layout.gap}
            path={p.trace.path}
            look={p.trace.look}
            hintTile={p.hintTile}
            disabled={p.disabled}
            onTraceChange={p.onTraceChange}
            onTraceEnd={p.onTraceEnd}
          />
        </View>
      </View>

      {last10 && <Last10Frame />}
      {p.overlay}
    </View>
  );
}

/** The 6px pulsing Bubblegum frame around the screen in the last 10 s (§13). */
function Last10Frame() {
  const { colors } = useTheme();
  const reduced = useReducedMotion();
  const pulse = useSharedValue(1);
  useEffect(() => {
    if (!reduced) pulse.value = withRepeat(withTiming(0.35, { duration: 500 }), -1, true);
    return () => cancelAnimation(pulse);
  }, [reduced, pulse]);
  const style = useAnimatedStyle(() => ({ opacity: pulse.value }));
  return <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { borderWidth: 6, borderColor: colors.bubblegum }, style]} />;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', gap: 8, alignItems: 'stretch' },
  split: { flex: 1, flexDirection: 'row', gap: 10 },
  yourSide: { flex: 3 },
  theirSide: { flex: 2 },
  last10Tag: { position: 'absolute', left: 6, bottom: 0, paddingHorizontal: 10, borderWidth: 3, borderRadius: 10, transform: [{ rotate: '-3deg' }] },
});
