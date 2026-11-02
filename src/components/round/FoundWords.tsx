import { useEffect, useRef, type ComponentRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { useTheme } from '@/theme';

type Props = {
  /** Found words, newest first. */
  words: { word: string; points: number }[];
  /** Highlight the newest chip in Mint with its points (just after a valid word). */
  highlightNewest: boolean;
  /** A duplicate: this word's chip moves to the front, turns Butter and wiggles. */
  duplicate?: { word: string; key: number } | null;
  compact?: boolean;
};

const TILTS = [-1.5, 1, -1, 1.5];

/**
 * One bounded row of found words (DESIGN.md §4.6): newest first, never grows,
 * so the board never moves. Older words scroll sideways behind a fade, with a
 * count pinned at the right.
 */
export function FoundWords({ words, highlightNewest, duplicate, compact }: Props) {
  const { colors, fonts } = useTheme();
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);
  const height = compact ? 30 : 38;

  // A duplicate jumps to the front.
  const ordered = duplicate ? [...words.filter((w) => w.word === duplicate.word), ...words.filter((w) => w.word !== duplicate.word)] : words;

  useEffect(() => {
    scroller.current?.scrollTo({ x: 0, animated: false });
  }, [words.length, duplicate?.key]);

  return (
    <View style={{ height }} accessibilityLabel={`${words.length} words found`}>
      <ScrollView ref={scroller} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {ordered.map((w, i) => {
          const isDuplicate = duplicate?.word === w.word && i === 0;
          const isNew = highlightNewest && i === 0 && !duplicate;
          return (
            <Chip
              key={w.word}
              label={isNew ? `${w.word} +${w.points.toLocaleString('en-US')}` : w.word}
              fill={isNew ? colors.mint : isDuplicate ? colors.butter : colors.card}
              color={isNew || isDuplicate ? colors.ink : colors.cardText}
              dashed={isDuplicate}
              tilt={TILTS[i % TILTS.length]}
              wiggleKey={isDuplicate ? duplicate?.key : undefined}
              compact={compact}
            />
          );
        })}
        <View style={{ width: 70 }} />
      </ScrollView>
      <Svg pointerEvents="none" width={70} height={height} style={styles.fade}>
        <Defs>
          <LinearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={colors.bg} stopOpacity={0} />
            <Stop offset="0.55" stopColor={colors.bg} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect width={70} height={height} fill="url(#fade)" />
      </Svg>
      <View style={[styles.count, { height: compact ? 26 : 30, minWidth: compact ? 26 : 30, borderColor: colors.line, backgroundColor: colors.ink }]}>
        <Text style={{ fontFamily: fonts.mono[700], fontSize: 12, color: colors.butter }}>{words.length}</Text>
      </View>
    </View>
  );
}

function Chip({
  label,
  fill,
  color,
  dashed,
  tilt,
  wiggleKey,
  compact,
}: {
  label: string;
  fill: string;
  color: string;
  dashed: boolean;
  tilt: number;
  wiggleKey?: number;
  compact?: boolean;
}) {
  const { colors, fonts } = useTheme();
  const reduced = useReducedMotion();
  const wiggle = useSharedValue(0);
  useEffect(() => {
    if (wiggleKey !== undefined && !reduced) {
      wiggle.value = withSequence(withTiming(-3, { duration: 80 }), withTiming(3, { duration: 80 }), withTiming(0, { duration: 80 }));
    }
  }, [wiggleKey, reduced, wiggle]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${tilt + wiggle.value}deg` }] }));

  return (
    <Animated.View style={style}>
      <View style={[styles.chipShadow, { backgroundColor: colors.shadow, borderRadius: 10 }]} />
      <View style={[styles.chip, { backgroundColor: fill, borderColor: colors.line, borderStyle: dashed ? 'dashed' : 'solid' }]}>
        <Text style={{ fontFamily: fonts.display[800], fontSize: compact ? 13 : 15, color }}>{label}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', gap: 8, paddingHorizontal: 2, paddingBottom: 3 },
  chip: { borderWidth: 2, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 1 },
  chipShadow: { ...StyleSheet.absoluteFill, transform: [{ translateX: 2 }, { translateY: 2 }] },
  fade: { position: 'absolute', right: 0, top: 0 },
  count: { position: 'absolute', right: 0, alignSelf: 'center', top: 4, borderWidth: 2, borderRadius: 99, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center' },
});
