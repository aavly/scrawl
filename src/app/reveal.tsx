// Opponent reveal (DESIGN.md §5.5), then a 3-2-1 countdown into the round.

import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar/Avatar';
import { Headline, LevelPips, Tag } from '@/components/parts';
import { Screen } from '@/components/Screen';
import { StickerBox } from '@/components/StickerBox';
import { TierChip } from '@/components/TierChip';
import { useProfile } from '@/features/profile/ProfileProvider';
import { housePlayer, isHousePlayerId } from '@/game/housePlayers';
import { tierForRating } from '@/game/tiers';
import { lineHeightFor, useTheme } from '@/theme';

export default function Reveal() {
  const { colors, type, fonts } = useTheme();
  const { profile } = useProfile();
  const params = useLocalSearchParams<{ mode?: string; opponent?: string; seed?: string }>();
  const mode = params.mode === 'practice' || params.mode === 'tutorial' ? params.mode : 'ranked';
  const house = housePlayer(params.opponent && isHousePlayerId(params.opponent) ? params.opponent : 'pip');
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      router.replace({ pathname: '/round', params: { mode, opponent: house.id, seed: params.seed ?? '1' } });
      return;
    }
    const id = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [count, mode, house.id, params.seed]);

  // Short copy: one line each (user feedback, 2026-11-03).
  const headline = { tutorial: 'YOUR FIRST MATCH', practice: 'PRACTICE MATCH', ranked: `${house.name.toUpperCase()} STEPPED UP` }[mode];
  const note = {
    tutorial: 'Same board, 80 seconds. Most points wins.',
    practice: `${house.name} is a computer player. Unranked.`,
    ranked: `${house.name} is a computer player at your level. Counts for rating.`,
  }[mode];

  return (
    <Screen dots contentStyle={{ justifyContent: 'space-between' }}>
      <View style={{ gap: 22, paddingTop: 20 }}>
        <Headline text={headline} fill={colors.butter} size={38} />

        <View style={styles.cards}>
          <StickerBox radius={28} shadow="cardLarge" style={styles.flex} contentStyle={styles.card}>
            <Avatar id={profile.avatar} size={92} />
            <Text numberOfLines={1} adjustsFontSizeToFit style={[type.cardTitle, { color: colors.cardText, fontSize: 22, lineHeight: 26 }]}>
              {profile.username}
            </Text>
            <Tag label={profile.country} fill={colors.butter} color={colors.ink} />
            <TierChip tier={tierForRating(profile.rating)} size="m" />
            <Text style={[type.scoreResults, { color: colors.cardText, fontSize: 32, lineHeight: 36 }]}>{profile.rating.toLocaleString('en-US')}</Text>
          </StickerBox>

          <StickerBox radius={28} shadow="cardLarge" fill={colors.bubblegum} style={styles.flex} contentStyle={styles.card}>
            <Avatar id={house.id} size={92} />
            <Text style={[type.cardTitle, { color: colors.ink, fontSize: 22, lineHeight: 26 }]}>{house.name}</Text>
            <Tag label="HOUSE PLAYER" />
            <Text style={{ fontFamily: fonts.mono[700], fontSize: 11, lineHeight: lineHeightFor(11), letterSpacing: 0.9, color: colors.ink }}>
              LEVEL {house.level} · {house.label}
            </Text>
            <LevelPips level={house.level} color={colors.ink} />
            <Text style={[type.body, { color: colors.ink, fontSize: 14, lineHeight: 18 }]}>plays like {house.playsLike}</Text>
          </StickerBox>

          <View style={[styles.vs, { backgroundColor: colors.ink }]} pointerEvents="none">
            <Text style={{ fontFamily: fonts.display[800], fontSize: 22, lineHeight: 26, color: colors.butter }}>VS</Text>
          </View>
        </View>

        <StickerBox contentStyle={{ padding: 16 }}>
          <Text style={[type.bodyStrong, { color: colors.cardText, textAlign: 'center', fontSize: 16, lineHeight: 21 }]}>{note}</Text>
        </StickerBox>
      </View>

      <View style={styles.countWrap} accessibilityLiveRegion="polite" accessibilityLabel={`Starting in ${count}`}>
        <View style={[styles.countShadow, { backgroundColor: colors.shadow }]} />
        <View style={[styles.count, { backgroundColor: colors.cobalt, borderColor: colors.ink }]}>
          <Text style={{ fontFamily: fonts.mono[700], fontSize: 11, lineHeight: lineHeightFor(11), letterSpacing: 1.2, color: colors.paper }}>STARTING IN</Text>
          <Text style={{ fontFamily: fonts.display[800], fontSize: 64, lineHeight: 70, color: colors.paper }}>{Math.max(count, 1)}</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  cards: { flexDirection: 'row', gap: 12 },
  card: { alignItems: 'center', gap: 8, paddingHorizontal: 8, paddingVertical: 18 },
  vs: {
    position: 'absolute',
    left: '50%',
    top: '42%',
    width: 60,
    height: 60,
    marginLeft: -30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countWrap: { alignSelf: 'center', width: 132, height: 132, marginBottom: 8 },
  countShadow: { ...StyleSheet.absoluteFill, borderRadius: 66, transform: [{ translateY: 6 }] },
  count: { ...StyleSheet.absoluteFill, borderRadius: 66, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
});
