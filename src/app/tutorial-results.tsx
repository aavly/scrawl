// Tutorial results (DESIGN.md §5.2b): the score, how points work, and an
// introduction to Pip. No rating, no rematch; Continue goes Home.

import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar/Avatar';
import { Confetti, Headline, Tag } from '@/components/parts';
import { Screen } from '@/components/Screen';
import { StickerBox } from '@/components/StickerBox';
import { StickerButton } from '@/components/StickerButton';
import { lastMatch } from '@/features/match/matchStore';
import { useProfile } from '@/features/profile/ProfileProvider';
import { lineHeightFor, scoreFontSize, useTheme } from '@/theme';

const LADDER = [
  { letters: '3', points: '100' },
  { letters: '4', points: '300' },
  { letters: '5', points: '600' },
  { letters: '6', points: '1,000', fill: 'butter' as const },
  { letters: '7+', points: '1,600+', fill: 'bubblegum' as const },
];

export default function TutorialResults() {
  const { colors, type, fonts } = useTheme();
  const { profile } = useProfile();
  const result = lastMatch()?.result;
  const you = result?.you.score ?? 0;
  const pip = result?.them.score ?? 0;
  const won = you > pip;
  const yours = you.toLocaleString('en-US');
  const theirs = pip.toLocaleString('en-US');
  const size = Math.min(scoreFontSize('results', yours), scoreFontSize('results', theirs));
  const mono = { fontFamily: fonts.mono[700], fontSize: 11, lineHeight: lineHeightFor(11), letterSpacing: 0.6, color: colors.cardText };

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
      <View style={{ paddingTop: 12, gap: 10 }}>
        {won && <Confetti />}
        <Headline text={won ? 'YOU BEAT PIP!' : 'GOOD TRY!'} fill={won ? colors.mint : colors.butter} size={40} />
        <Text style={[type.bodyStrong, { color: colors.text, textAlign: 'center', fontSize: 18, lineHeight: 23 }]}>
          {won ? 'Nice work!' : 'You’ve got the hang of it.'}
        </Text>
      </View>

      <StickerBox radius={26} shadow="cardLarge" contentStyle={{ padding: 16, gap: 6 }}>
        <View style={styles.between}>
          <View style={styles.row}>
            <Avatar id={profile.avatar} size={34} />
            <Text style={mono}>YOU</Text>
          </View>
          <View style={styles.row}>
            <Text style={mono}>PIP · LV 1</Text>
            <Avatar id="pip" size={34} badge={false} />
          </View>
        </View>
        <View style={styles.between}>
          <Text style={{ fontFamily: fonts.display[800], fontSize: size, lineHeight: size * 1.1, color: colors.cardText }}>{yours}</Text>
          <Text style={[type.cardTitle, { color: colors.cardText }]}>VS</Text>
          <Text style={{ fontFamily: fonts.display[800], fontSize: size, lineHeight: size * 1.1, color: colors.cardText }}>{theirs}</Text>
        </View>
        <View style={styles.between}>
          <View>{won && <Tag label="WINNER" fill={colors.mint} color={colors.ink} />}</View>
          <Tag label="HOUSE PLAYER" />
        </View>
      </StickerBox>

      <StickerBox radius={26} shadow="cardLarge" contentStyle={{ padding: 16, gap: 12 }}>
        <Text style={[mono, { fontSize: 12, lineHeight: lineHeightFor(12) }]}>LONGER WORDS SCORE WAY MORE</Text>
        <View style={styles.row}>
          {LADDER.map((l) => (
            <View
              key={l.letters}
              style={[styles.ladder, { borderColor: colors.line, backgroundColor: l.fill ? colors[l.fill] : colors.card }]}
            >
              <Text style={{ fontFamily: fonts.display[800], fontSize: 26, lineHeight: 30, color: l.fill ? colors.ink : colors.cardText }}>{l.letters}</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: fonts.mono[700], fontSize: 11, lineHeight: 14, color: l.fill ? colors.ink : colors.cardText }}>
                {l.points}
              </Text>
            </View>
          ))}
        </View>
        <Text style={[type.body, { color: colors.cardText }]}>One long word beats lots of short ones.</Text>
      </StickerBox>

      <StickerBox radius={26} shadow="cardLarge" contentStyle={[styles.row, { padding: 16, gap: 14 }]}>
        <Avatar id="pip" size={52} />
        <Text style={[type.bodyStrong, { color: colors.cardText, flex: 1 }]}>Find me in Practice any time.</Text>
      </StickerBox>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  ladder: { flex: 1, borderWidth: 3, borderRadius: 14, alignItems: 'center', paddingVertical: 8, paddingHorizontal: 2 },
  continue: { alignItems: 'center', justifyContent: 'center', minHeight: 76 },
});
