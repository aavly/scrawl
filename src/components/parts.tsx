// Small shared pieces of the sticker style: headline slams, tags, level pips,
// progress bars, the back-and-title header and confetti.

import { router } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { StickerButton } from '@/components/StickerButton';
import { lineHeightFor, useTheme } from '@/theme';

/** A rotated headline sticker that slams in ("YOU WIN!", "BOLT STEPPED UP"). */
export function Headline({ text, fill, size = 44 }: { text: string; fill: string; size?: number }) {
  const { colors, fonts } = useTheme();
  const reduced = useReducedMotion();
  const scale = useSharedValue(reduced ? 1 : 1.6);
  useEffect(() => {
    if (!reduced) scale.value = withSpring(1, { damping: 11, stiffness: 220 });
  }, [reduced, scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: '-3deg' }, { scale: scale.value }] }));
  return (
    <Animated.View style={[styles.headlineWrap, style]} accessibilityRole="header">
      <View style={[styles.headlineShadow, { backgroundColor: colors.shadow }]} />
      <View style={[styles.headline, { backgroundColor: fill, borderColor: colors.ink }]}>
        <Text adjustsFontSizeToFit numberOfLines={1} style={{ fontFamily: fonts.display[800], fontSize: size, lineHeight: size * 1.1, color: colors.ink }}>
          {text}
        </Text>
      </View>
    </Animated.View>
  );
}

/** Ink pill with white mono text: HOUSE PLAYER, WINNER, country codes. */
export function Tag({ label, fill, color, outline }: { label: string; fill?: string; color?: string; outline?: string }) {
  const { colors, fonts } = useTheme();
  return (
    <View style={[styles.tag, { backgroundColor: fill ?? colors.ink, borderColor: outline ?? colors.ink }]}>
      <Text style={{ fontFamily: fonts.mono[700], fontSize: 12, lineHeight: lineHeightFor(12), letterSpacing: 0.6, color: color ?? colors.paper }}>
        {label}
      </Text>
    </View>
  );
}

/** Five 9×16 bars filled up to the level (DESIGN.md §4.10). */
export function LevelPips({ level, color, size = 1 }: { level: number; color: string; size?: number }) {
  return (
    <View style={styles.pips} accessibilityLabel={`Level ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <View
          key={n}
          style={{
            width: 9 * size,
            height: 16 * size,
            borderRadius: 3,
            borderWidth: 2,
            borderColor: color,
            backgroundColor: n <= level ? color : 'transparent',
          }}
        />
      ))}
    </View>
  );
}

/** Outlined bar with a Cobalt fill (DESIGN.md §4.7). `value` is 0–1. */
export function ProgressBar({ value, height = 18 }: { value: number; height?: number }) {
  const { colors } = useTheme();
  const pct = `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%` as const;
  return (
    <View style={[styles.bar, { height, borderColor: colors.ink, backgroundColor: colors.paper }]}>
      <View style={{ width: pct, height: '100%', backgroundColor: colors.cobalt, borderRightWidth: value > 0 && value < 1 ? 3 : 0, borderColor: colors.ink }} />
    </View>
  );
}

/** Round back button and a screen title (Practice, House players …). */
export function ScreenHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  const { colors, type } = useTheme();
  return (
    <View style={styles.header}>
      <StickerButton
        onPress={onBack ?? (() => router.back())}
        accessibilityLabel="Back"
        shadow="secondary"
        radius={22}
        style={{ width: 44, height: 44 }}
        contentStyle={styles.center}
      >
        <Svg width={20} height={20} viewBox="0 0 24 24">
          <Path d="M15 5l-7 7 7 7" fill="none" stroke={colors.cardText} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </StickerButton>
      <Text style={[type.screenTitle, { color: colors.text, flex: 1 }]} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

/** A few flat confetti shapes behind a win headline. Decorative. */
export function Confetti({ style }: { style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <Svg width="100%" height="100%">
        <Path d="M60 8 L72 30 L48 30 Z" fill={colors.cobalt} stroke={colors.ink} strokeWidth={2} />
        <Rect x={10} y={48} width={14} height={14} rx={3} fill={colors.bubblegum} stroke={colors.ink} strokeWidth={2} transform="rotate(20 17 55)" />
        <Circle cx={18} cy={98} r={8} fill={colors.mint} stroke={colors.ink} strokeWidth={2} />
        <Circle cx={348} cy={50} r={9} fill={colors.cobalt} stroke={colors.ink} strokeWidth={2} />
      </Svg>
    </View>
  );
}

export function Row({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.row, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  headlineWrap: { alignSelf: 'center' },
  headlineShadow: { ...StyleSheet.absoluteFill, borderRadius: 22, transform: [{ translateX: 5 }, { translateY: 6 }] },
  headline: { borderWidth: 4, borderRadius: 22, paddingHorizontal: 22, paddingVertical: 6 },
  tag: { alignSelf: 'center', borderWidth: 2, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 2 },
  pips: { flexDirection: 'row', gap: 3 },
  bar: { width: '100%', borderWidth: 3, borderRadius: 99, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 },
});
