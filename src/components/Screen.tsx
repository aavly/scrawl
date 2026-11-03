import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DotBackground } from '@/components/DotBackground';
import { useTheme } from '@/theme';

type Props = {
  children: ReactNode;
  /** The dotted backdrop: gameplay and matchmaking screens only (DESIGN.md §3.3). */
  dots?: boolean;
  scroll?: boolean;
  /** Pinned under the content, e.g. Rematch and Home on Results. */
  footer?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

/** Background, safe-area padding and gutters for a full screen. */
export function Screen({ children, dots, scroll, footer, contentStyle }: Props) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const padding = {
    paddingTop: insets.top + 16,
    paddingHorizontal: spacing.gutter,
    paddingBottom: footer ? 16 : insets.bottom + 24,
    gap: 16,
  };
  return (
    <View style={[styles.fill, { backgroundColor: colors.bg }]}>
      {dots && <DotBackground />}
      {scroll ? (
        <ScrollView style={styles.fill} contentContainerStyle={[padding, contentStyle]}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fill, padding, contentStyle]}>{children}</View>
      )}
      {footer && <View style={{ paddingHorizontal: spacing.gutter, paddingBottom: insets.bottom + 16, gap: 12 }}>{footer}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
