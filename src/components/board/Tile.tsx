import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';

import { StickerBox } from '@/components/StickerBox';
import { useTheme } from '@/theme';

export type TileState = 'idle' | 'selected' | 'valid' | 'duplicate' | 'invalid';

type Props = {
  letter: string;
  state: TileState;
  /** Position in the current word (1..n), shown as a badge. */
  order?: number;
  /** Tutorial hint: a dashed Bubblegum ring around an idle tile. */
  hint?: boolean;
  size: number;
};

/** One letter tile (DESIGN.md §4.1). Sizes scale from the 80px design. */
export const Tile = memo(function Tile({ letter, state, order, hint, size }: Props) {
  const { colors, fonts } = useTheme();
  const s = size / 80;
  const radius = Math.round(size * 0.2);
  const pressed = state !== 'idle';
  const fill = {
    idle: colors.tile,
    selected: colors.bubblegum,
    valid: colors.mint,
    duplicate: colors.butter,
    invalid: colors.paper,
  }[state];
  const badge = Math.round(20 * s);

  return (
    <View style={{ width: size, height: size }}>
      {hint && (
        <View
          pointerEvents="none"
          style={[styles.hint, { borderRadius: radius + 5, borderColor: colors.bubblegum }]}
        />
      )}
      <StickerBox
        fill={fill}
        shadow="step"
        pressed={pressed}
        radius={radius}
        borderStyle={state === 'duplicate' ? 'dashed' : 'solid'}
        borderColor={colors.ink}
        style={{ width: size, height: size }}
        contentStyle={[styles.face, { overflow: 'hidden' }]}
      >
        {state === 'invalid' && <Hatch color={colors.hatch} size={size} />}
        {order !== undefined && (
          <View
            style={[
              styles.badge,
              {
                width: badge,
                height: badge,
                borderRadius: badge / 2,
                left: Math.round(3 * s),
                top: Math.round(3 * s),
                backgroundColor: colors.ink,
              },
            ]}
          >
            <Text style={{ fontFamily: fonts.mono[700], fontSize: Math.max(8, Math.round(11 * s)), lineHeight: Math.max(10, Math.round(13 * s)), color: colors.butter }}>
              {order}
            </Text>
          </View>
        )}
        <Text
          style={{
            fontFamily: fonts.display[800],
            fontSize: Math.round(40 * s),
            lineHeight: Math.round(46 * s),
            color: colors.ink,
          }}
        >
          {letter}
        </Text>
      </StickerBox>
    </View>
  );
});

/** White and hatch-grey 45° stripes, 6px bands, for an invalid word (§4.1). */
function Hatch({ color, size }: { color: string; size: number }) {
  return (
    <Svg style={StyleSheet.absoluteFill} width={size} height={size} pointerEvents="none">
      <Defs>
        <Pattern id="hatch" width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <Line x1={3} y1={0} x2={3} y2={12} stroke={color} strokeWidth={6} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#hatch)" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  face: { alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  hint: { position: 'absolute', left: -5, top: -5, right: -5, bottom: -5, borderWidth: 3, borderStyle: 'dashed' },
});
