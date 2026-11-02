// One place where round events turn into haptics, and later sound and music
// (DESIGN.md §13). Screens call feedback(event); nothing else talks to the
// haptics or audio APIs directly.

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type FeedbackEvent =
  | { type: 'tile'; letterIndex: number } // a tile joins the trace; sound rises a semitone per letter
  | { type: 'valid'; letters: number }
  | { type: 'duplicate' }
  | { type: 'invalid' }
  | { type: 'opponent-scored' }
  | { type: 'last10-tick'; secondsLeft: number }
  | { type: 'round-start' }
  | { type: 'round-end'; won: boolean | null };

type Listener = (event: FeedbackEvent) => void;

const listeners = new Set<Listener>();
let hapticsOn = true;

/** For Settings → Haptics. */
export function setHapticsEnabled(on: boolean) {
  hapticsOn = on;
}

/** Audio will subscribe here when it's built. Returns an unsubscribe function. */
export function onFeedback(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function feedback(event: FeedbackEvent) {
  if (hapticsOn && Platform.OS !== 'web') playHaptic(event);
  listeners.forEach((l) => l(event));
}

function playHaptic(event: FeedbackEvent) {
  const run = (p: Promise<void>) => p.catch(() => {});
  switch (event.type) {
    case 'tile':
      return run(Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
    case 'valid':
      return run(Haptics.impactAsync(event.letters >= 7 ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium));
    case 'duplicate':
      // Double tap.
      run(Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
      setTimeout(() => run(Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)), 90);
      return;
    case 'invalid':
      return run(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
    default:
      return; // the rest are sound-only
  }
}
