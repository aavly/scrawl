// Results (DESIGN.md §5.7): headline, scores, rating change (ranked only),
// both word lists, the best words you missed, and Play again.

import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Avatar } from '@/components/avatar/Avatar';
import { Icon } from '@/components/icons';
import { Confetti, Headline, ProgressBar, Tag } from '@/components/parts';
import { Screen } from '@/components/Screen';
import { StickerBox } from '@/components/StickerBox';
import { StickerButton } from '@/components/StickerButton';
import { TierChip } from '@/components/TierChip';
import { lastMatch, newSeed } from '@/features/match/matchStore';
import { useProfile } from '@/features/profile/ProfileProvider';
import { housePlayer } from '@/game/housePlayers';
import type { MatchResult, ResultWord } from '@/game/results';
import { pointsToNextTier, tierForRating } from '@/game/tiers';
import { lineHeightFor, scoreFontSize, useTheme } from '@/theme';

const WORDS_SHOWN = 8;

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

      <Scoreboard result={result} you={{ avatar: profile.avatar, username: profile.username }} houseId={match.opponentId} />
      {result.rating && <RatingCard result={result} />}
      <WordsCard result={result} theirName={house.name} />
      {result.missed.length > 0 && <MissedCard missed={result.missed} />}
      {result.mode === 'practice' && (
        <Text style={[type.monoLabel, { color: colors.text, textAlign: 'center' }]}>PRACTICE ROUNDS NEVER CHANGE YOUR RATING</Text>
      )}
    </Screen>
  );
}

function Scoreboard({ result, you, houseId }: { result: MatchResult; you: { avatar: Parameters<typeof Avatar>[0]['id']; username: string }; houseId: Parameters<typeof housePlayer>[0] }) {
  const { colors, fonts, type } = useTheme();
  const house = housePlayer(houseId);
  const yours = result.you.score.toLocaleString('en-US');
  const theirs = result.them.score.toLocaleString('en-US');
  // Both numerals share the smaller size so they line up (DESIGN.md §4.2).
  const size = Math.min(scoreFontSize('results', yours), scoreFontSize('results', theirs));
  const mono = { fontFamily: fonts.mono[700], fontSize: 11, lineHeight: lineHeightFor(11), letterSpacing: 0.6, color: colors.cardText };
  return (
    <StickerBox radius={26} shadow="cardLarge" contentStyle={{ padding: 16, gap: 6 }}>
      <View style={styles.between}>
        <View style={styles.row}>
          <Avatar id={you.avatar} size={34} />
          <Text style={mono}>YOU · {you.username.toUpperCase()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={mono}>{house.name.toUpperCase()}</Text>
          <Avatar id={house.id} size={34} />
        </View>
      </View>
      <View style={styles.between}>
        <Text style={{ fontFamily: fonts.display[800], fontSize: size, lineHeight: size * 1.1, color: colors.cardText }}>{yours}</Text>
        <Text style={[type.cardTitle, { color: colors.cardText }]}>VS</Text>
        <Text style={{ fontFamily: fonts.display[800], fontSize: size, lineHeight: size * 1.1, color: colors.cardText }}>{theirs}</Text>
      </View>
      <View style={styles.between}>
        <View>{result.outcome === 'win' ? <Tag label="WINNER" fill={colors.mint} color={colors.ink} /> : null}</View>
        <View style={styles.row}>
          {result.outcome === 'loss' && <Tag label="WINNER" fill={colors.mint} color={colors.ink} />}
          <Tag label={`HOUSE PLAYER · LV ${house.level}`} />
        </View>
      </View>
    </StickerBox>
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

function WordsCard({ result, theirName }: { result: MatchResult; theirName: string }) {
  const { colors } = useTheme();
  return (
    <StickerBox radius={26} shadow="cardLarge" contentStyle={styles.wordsCard}>
      <WordColumn title={`YOU · ${result.you.words.length} WORDS`} words={result.you.words} />
      <View style={[styles.divider, { backgroundColor: colors.soft }]} />
      <WordColumn title={`${theirName.toUpperCase()} · ${result.them.words.length} WORDS`} words={result.them.words} />
    </StickerBox>
  );
}

function WordColumn({ title, words }: { title: string; words: ResultWord[] }) {
  const { colors, fonts } = useTheme();
  const shown = words.slice(0, WORDS_SHOWN);
  const more = words.length - shown.length;
  const chip = (label: string, unique: boolean, key: string) => (
    <View key={key} style={[styles.wordChip, { borderColor: colors.line, backgroundColor: unique ? colors.butter : colors.card }]}>
      <Text style={{ fontFamily: fonts.mono[unique ? 700 : 400], fontSize: 12, lineHeight: lineHeightFor(12), color: unique ? colors.ink : colors.cardText }}>
        {unique ? `★ ${label}` : label}
      </Text>
    </View>
  );
  return (
    <View style={{ flex: 1, gap: 8 }}>
      <Text style={{ fontFamily: fonts.mono[700], fontSize: 11, lineHeight: lineHeightFor(11), letterSpacing: 0.8, color: colors.cardText }}>{title}</Text>
      <View style={styles.chips}>
        {shown.map((w) => chip(w.word, w.unique, w.word))}
        {more > 0 && chip(`+${more}`, false, 'more')}
      </View>
    </View>
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
  wordsCard: { flexDirection: 'row', gap: 12, padding: 16 },
  divider: { width: 3, borderRadius: 2 },
  // Margins rather than gap: on iOS a wrapping row with gap can be measured
  // too short for its card.
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginRight: -6, marginBottom: -6 },
  wordChip: { borderWidth: 2, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, marginRight: 6, marginBottom: 6 },
  missed: { flex: 1, borderWidth: 3, borderStyle: 'dashed', borderRadius: 16, alignItems: 'center', paddingVertical: 8, paddingHorizontal: 4 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12, minHeight: 76 },
  secondaryButton: { alignItems: 'center', justifyContent: 'center', minHeight: 56 },
});
