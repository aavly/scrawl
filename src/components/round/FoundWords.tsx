import { useEffect, useRef, type ComponentRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { lineHeightFor, useTheme } from '@/theme';

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
 * Found words, wrapped and newest first, so players can see how much they've
 * found (user decision, 2026-11-03). The area takes the spare height between
 * the word bar and the board: it never pushes the board, which stays put at
 * the bottom. Words that don't fit scroll, with a fade and a count.
 */
export function FoundWords({ words, highlightNewest, duplicate, compact }: Props) {
  const { colors, fonts } = useTheme();
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);

  // A duplicate jumps to the front.
  const ordered = duplicate ? [...words.filter((w) => w.word === duplicate.word), ...words.filter((w) => w.word !== duplicate.word)] : words;

  useEffect(() => {
    scroller.current?.scrollTo({ y: 0, animated: false });
  }, [words.length, duplicate?.key]);

  return (
    <View style={[styles.area, { minHeight: compact ? 30 : 38 }]} accessibilityLabel={`${words.length} words found`}>
      <ScrollView ref={scroller} showsVerticalScrollIndicator={false} contentContainerStyle={styles.wrap}>
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
      </ScrollView>
      <Svg pointerEvents="none" width="100%" height={24} style={styles.fade}>
        <Defs>
          <LinearGradient id="foundFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.bg} stopOpacity={0} />
            <Stop offset="1" stopColor={colors.bg} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height={24} fill="url(#foundFade)" />
      </Svg>
      {words.length > 0 && (
        <View style={[styles.count, { borderColor: colors.line, backgroundColor: colors.ink }]}>
          <Text style={{ fontFamily: fonts.mono[700], fontSize: 12, lineHeight: lineHeightFor(12), color: colors.butter }}>{words.length}</Text>
        </View>
      )}
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
  const size = compact ? 13 : 15;

  return (
    <Animated.View style={[styles.chipSpace, style]}>
      <View style={[styles.chipShadow, { backgroundColor: colors.shadow }]} />
      <View style={[styles.chip, { backgroundColor: fill, borderColor: colors.line, borderStyle: dashed ? 'dashed' : 'solid' }]}>
        <Text style={{ fontFamily: fonts.display[800], fontSize: size, lineHeight: lineHeightFor(size), color }}>{label}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1 },
  // Margins, not gap, on wrapping rows (see CLAUDE.md). Right padding keeps
  // chips clear of the count pill.
  wrap: { flexDirection: 'row', flexWrap: 'wrap', paddingTop: 2, paddingLeft: 2, paddingRight: 40, paddingBottom: 20 },
  chipSpace: { marginRight: 8, marginBottom: 8 },
  chip: { borderWidth: 2, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 1 },
  chipShadow: { ...StyleSheet.absoluteFill, borderRadius: 10, transform: [{ translateX: 2 }, { translateY: 2 }] },
  fade: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  count: {
    position: 'absolute',
    right: 0,
    top: 0,
    minWidth: 30,
    height: 30,
    borderWidth: 2,
    borderRadius: 99,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
