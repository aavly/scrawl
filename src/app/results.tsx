// Results (DESIGN.md §5.7): headline, rating change (ranked only), the match
// summary with both word lists, the best words you missed, and Play again.

import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Icon } from '@/components/icons';
import { Confetti, Headline, ProgressBar } from '@/components/parts';
import { Screen } from '@/components/Screen';
import { StickerBox } from '@/components/StickerBox';
import { StickerButton } from '@/components/StickerButton';
import { TierChip } from '@/components/TierChip';
import { MatchSummary } from '@/features/match/MatchSummary';
import { lastMatch, newSeed } from '@/features/match/matchStore';
import { useProfile } from '@/features/profile/ProfileProvider';
import { housePlayer } from '@/game/housePlayers';
import type { MatchResult } from '@/game/results';
import { pointsToNextTier, tierForRating } from '@/game/tiers';
import { lineHeightFor, useTheme } from '@/theme';

export default function Results() {
  const match = lastMatch();
  const { colors, type } = useTheme();
  const { profile } = useProfile();

  if (!match) {
    return (
      <Screen contentStyle={{ justifyContent: 'center' }}>
        <Text style={[type.cardTitle, { color: colors.text, textAlign: 'center' }]}>No match to show.</Text>
        <StickerButton onPress={() => router.replace('/')} radius={22} contentStyle={styles.secondaryButton}>
          <Text style={[type.cardTitle, { color: colors.cardText }]}>Home</Text>
        </StickerButton>
      </Screen>
    );
  }

  const { result } = match;
  const house = housePlayer(match.opponentId);
  const won = result.outcome === 'win';
  const headline = won ? `YOU BEAT ${house.name.toUpperCase()}!` : result.outcome === 'tie' ? 'DEAD HEAT!' : 'SO CLOSE';
  const playAgain = () =>
    router.replace({ pathname: '/reveal', params: { mode: result.mode, opponent: match.opponentId, seed: String(newSeed()) } });

  return (
    <Screen
      dots
      scroll
      footer={
        <>
          <StickerButton onPress={playAgain} fill={colors.cobalt} shadow="stepLarge" radius={26} contentStyle={styles.primaryButton}>
            <View style={{ flex: 1 }}>
              <Text style={[type.screenTitle, { color: colors.paper, fontSize: 30, lineHeight: 34 }]}>
                {won ? `Play ${house.name} again` : 'Run it back'}
              </Text>
              <Text style={[type.monoLabel, { color: colors.paper }]}>
                LEVEL {house.level} · {house.label}
                {result.mode === 'practice' ? ' · PRACTICE' : ''}
              </Text>
            </View>
            <Icon name="repeat" size={30} color={colors.paper} />
          </StickerButton>
          <StickerButton onPress={() => router.replace('/')} shadow="card" radius={22} contentStyle={styles.secondaryButton}>
            <Text style={[type.cardTitle, { color: colors.cardText }]}>Home</Text>
          </StickerButton>
        </>
      }
    >
      <View style={{ paddingTop: 12 }}>
        {won && <Confetti />}
        <Headline text={headline} fill={won ? colors.mint : colors.bubblegum} size={40} />
      </View>

      {/* Rank result first, then points and both word lists (user feedback, 2026-11-11). */}
      {result.rating && <RatingCard result={result} />}
      <MatchSummary result={result} you={{ avatar: profile.avatar }} house={house} />
      {result.missed.length > 0 && <MissedCard missed={result.missed} />}
      {result.mode === 'practice' && (
        <Text style={[type.monoLabel, { color: colors.text, textAlign: 'center' }]}>PRACTICE NEVER CHANGES YOUR RATING</Text>
      )}
    </Screen>
  );
}

function RatingCard({ result }: { result: MatchResult }) {
  const { colors, fonts, type } = useTheme();
  const change = result.rating!;
  const up = change.delta >= 0;
  const tier = tierForRating(change.newRating);
  const next = pointsToNextTier(change.newRating);
  const progress = next ? (change.newRating - Math.max(tier.min, 1000)) / (next.next.min - Math.max(tier.min, 1000)) : 1;
  return (
    <StickerBox radius={26} shadow="cardLarge" contentStyle={{ padding: 16, gap: 12 }}>
      <View style={styles.between}>
        <View style={styles.row}>
          <Text style={[type.screenTitle, { color: colors.muted, opacity: 0.7 }]}>{result.oldRating.toLocaleString('en-US')}</Text>
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke={colors.cardText} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={[type.screenTitle, { color: colors.cardText }]}>{change.newRating.toLocaleString('en-US')}</Text>
        </View>
        <View style={[styles.delta, { backgroundColor: up ? colors.mint : colors.bubblegum, borderColor: colors.ink }]}>
          <Icon name={up ? 'up' : 'down'} size={16} color={colors.ink} />
          <Text style={{ fontFamily: fonts.display[800], fontSize: 22, lineHeight: 26, color: colors.ink }}>
            {up ? '+' : '−'}
            {Math.abs(change.delta)}
          </Text>
        </View>
      </View>
      <ProgressBar value={progress} />
      <View style={styles.between}>
        <TierChip tier={tier} size="m" />
        {next && (
          <Text style={{ fontFamily: fonts.mono[700], fontSize: 12, lineHeight: lineHeightFor(12), letterSpacing: 1, color: colors.cardText }}>
            {next.points} TO {next.next.name}
          </Text>
        )}
      </View>
    </StickerBox>
  );
}

function MissedCard({ missed }: { missed: MatchResult['missed'] }) {
  const { colors, fonts } = useTheme();
  return (
    <StickerBox radius={26} shadow="cardLarge" contentStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontFamily: fonts.mono[700], fontSize: 12, lineHeight: lineHeightFor(12), letterSpacing: 1, color: colors.cardText }}>
        BEST WORDS YOU MISSED
      </Text>
      <View style={styles.row}>
        {missed.map((m) => (
          <View key={m.word} style={[styles.missed, { borderColor: colors.line }]}>
            <Text numberOfLines={1} adjustsFontSizeToFit style={{ fontFamily: fonts.display[800], fontSize: 18, lineHeight: 22, color: colors.cardText }}>
              {m.word}
            </Text>
            <Text style={{ fontFamily: fonts.mono[700], fontSize: 11, lineHeight: lineHeightFor(11), color: colors.cardText }}>
              +{m.points.toLocaleString('en-US')}
            </Text>
          </View>
        ))}
      </View>
    </StickerBox>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  delta: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 3, borderRadius: 99, paddingHorizontal: 14, paddingVertical: 4 },
  missed: { flex: 1, borderWidth: 3, borderStyle: 'dashed', borderRadius: 16, alignItems: 'center', paddingVertical: 8, paddingHorizontal: 4 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12, minHeight: 76 },
  secondaryButton: { alignItems: 'center', justifyContent: 'center', minHeight: 56 },
});
