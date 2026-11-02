import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Appearance } from 'react-native';

import {
  accents,
  butter,
  dotGrid,
  fontFamilies,
  night,
  outline,
  pressDepth,
  radii,
  shadows,
  spacing,
  type,
  type Palette,
} from './tokens';

export type ThemeName = 'butter' | 'night';

export type Theme = {
  name: ThemeName;
  isDark: boolean;
  colors: Palette & typeof accents;
  fonts: typeof fontFamilies;
  type: typeof type;
  outline: typeof outline;
  radii: typeof radii;
  shadows: typeof shadows;
  pressDepth: typeof pressDepth;
  spacing: typeof spacing;
  dotGrid: typeof dotGrid;
};

// Butter is the default. Night is only used when the player turns it on in
// Settings; the phone's own light/dark setting is ignored (user decision,
// 2026-11-01).
export const DEFAULT_THEME: ThemeName = 'butter';
const STORAGE_KEY = 'settings.theme';

function buildTheme(name: ThemeName): Theme {
  const palette = name === 'night' ? night : butter;
  return {
    name,
    isDark: name === 'night',
    colors: { ...accents, ...palette },
    fonts: fontFamilies,
    type,
    outline,
    radii,
    shadows,
    pressDepth,
    spacing,
    dotGrid,
  };
}

type ThemeChoice = { theme: ThemeName; setTheme: (name: ThemeName) => void };

const ThemeContext = createContext<Theme>(buildTheme(DEFAULT_THEME));
const ThemeChoiceContext = createContext<ThemeChoice>({ theme: DEFAULT_THEME, setTheme: () => {} });

/** Reads the saved theme choice. Resolves to the default if nothing is saved or storage fails. */
export async function loadThemeChoice(): Promise<ThemeName> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    return saved === 'night' || saved === 'butter' ? saved : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

type Props = {
  children: ReactNode;
  /** The saved choice, loaded before first paint by the root layout. */
  initial?: ThemeName;
  /** Forces a theme for a subtree, for previews and tests. Does not save. */
  override?: ThemeName;
};

export function ThemeProvider({ children, initial = DEFAULT_THEME, override }: Props) {
  const [choice, setChoice] = useState<ThemeName>(initial);
  const name = override ?? choice;

  const setTheme = useCallback((next: ThemeName) => {
    setChoice(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  // Keep native UI (keyboard, system dialogs, scroll indicators) in step with
  // the in-app theme rather than the phone's setting.
  useEffect(() => {
    if (!override) Appearance.setColorScheme(choice === 'night' ? 'dark' : 'light');
  }, [choice, override]);

  const theme = useMemo(() => buildTheme(name), [name]);
  const choiceValue = useMemo(() => ({ theme: choice, setTheme }), [choice, setTheme]);

  return (
    <ThemeChoiceContext.Provider value={choiceValue}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </ThemeChoiceContext.Provider>
  );
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

/** The player's saved theme choice and a setter, for the Settings toggle. */
export function useThemeChoice(): ThemeChoice {
  return useContext(ThemeChoiceContext);
}
