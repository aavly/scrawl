import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { loadProfile, ProfileProvider, type Profile } from '@/features/profile/ProfileProvider';
import { fontAssets, loadThemeChoice, ThemeProvider, useTheme, type ThemeChoiceValue } from '@/theme';

// Keep the splash screen up until the fonts, the saved theme and the profile
// are ready, so the first frame is already right.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const [savedTheme, setSavedTheme] = useState<ThemeChoiceValue | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const ready = (fontsLoaded || !!fontError) && savedTheme !== null && profile !== null;

  useEffect(() => {
    loadThemeChoice().then(setSavedTheme);
    loadProfile().then(setProfile);
  }, []);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider initial={savedTheme}>
          <ProfileProvider initial={profile}>
            <AppStack />
          </ProfileProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppStack() {
  const theme = useTheme();
  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.bg },
        }}
      />
    </>
  );
}
