import { useEffect, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';

/**
 * Pops its child in, then (if holdMs is set) fades it out after that long.
 * Remount (change the key) to replay. With reduced motion it simply appears.
 */
export function Pop({ children, style, holdMs }: { children: ReactNode; style?: StyleProp<ViewStyle>; holdMs?: number }) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(reduced ? 1 : 0.4);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!reduced) scale.value = withSpring(1, { damping: 9, stiffness: 260 });
    if (holdMs !== undefined) {
      opacity.value = withDelay(holdMs, withSequence(withTiming(1, { duration: 0 }), withTiming(0, { duration: 250 })));
    }
  }, [reduced, holdMs, scale, opacity]);

  const animated = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ scale: scale.value }] }));
  return (
    <Animated.View pointerEvents="none" style={[style, animated]}>
      {children}
    </Animated.View>
  );
}
