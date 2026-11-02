import Svg, { Path } from 'react-native-svg';

export type IconName = 'check' | 'x' | 'repeat' | 'up' | 'down';

// Simple stroked icons in a 24×24 box, drawn in the sticker style's thick line.
const PATHS: Record<IconName, string> = {
  check: 'M5 12.5l4.5 4.5L19 7.5',
  x: 'M6 6l12 12M18 6L6 18',
  repeat: 'M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4',
  up: 'M3 17L12 5l9 12z',
  down: 'M3 7l9 12 9-12z',
};

const FILLED = new Set<IconName>(['up', 'down']);

export function Icon({ name, size = 20, color, strokeWidth = 3 }: { name: IconName; size?: number; color: string; strokeWidth?: number }) {
  const filled = FILLED.has(name);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d={PATHS[name]}
        fill={filled ? color : 'none'}
        stroke={filled ? 'none' : color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
