// Meet the house players (DESIGN.md §6, the Cast screen). A navigation screen: flat, no dots.

import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar/Avatar';
import { ScreenHeader } from '@/components/parts';
import { Screen } from '@/components/Screen';
import { StickerBox } from '@/components/StickerBox';
import { HOUSE_PLAYERS } from '@/game/housePlayers';
import { lineHeightFor, useTheme } from '@/theme';

const band = (min: number, max: number) =>
  min === 0 ? `Up to ${max.toLocaleString('en-US')}` : max === Infinity ? `${min.toLocaleString('en-US')}+` : `${min.toLocaleString('en-US')} – ${max.toLocaleString('en-US')}`;

export default function Cast() {
  const { colors, type, fonts } = useTheme();
  const mono = { fontFamily: fonts.mono[700], fontSize: 11, lineHeight: lineHeightFor(11), letterSpacing: 0.9, color: colors.cardText };

  return (
    <Screen scroll>
      <ScreenHeader title="House players" />
      <Text style={[type.body, { color: colors.text, fontSize: 18, lineHeight: 24 }]}>
        Five computer players who show up when the lobby is quiet, in Practice and in the tutorial. They never appear on leaderboards.
      </Text>
      {HOUSE_PLAYERS.map((h) => (
        <StickerBox key={h.id} radius={24} shadow="cardLarge" contentStyle={styles.card}>
          <Avatar id={h.id} size={72} />
          <View style={{ flex: 1, gap: 4 }}>
            <View style={styles.nameRow}>
              <Text style={[type.screenTitle, { color: colors.cardText, fontSize: 26, lineHeight: 30 }]}>{h.name}</Text>
              <Text style={mono}>
                LV {h.level} · {h.label}
              </Text>
            </View>
            <Text style={[type.body, { color: colors.cardText, fontSize: 15, lineHeight: 20 }]}>{h.intro}</Text>
            <Text style={[mono, { color: colors.muted, fontSize: 10 }]}>MEETS PLAYERS RATED {band(h.band.min, h.band.max).toUpperCase()}</Text>
          </View>
        </StickerBox>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 14, paddingVertical: 14 },
  nameRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
});
