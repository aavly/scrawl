import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { useTheme, type ShadowName } from '@/theme';

type Props = Omit<ViewProps, 'style'> & {
  children?: ReactNode;
  /** Face colour. Defaults to the theme's card colour. */
  fill?: string;
  /** Hard shadow preset from the theme, or null for none. */
  shadow?: ShadowName | null;
  radius?: number;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed';
  borderColor?: string;
  /**
   * Pressed look: the face drops towards its shadow until only the
   * "pressed" offset shows, so the shadow's far edge stays put (DESIGN.md §3.3).
   */
  pressed?: boolean;
  /** Outer layout: size, flex, margins, alignment. */
  style?: StyleProp<ViewStyle>;
  /** Inside the outline: padding, content alignment. */
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * The outlined, hard-shadowed "sticker" surface used by cards, buttons, tiles
 * and chips. The shadow is a solid underlay view rather than a platform shadow,
 * so it renders identically on iOS, Android and web (Android elevation cannot
 * draw a hard offset shadow).
 */
export function StickerBox({
  children,
  fill,
  shadow = 'card',
  radius,
  borderWidth,
  borderStyle = 'solid',
  borderColor,
  pressed = false,
  style,
  contentStyle,
  ...viewProps
}: Props) {
  const theme = useTheme();
  const r = radius ?? theme.radii.card;
  const base = shadow ? theme.shadows[shadow] : null;
  const rest = theme.shadows.pressed;
  const shift = pressed && base ? { x: base.x - rest.x, y: Math.max(0, base.y - rest.y) } : null;

  return (
    <View style={style} {...viewProps}>
      {base && (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              transform: [{ translateX: base.x }, { translateY: base.y }],
              borderRadius: r,
              backgroundColor: theme.colors.shadow,
            },
          ]}
        />
      )}
      <View
        style={[
          styles.face,
          {
            backgroundColor: fill ?? theme.colors.card,
            borderRadius: r,
            borderWidth: borderWidth ?? theme.outline.standard,
            borderStyle,
            borderColor: borderColor ?? theme.colors.line,
          },
          shift && { transform: [{ translateX: shift.x }, { translateY: shift.y }] },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // The face fills the outer box so callers can size the sticker from outside.
  face: { flexGrow: 1 },
});
