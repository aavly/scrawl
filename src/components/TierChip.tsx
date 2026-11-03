import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { tierById, type Tier, type TierFamily } from '@/game/tiers';
import { useTheme } from '@/theme';

type Size = 's' | 'm' | 'l';

type Props = {
  /** A tier id such as "gold2", or a Tier from tierForRating(). */
  tier: string | Tier;
  /** L on Home and Profile, M on Reveal and the ladder, S on score cards and leaderboard rows. */
  size?: Size;
};

const SIZES = {
  s: { fontSize: 10, paddingH: 7, paddingV: 0, border: 2 },
  m: { fontSize: 12, paddingH: 10, paddingV: 1, border: 2 },
  l: { fontSize: 15, paddingH: 14, paddingV: 3, border: 3 },
} as const;

// Family glyphs in a 24×24 box (DESIGN.md §4.9).
const GLYPHS: Record<TierFamily, string> = {
  bronze: 'M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z',
  silver: 'M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z',
  gold: 'M12 2l3 7 7 .6-5.3 4.7 1.7 7L12 17.5 5.6 21.3l1.7-7L2 9.6 9 9z',
  platinum: 'M12 2l9 5v10l-9 5-9-5V7z',
  diamond: 'M6 3h12l4 6-10 13L2 9z',
  legend: 'M2 18L4 7l5 5 3-8 3 8 5-5 2 11z',
};

/**
 * Rank pill. Family sets the colour and the glyph; dots in the glyph set the
 * division (one dot = II, two = I), so rank never relies on colour alone.
 */
export function TierChip({ tier, size = 'm' }: Props) {
  const theme = useTheme();
  const t = typeof tier === 'string' ? tierById(tier) : tier;
  if (!t) return null;
  const { fill, text } = theme.tierColors[t.family];
  const s = SIZES[size];

  return (
    <View
      accessible
      accessibilityLabel={`Rank: ${t.name.toLowerCase()}`}
      style={[
        styles.chip,
        {
          paddingHorizontal: s.paddingH,
          paddingVertical: s.paddingV,
          borderWidth: s.border,
          borderColor: theme.colors.line,
          backgroundColor: fill,
        },
      ]}
    >
      <Svg width={16} height={16} viewBox="0 0 24 24">
        <Path d={GLYPHS[t.family]} fill={text} stroke={text} strokeWidth={1.2} strokeLinejoin="round" />
        {/* Dots are cut out in the chip colour so they show on the glyph. */}
        {t.division === 2 && <Circle cx={12} cy={12} r={2} fill={fill} />}
        {t.division === 1 && (
          <>
            <Circle cx={9.5} cy={12} r={1.8} fill={fill} />
            <Circle cx={14.5} cy={12} r={1.8} fill={fill} />
          </>
        )}
      </Svg>
      <Text
        style={{
          fontFamily: theme.fonts.mono[700],
          fontSize: s.fontSize,
          lineHeight: s.fontSize + 5,
          letterSpacing: s.fontSize * 0.04,
          color: text,
        }}
      >
        {t.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 5, borderRadius: 99 },
});
