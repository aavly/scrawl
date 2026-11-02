// Design tokens from docs/design/DESIGN.md §3. This is the only file that holds
// raw colour values; components read everything through useTheme().

export const accents = {
  cobalt: '#2F4BFF',
  bubblegum: '#FF5FA2',
  mint: '#19D3A2',
  butter: '#FFD84A',
  ink: '#141414',
  paper: '#FFFFFF',
  hatch: '#D3D3E0',
  cream: '#FFF6D6',
} as const;

// Fixed UI colours that don't change with the theme (§4.1, §4.7, §7.3).
export const ui = {
  tileHover: '#FFF1A8',
  disabledFill: '#CFC8AE',
  disabledText: '#4A4A4A',
  lockedFill: '#E9E4D0',
} as const;

// Tier chip fill and text colours (§3.1). Used only inside tier chips.
export const tierColors = {
  bronze: { fill: '#E39A5B', text: accents.ink },
  silver: { fill: '#DADDE8', text: accents.ink },
  gold: { fill: '#FFD84A', text: accents.ink },
  platinum: { fill: '#9FE8F2', text: accents.ink },
  diamond: { fill: '#2F4BFF', text: accents.paper },
  legend: { fill: '#141414', text: '#FFD84A' },
} as const;

// Keyboard and screen-reader focus ring (§4.1).
export const focusRing = { color: accents.cobalt, width: 4, offset: 3 } as const;

export type Palette = {
  bg: string;
  dot: string;
  text: string;
  muted: string;
  card: string;
  cardText: string;
  line: string;
  shadow: string;
  tile: string;
  board: string;
  /** Hairline dividers inside cards. */
  soft: string;
};

export const butter: Palette = {
  bg: '#FFD84A',
  dot: 'rgba(20,20,20,.13)',
  text: '#141414',
  muted: '#3B3B3B',
  card: '#FFFFFF',
  cardText: '#141414',
  line: '#141414',
  shadow: '#141414',
  tile: '#FFFFFF',
  board: '#2F4BFF',
  soft: 'rgba(20,20,20,.08)',
};

export const night: Palette = {
  bg: '#17142E',
  dot: 'rgba(255,246,214,.07)',
  text: '#FFF6D6',
  muted: '#C9C3E8',
  card: '#2A2552',
  cardText: '#FFF6D6',
  line: '#0B0A1A',
  shadow: '#0B0A1A',
  tile: '#FFFFFF',
  board: '#2F4BFF',
  soft: 'rgba(255,246,214,.10)',
};

// Each weight is its own font family, because Android ignores fontWeight for
// custom fonts.
export const fontFamilies = {
  display: {
    400: 'BricolageGrotesque_400Regular',
    500: 'BricolageGrotesque_500Medium',
    600: 'BricolageGrotesque_600SemiBold',
    700: 'BricolageGrotesque_700Bold',
    800: 'BricolageGrotesque_800ExtraBold',
  },
  mono: {
    400: 'SpaceMono_400Regular',
    700: 'SpaceMono_700Bold',
  },
} as const;

// Type scale from §3.2. letterSpacing is in px (em × size).
export const type = {
  display: { fontFamily: fontFamilies.display[800], fontSize: 54 },
  screenTitle: { fontFamily: fontFamilies.display[800], fontSize: 32 },
  scoreHeader: { fontFamily: fontFamilies.display[800], fontSize: 40 },
  scoreHeaderCompact: { fontFamily: fontFamilies.display[800], fontSize: 26 },
  scoreResults: { fontFamily: fontFamilies.display[800], fontSize: 44 },
  ratingHero: { fontFamily: fontFamilies.display[800], fontSize: 96 },
  tracedWord: { fontFamily: fontFamilies.display[800], fontSize: 42, letterSpacing: 42 * 0.08 },
  tileLetter: { fontFamily: fontFamilies.display[800], fontSize: 40 },
  cardTitle: { fontFamily: fontFamilies.display[800], fontSize: 19 },
  body: { fontFamily: fontFamilies.display[500], fontSize: 17 },
  bodyStrong: { fontFamily: fontFamilies.display[600], fontSize: 17 },
  monoLabel: { fontFamily: fontFamilies.mono[700], fontSize: 12, letterSpacing: 12 * 0.1 },
  timer: { fontFamily: fontFamilies.mono[700], fontSize: 25 },
  timerUrgent: { fontFamily: fontFamilies.mono[700], fontSize: 30 },
} as const;

// Score numerals step down by character count so five- and six-figure scores
// never wrap (§4.2). Index by the formatted string's length, comma included.
export const scoreSizes = {
  boardFull: { 5: 40, 6: 34, 7: 30 },
  boardCompact: { 5: 26, 6: 22, 7: 19 },
  results: { 5: 44, 6: 38, 7: 33 },
} as const;

export function scoreFontSize(kind: keyof typeof scoreSizes, formatted: string): number {
  const sizes = scoreSizes[kind];
  if (formatted.length <= 5) return sizes[5];
  if (formatted.length === 6) return sizes[6];
  return sizes[7];
}

// §3.3
export const outline = { standard: 3, small: 2 } as const;

export const radii = {
  tile: 16,
  board: 30,
  scoreCard: 16,
  card: 20,
  cardLarge: 28,
  button: 22,
  buttonLarge: 28,
  chip: 10,
  pill: 99,
} as const;

// Hard shadows: no blur, offset only, coloured with palette.shadow.
export const shadows = {
  card: { x: 4, y: 5 },
  cardLarge: { x: 5, y: 6 },
  secondary: { x: 3, y: 4 },
  chip: { x: 2, y: 2 },
  step: { x: 0, y: 5 },
  stepLarge: { x: 0, y: 8 },
  pressed: { x: 0, y: 1 },
} as const;

export type ShadowName = keyof typeof shadows;

// How far a pressed tile or button drops (§3.3).
export const pressDepth = 4;

// §3.4. Top and bottom insets come from the device safe area, not fixed values.
export const spacing = {
  gutter: 16,
  gutterTight: 12,
  gutterWide: 20,
  stackGap: 12,
  bottomPadding: 28,
  minTapTarget: 44,
} as const;

// Gameplay-only dot background (§3.3).
export const dotGrid = { spacing: 18, radius: 1.5 } as const;
