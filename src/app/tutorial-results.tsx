// Tutorial results (DESIGN.md §5.2b): the match summary and a word from Pip.
// No rating, no rematch; Continue goes Home. How points work is taught in the
// solo part of the tutorial, not here (user feedback, 2026-11-11).

import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Confetti, Headline } from '@/components/parts';
import { CoachBubble } from '@/components/round/CoachBubble';
import { Screen } from '@/components/Screen';
import { StickerButton } from '@/components/StickerButton';
import { MatchSummary } from '@/features/match/MatchSummary';
import { lastMatch } from '@/features/match/matchStore';
import { useProfile } from '@/features/profile/ProfileProvider';
import { housePlayer } from '@/game/housePlayers';
import { useTheme } from '@/theme';

export default function TutorialResults() {
  const { colors, type } = useTheme();
  const { profile } = useProfile();
  const result = lastMatch()?.result;
  const won = result?.outcome === 'win';

  return (
    <Screen
      dots
      scroll
      footer={
        <>
          <StickerButton onPress={() => router.replace('/')} fill={colors.cobalt} shadow="stepLarge" radius={26} contentStyle={styles.continue}>
            <Text style={[type.screenTitle, { color: colors.paper, fontSize: 36, lineHeight: 40 }]}>Continue →</Text>
          </StickerButton>
          <Text style={[type.monoLabel, { color: colors.text, textAlign: 'center' }]}>PRACTICE NEVER CHANGES YOUR RATING</Text>
        </>
      }
    >
      <View style={{ paddingTop: 12 }}>
        {won && <Confetti />}
        <Headline text={won ? 'YOU BEAT PIP!' : 'GOOD TRY!'} fill={won ? colors.mint : colors.butter} size={40} />
      </View>

      {result && <MatchSummary result={result} you={{ avatar: profile.avatar }} house={housePlayer('pip')} />}

      <CoachBubble speaker="pip" label="PIP" text={won ? 'Nice work! Find me in Practice any time.' : 'Good try! Find me in Practice any time.'} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  continue: { alignItems: 'center', justifyContent: 'center', minHeight: 76 },
});
