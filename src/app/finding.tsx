// Finding a match (DESIGN.md §5.4). Stage 1 has no server, so nobody is ever
// found: after a short search a house player at the player's level steps up.
// Stage 2 replaces the timer with real matchmaking (search up to ~10 s).

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar/Avatar';
import { ProgressBar, Tag } from '@/components/parts';
import { Screen } from '@/components/Screen';
import { StickerBox } from '@/components/StickerBox';
import { StickerButton } from '@/components/StickerButton';
import { useProfile } from '@/features/profile/ProfileProvider';
import { newSeed } from '@/features/match/matchStore';
import { housePlayerForRating } from '@/game/housePlayers';
import { lineHeightFor, useTheme } from '@/theme';

// Shortened for Stage 1 so testing isn't slow; the design searches up to 10 s.
const SEARCH_MS = 3000;
const STEPPED_UP_MS = 2200;

export default function Finding() {
  const { colors, type, fonts } = useTheme();
  const { profile } = useProfile();
  const house = housePlayerForRating(profile.rating);
  const [elapsed, setElapsed] = useState(0);
  const found = elapsed >= SEARCH_MS;

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setElapsed(Date.now() - start), 100);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (elapsed >= SEARCH_MS + STEPPED_UP_MS) {
      router.replace({ pathname: '/reveal', params: { mode: 'ranked', opponent: house.id, seed: String(newSeed()) } });
    }
  }, [elapsed, house.id]);

  const rating = profile.rating.toLocaleString('en-US');
  const seconds = Math.min(10, Math.ceil(elapsed / 1000));

  return (
    <Screen dots contentStyle={{ justifyContent: 'space-between' }}>
      <View style={styles.top}>
        <Text style={[type.monoLabel, { color: colors.text }]}>RANKED · 80 SEC</Text>
        <Text style={[type.monoLabel, { color: colors.text }]}>{rating}</Text>
      </View>

      <View style={{ gap: 28 }}>
        <StickerBox shadow="cardLarge" radius={28} contentStyle={styles.card}>
          {found ? (
            <>
              <Avatar id={house.id} size={92} />
              <Text style={[type.screenTitle, styles.center, { color: colors.cardText, fontSize: 36, lineHeight: 40 }]}>{house.name} stepped up</Text>
              <Tag label={`HOUSE PLAYER · LV ${house.level}`} />
              <Text style={[type.body, styles.center, { color: colors.cardText }]}>
                Quiet right now, so {house.name}, one of our house players, is taking this one. A computer opponent at your level. It counts for your
                rating.
              </Text>
            </>
          ) : (
            <>
              <FindTiles />
              <Text style={[type.screenTitle, styles.center, { color: colors.cardText, fontSize: 36, lineHeight: 40 }]}>Finding a rival</Text>
              <Text style={[type.body, styles.center, { color: colors.cardText }]}>Looking for players around {rating}.</Text>
            </>
          )}
          <View style={{ alignSelf: 'stretch', gap: 6 }}>
            <ProgressBar value={found ? 1 : elapsed / SEARCH_MS} />
            <View style={styles.top}>
              <Text style={{ fontFamily: fonts.mono[700], fontSize: 11, lineHeight: lineHeightFor(11), color: colors.cardText }}>
                0:{String(found ? 10 : seconds).padStart(2, '0')}
              </Text>
              <Text style={{ fontFamily: fonts.mono[700], fontSize: 11, lineHeight: lineHeightFor(11), color: colors.cardText }}>
                {found ? 'FOUND' : 'UP TO 0:10'}
              </Text>
            </View>
          </View>
        </StickerBox>

        <StickerButton onPress={() => router.back()} shadow="secondary" radius={28} style={styles.cancel} contentStyle={styles.cancelInner}>
          <Text style={[type.cardTitle, { color: colors.cardText }]}>Cancel</Text>
        </StickerButton>
      </View>
      <View />
    </Screen>
  );
}

/** Four tilted tiles spelling FIND. */
function FindTiles() {
  const { colors, fonts } = useTheme();
  const tiles = [
    { l: 'F', fill: colors.bubblegum, ink: colors.ink, r: '-4deg' },
    { l: 'I', fill: colors.paper, ink: colors.ink, r: '3deg' },
    { l: 'N', fill: colors.mint, ink: colors.ink, r: '2deg' },
    { l: 'D', fill: colors.cobalt, ink: colors.paper, r: '-3deg' },
  ];
  return (
    <View style={styles.findGrid}>
      {tiles.map((t) => (
        <StickerBox key={t.l} fill={t.fill} shadow="step" radius={14} style={{ width: 66, height: 66, transform: [{ rotate: t.r }] }} contentStyle={styles.centerBox}>
          <Text style={{ fontFamily: fonts.display[800], fontSize: 30, lineHeight: 36, color: t.ink }}>{t.l}</Text>
        </StickerBox>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  card: { alignItems: 'center', gap: 14, paddingHorizontal: 22, paddingVertical: 26 },
  center: { textAlign: 'center' },
  centerBox: { alignItems: 'center', justifyContent: 'center' },
  findGrid: { width: 144, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cancel: { alignSelf: 'center', width: 116 },
  cancelInner: { height: 52, alignItems: 'center', justifyContent: 'center' },
});
