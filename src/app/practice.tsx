// Practice (DESIGN.md §5.8): pick a house player, unranked, works offline.
// A navigation screen, so it stays flat: no dots.

import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar/Avatar';
import { LevelPips, ScreenHeader } from '@/components/parts';
import { Screen } from '@/components/Screen';
import { StickerButton } from '@/components/StickerButton';
import { newSeed } from '@/features/match/matchStore';
import { useProfile } from '@/features/profile/ProfileProvider';
import { HOUSE_PLAYERS, housePlayerForRating } from '@/game/housePlayers';
import { lineHeightFor, useTheme } from '@/theme';

export default function Practice() {
  const { colors, type, fonts } = useTheme();
  const { profile } = useProfile();
  const nearest = housePlayerForRating(profile.rating).id;
  const mono = { fontFamily: fonts.mono[700], fontSize: 11, lineHeight: lineHeightFor(11), letterSpacing: 0.9, color: colors.cardText };

  return (
    <Screen scroll>
      <ScreenHeader title="Practice" />
      <Text style={[type.body, { color: colors.text, fontSize: 18, lineHeight: 24 }]}>
        Pick a house player. Unranked, so your rating never changes. Works offline.
      </Text>

      {HOUSE_PLAYERS.map((h) => (
        <StickerButton
          key={h.id}
          onPress={() => router.push({ pathname: '/reveal', params: { mode: 'practice', opponent: h.id, seed: String(newSeed()) } })}
          accessibilityLabel={`Practice against ${h.name}, level ${h.level}, ${h.line}${h.id === nearest ? ', nearest your level' : ''}`}
          shadow="cardLarge"
          radius={24}
          contentStyle={styles.row}
        >
          <Avatar id={h.id} size={52} />
          <View style={{ flex: 1, gap: 2 }}>
            <View style={styles.nameRow}>
              <Text style={[type.screenTitle, { color: colors.cardText, fontSize: 22, lineHeight: 26 }]}>{h.name}</Text>
              {h.id === nearest && (
                <View style={[styles.nearest, { borderColor: colors.ink, backgroundColor: colors.butter }]}>
                  <Text style={{ fontFamily: fonts.mono[700], fontSize: 10, lineHeight: 13, color: colors.ink }}>NEAREST YOU</Text>
                </View>
              )}
            </View>
            <Text style={[type.body, { color: colors.cardText, fontSize: 15, lineHeight: 19 }]}>{h.line}</Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 6 }}>
            <Text style={mono}>
              LV {h.level} · {h.label}
            </Text>
            <LevelPips level={h.level} color={colors.cardText} />
          </View>
        </StickerButton>
      ))}

      <Pressable onPress={() => router.push('/cast')} accessibilityRole="link" hitSlop={8} style={styles.link}>
        <Text style={[mono, { color: colors.text, textDecorationLine: 'underline', fontSize: 12 }]}>MEET THE HOUSE PLAYERS ›</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 14 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nearest: { borderWidth: 2, borderRadius: 99, paddingHorizontal: 7, paddingVertical: 1 },
  link: { alignSelf: 'center', padding: 8 },
});
