import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Appearance, useColorScheme } from 'react-native';

import {
  accents,
  butter,
  dotGrid,
  focusRing,
  fontFamilies,
  night,
  outline,
  pressDepth,
  radii,
  shadows,
  spacing,
  tierColors,
  type,
  ui,
  type Palette,
} from './tokens';

export type ThemeName = 'butter' | 'night';

export type Theme = {
  name: ThemeName;
  isDark: boolean;
  colors: Palette & typeof accents & typeof ui;
  tierColors: typeof tierColors;
  focusRing: typeof focusRing;
  fonts: typeof fontFamilies;
  type: typeof type;
  outline: typeof outline;
  radii: typeof radii;
  shadows: typeof shadows;
  pressDepth: typeof pressDepth;
  spacing: typeof spacing;
  dotGrid: typeof dotGrid;
};

/** What the player picked in Settings. "system" follows the phone's light or dark mode. */
export type ThemeChoiceValue = 'system' | ThemeName;

// New players follow their phone: Butter in light mode, Night in dark mode
// (user decision, 2026-11-03). Settings can pin either theme.
export const DEFAULT_THEME_CHOICE: ThemeChoiceValue = 'system';
const STORAGE_KEY = 'settings.theme';

function buildTheme(name: ThemeName): Theme {
  const palette = name === 'night' ? night : butter;
  return {
    name,
    isDark: name === 'night',
    colors: { ...accents, ...ui, ...palette },
    tierColors,
    focusRing,
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

type ThemeChoice = {
  /** The saved choice. */
  choice: ThemeChoiceValue;
  /** The theme actually showing. */
  theme: ThemeName;
  setChoice: (choice: ThemeChoiceValue) => void;
};

const ThemeContext = createContext<Theme>(buildTheme('butter'));
const ThemeChoiceContext = createContext<ThemeChoice>({ choice: DEFAULT_THEME_CHOICE, theme: 'butter', setChoice: () => {} });

/** Reads the saved theme choice. Resolves to the default if nothing is saved or storage fails. */
export async function loadThemeChoice(): Promise<ThemeChoiceValue> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    return saved === 'night' || saved === 'butter' || saved === 'system' ? saved : DEFAULT_THEME_CHOICE;
  } catch {
    return DEFAULT_THEME_CHOICE;
  }
}

type Props = {
  children: ReactNode;
  /** The saved choice, loaded before first paint by the root layout. */
  initial?: ThemeChoiceValue;
  /** Forces a theme for a subtree, for previews and tests. Does not save. */
  override?: ThemeName;
};

export function ThemeProvider({ children, initial = DEFAULT_THEME_CHOICE, override }: Props) {
  const [choice, setChoiceState] = useState<ThemeChoiceValue>(initial);
  const phone = useColorScheme();
  const resolved: ThemeName = choice === 'system' ? (phone === 'dark' ? 'night' : 'butter') : choice;
  const name = override ?? resolved;

  const setChoice = useCallback((next: ThemeChoiceValue) => {
    setChoiceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  // Keep native UI (keyboard, system dialogs, scroll indicators) in step with
  // a pinned theme; "unspecified" hands control back to the phone.
  // react-native-web has no setColorScheme, so this is native only.
  useEffect(() => {
    if (!override && typeof Appearance.setColorScheme === 'function') {
      Appearance.setColorScheme(choice === 'system' ? 'unspecified' : choice === 'night' ? 'dark' : 'light');
    }
  }, [choice, override]);

  const theme = useMemo(() => buildTheme(name), [name]);
  const choiceValue = useMemo(() => ({ choice, theme: resolved, setChoice }), [choice, resolved, setChoice]);

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
