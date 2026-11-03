// The player's profile, kept on the device until accounts arrive in Stage 2.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { AvatarId } from '@/components/avatar/Avatar';
import { START_RATING } from '@/game/tiers';

export type Profile = {
  username: string;
  avatar: AvatarId;
  country: string;
  rating: number;
  /** Ranked matches finished, which drives the placement K factor. */
  rankedPlayed: number;
  wins: number;
  losses: number;
  bestWord: string | null;
  highScore: number;
  tutorialDone: boolean;
};

// Sample player (DESIGN.md §6) until sign-up chooses a real name in Stage 2.
export const NEW_PROFILE: Profile = {
  username: 'wordfox_',
  avatar: 'marlow',
  country: 'US',
  rating: START_RATING,
  rankedPlayed: 0,
  wins: 0,
  losses: 0,
  bestWord: null,
  highScore: 0,
  tutorialDone: false,
};

const STORAGE_KEY = 'profile.v1';

export async function loadProfile(): Promise<Profile> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    return saved ? { ...NEW_PROFILE, ...JSON.parse(saved) } : NEW_PROFILE;
  } catch {
    return NEW_PROFILE;
  }
}

type ProfileContextValue = {
  profile: Profile;
  update: (change: (p: Profile) => Profile) => void;
};

const ProfileContext = createContext<ProfileContextValue>({ profile: NEW_PROFILE, update: () => {} });

export function ProfileProvider({ initial, children }: { initial: Profile; children: ReactNode }) {
  const [profile, setProfile] = useState(initial);

  const update = useCallback((change: (p: Profile) => Profile) => {
    setProfile((prev) => {
      const next = change(prev);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo(() => ({ profile, update }), [profile, update]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  return useContext(ProfileContext);
}
