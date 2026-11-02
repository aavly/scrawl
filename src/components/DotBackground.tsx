import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';

import { useTheme } from '@/theme';

/**
 * The dotted backdrop for gameplay and matchmaking screens only (Welcome,
 * Tutorial, Finding, Reveal, Board, Results). Navigation screens stay flat
 * (DESIGN.md §3.3).
 */
export function DotBackground() {
  const { colors, dotGrid } = useTheme();
  const s = dotGrid.spacing;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="dots" width={s} height={s} patternUnits="userSpaceOnUse">
            <Circle cx={s / 2} cy={s / 2} r={dotGrid.radius} fill={colors.dot} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#dots)" />
      </Svg>
    </View>
  );
}
