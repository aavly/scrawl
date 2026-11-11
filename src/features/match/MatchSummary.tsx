// The end-of-match card: both players' points, then both word lists side by
// side, one word per line (user feedback, 2026-11-11). Your side on the left,
// the opponent's on the right, as during the round.

import { StyleSheet, Text, View } from 'react-native';

import { Avatar, type AvatarId } from '@/components/avatar/Avatar';
import { Tag } from '@/components/parts';
import { StickerBox } from '@/components/StickerBox';
import type { HousePlayer } from '@/game/housePlayers';
import type { MatchResult, ResultWord } from '@/game/results';
import { lineHeightFor, scoreFontSize, useTheme } from '@/theme';

export function MatchSummary({ result, you, house }: { result: MatchResult; you: { avatar: AvatarId }; house: HousePlayer }) {
  const { colors, fonts, type } = useTheme();
  const yours = result.you.score.toLocaleString('en-US');
  const theirs = result.them.score.toLocaleString('en-US');
  // Both numerals share the smaller size so they line up (DESIGN.md §4.2).
  const size = Math.min(scoreFontSize('results', yours), scoreFontSize('results', theirs));
  const mono = { fontFamily: fonts.mono[700], fontSize: 11, lineHeight: lineHeightFor(11), letterSpacing: 0.6, color: colors.cardText };
  const score = { fontFamily: fonts.display[800], fontSize: size, lineHeight: Math.round(size * 1.1), color: colors.cardText };

  return (
    <StickerBox radius={26} shadow="cardLarge" contentStyle={{ padding: 16, gap: 6 }}>
      <View style={styles.between}>
        <View style={styles.row}>
          <Avatar id={you.avatar} size={34} />
          <Text style={mono}>YOU</Text>
        </View>
        <View style={styles.row}>
          <Text style={mono}>{house.name.toUpperCase()}</Text>
          <Avatar id={house.id} size={34} badge={false} />
        </View>
      </View>
      <View style={styles.between}>
        <Text style={score}>{yours}</Text>
        <Text style={[type.cardTitle, { color: colors.cardText }]}>VS</Text>
        <Text style={score}>{theirs}</Text>
      </View>
      <View style={styles.between}>
        <View>{result.outcome === 'win' && <Tag label="WINNER" fill={colors.mint} color={colors.ink} />}</View>
        <View style={styles.row}>
          {result.outcome === 'loss' && <Tag label="WINNER" fill={colors.mint} color={colors.ink} />}
          <Tag label={`HOUSE PLAYER · LV ${house.level}`} />
        </View>
      </View>

      <View style={[styles.rule, { backgroundColor: colors.soft }]} />

      <View style={styles.columns}>
        <WordList words={result.you.words} align="left" />
        <View style={[styles.divider, { backgroundColor: colors.soft }]} />
        <WordList words={result.them.words} align="right" />
      </View>
    </StickerBox>
  );
}

function WordList({ words, align }: { words: ResultWord[]; align: 'left' | 'right' }) {
  const { colors, fonts } = useTheme();
  const right = align === 'right';
  return (
    <View style={{ flex: 1, gap: 4, alignItems: right ? 'flex-end' : 'flex-start' }}>
      <Text style={{ fontFamily: fonts.mono[700], fontSize: 11, lineHeight: lineHeightFor(11), letterSpacing: 0.8, color: colors.cardText, marginBottom: 2 }}>
        {words.length} {words.length === 1 ? 'WORD' : 'WORDS'}
      </Text>
      {words.map((w) => (
        <View
          key={w.word}
          accessibilityLabel={`${w.word}, ${w.points} points${w.unique ? ', only this player found it' : ''}`}
          style={[styles.wordRow, right && styles.wordRowRight, w.unique && { backgroundColor: colors.butter }]}
        >
          <Text style={{ fontFamily: fonts.display[800], fontSize: 15, lineHeight: lineHeightFor(15), color: w.unique ? colors.ink : colors.cardText }}>
            {w.unique ? `★ ${w.word}` : w.word}
          </Text>
          <Text style={{ fontFamily: fonts.mono[700], fontSize: 11, lineHeight: lineHeightFor(11), color: w.unique ? colors.ink : colors.muted }}>
            {w.points.toLocaleString('en-US')}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  rule: { height: 2, borderRadius: 1, marginVertical: 8 },
  columns: { flexDirection: 'row', gap: 12 },
  divider: { width: 2, borderRadius: 1 },
  wordRow: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1 },
  wordRowRight: { flexDirection: 'row-reverse' },
});
