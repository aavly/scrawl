import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { cancelAnimation, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/theme';

/** Round timer (DESIGN.md §4.3): a circle with M:SS, Bubblegum with a pulsing ring in the last 10 s. */
export function Timer({ msLeft, compact }: { msLeft: number; compact?: boolean }) {
  const { colors, fonts } = useTheme();
  const reduced = useReducedMotion();
  const seconds = Math.ceil(msLeft / 1000);
  const hot = seconds <= 10;
  const size = compact ? 58 : 74;
  const label = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  const ring = useSharedValue(0);
  useEffect(() => {
    if (hot && !reduced) ring.value = withRepeat(withTiming(1, { duration: 1000 }), -1, false);
    else {
      cancelAnimation(ring);
      ring.value = 0;
    }
  }, [hot, reduced, ring]);
  const ringStyle = useAnimatedStyle(() => ({ opacity: 0.8 * (1 - ring.value), transform: [{ scale: 1 + ring.value * 0.5 }] }));

  return (
    <View
      accessible
      accessibilityRole="timer"
      accessibilityLabel={`${seconds} seconds left`}
      style={[styles.wrap, { width: size, height: size }]}
    >
      {hot && <Animated.View style={[styles.ring, { borderRadius: size / 2, borderColor: colors.bubblegum }, ringStyle]} />}
      <View style={[styles.shadow, { borderRadius: size / 2, backgroundColor: colors.shadow }]} />
      <View
        style={[
          styles.face,
          {
            borderRadius: size / 2,
            borderColor: colors.line,
            backgroundColor: hot ? colors.bubblegum : colors.text,
          },
        ]}
      >
        <Text style={{ fontFamily: fonts.mono[700], fontSize: compact ? 17 : hot ? 24 : 21, color: hot ? colors.ink : colors.bg }}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center' },
  ring: { ...StyleSheet.absoluteFill, borderWidth: 4 },
  shadow: { ...StyleSheet.absoluteFill, transform: [{ translateY: 4 }] },
  face: { ...StyleSheet.absoluteFill, borderWidth: 3, alignItems: 'center', justifyContent: 'center' },
});
