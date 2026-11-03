import type { ReactNode } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import type { ShadowName } from '@/theme';

import { StickerBox } from './StickerBox';

type Props = {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
  fill?: string;
  shadow?: ShadowName;
  radius?: number;
  borderStyle?: 'solid' | 'dashed';
  /** Outer layout: size, flex, margins. */
  style?: StyleProp<ViewStyle>;
  /** Inside the outline: padding, alignment. */
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * A tappable sticker. The whole sticker, outline included, is the touch
 * target, and it presses down into its shadow while held so every tap shows.
 */
export function StickerButton({
  children,
  onPress,
  accessibilityLabel,
  disabled,
  fill,
  shadow = 'step',
  radius,
  borderStyle,
  style,
  contentStyle,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      hitSlop={6}
      style={style}
    >
      {({ pressed }) => (
        <StickerBox
          fill={fill}
          shadow={shadow}
          radius={radius}
          borderStyle={borderStyle}
          pressed={pressed}
          style={{ flexGrow: 1 }}
          contentStyle={contentStyle}
        >
          {children}
        </StickerBox>
      )}
    </Pressable>
  );
}
