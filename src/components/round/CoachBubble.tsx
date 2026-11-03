import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Avatar, type AvatarId } from '@/components/avatar/Avatar';
import { lineHeightFor, useTheme } from '@/theme';

type Props = {
  speaker: AvatarId;
  /** Small mono label above the line, e.g. "PIP · STEP 1 OF 3". */
  label: string;
  text: string;
  /** Optional button under the text. */
  action?: ReactNode;
  compact?: boolean;
};

/**
 * A house player talking: avatar plus a cream speech bubble with a tail. It
 * deliberately has no hard shadow and no card fill, so it never reads as one
 * of the players' score cards (user feedback, 2026-11-03).
 */
export function CoachBubble({ speaker, label, text, action, compact }: Props) {
  const { colors, fonts } = useTheme();
  const size = compact ? 15 : 17;
  return (
    <View style={styles.row} accessibilityLiveRegion="polite" accessibilityLabel={`${label}. ${text}`}>
      <Avatar id={speaker} size={compact ? 44 : 56} />
      <View style={styles.bubbleWrap}>
        <Svg width={14} height={22} style={styles.tail} viewBox="0 0 14 22">
          <Path d="M14 1 L1 11 L14 21" fill={colors.cream} stroke={colors.ink} strokeWidth={3} strokeLinejoin="round" />
        </Svg>
        <View style={[styles.bubble, { backgroundColor: colors.cream, borderColor: colors.ink }]}>
          <Text style={{ fontFamily: fonts.mono[700], fontSize: 10, lineHeight: lineHeightFor(10), letterSpacing: 0.6, color: colors.ink }}>{label}</Text>
          <Text style={{ fontFamily: fonts.display[800], fontSize: size, lineHeight: lineHeightFor(size), color: colors.ink }}>{text}</Text>
          {action}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bubbleWrap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  // Overlaps the bubble's border by the stroke width so the join is seamless.
  tail: { marginRight: -3, zIndex: 1 },
  bubble: { flex: 1, borderWidth: 3, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, gap: 4 },
});
