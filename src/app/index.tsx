// TEMPORARY: a specimen page for checking the foundations against
// docs/design/screens/specs (avatars, tier chips) on real devices. Replaced by
// the Welcome and Home screens later in Stage 1.

import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, PLAYER_AVATAR_IDS, type AvatarId } from '@/components/avatar/Avatar';
import { StickerBox } from '@/components/StickerBox';
import { TierChip } from '@/components/TierChip';
import { HOUSE_PLAYERS } from '@/game/housePlayers';
import { TIERS } from '@/game/tiers';
import { useTheme, useThemeChoice } from '@/theme';

const SIZES = [92, 52, 44, 34];

export default function Specimen() {
  const theme = useTheme();
  const { colors, type, radii } = theme;
  const { theme: choice, setTheme } = useThemeChoice();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: theme.spacing.gutter,
          gap: 20,
        }}
      >
        <Text style={[type.monoLabel, { color: colors.muted }]}>SPECIMEN · {theme.name.toUpperCase()}</Text>

        <StickerBox fill={colors.cobalt} shadow="step" radius={radii.button} contentStyle={styles.button}>
          <Pressable
            onPress={() => setTheme(choice === 'butter' ? 'night' : 'butter')}
            accessibilityRole="button"
            style={styles.fill}
          >
            <Text style={[type.cardTitle, { color: colors.paper }]}>
              Switch to {choice === 'butter' ? 'Night' : 'Butter'}
            </Text>
          </Pressable>
        </StickerBox>

        <Section title="PLAY A ROUND">
          <View style={styles.chipRow}>
            {HOUSE_PLAYERS.map((h) => (
              <StickerBox key={h.id} fill={colors.butter} shadow="secondary" radius={18}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => router.push({ pathname: '/round', params: { opponent: h.id } })}
                  style={styles.playButton}
                >
                  <Avatar id={h.id} size={34} />
                  <Text style={[type.cardTitle, { color: colors.ink, fontSize: 16 }]}>{h.name}</Text>
                </Pressable>
              </StickerBox>
            ))}
          </View>
        </Section>

        <Section title="HOUSE PLAYERS · 92 / 52 / 44 / 34">
          {HOUSE_PLAYERS.map((h) => (
            <AvatarRow key={h.id} id={h.id} name={h.name} caption={`LV ${h.level} · ${h.label}`} />
          ))}
        </Section>

        <Section title="PLAYER AVATARS · NO BADGE">
          {PLAYER_AVATAR_IDS.map((id) => (
            <AvatarRow key={id} id={id} name={id[0].toUpperCase() + id.slice(1)} caption="PLAYER" />
          ))}
        </Section>

        <Section title="TIER CHIPS · L / M / S">
          {TIERS.map((t) => (
            <View key={t.id} style={styles.chipRow}>
              <TierChip tier={t} size="l" />
              <TierChip tier={t} size="m" />
              <TierChip tier={t} size="s" />
            </View>
          ))}
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors, type } = useTheme();
  return (
    <StickerBox contentStyle={styles.section}>
      <Text style={[type.monoLabel, { color: colors.cardText }]}>{title}</Text>
      {children}
    </StickerBox>
  );
}

function AvatarRow({ id, name, caption }: { id: AvatarId; name: string; caption: string }) {
  const { colors, type } = useTheme();
  return (
    <View style={[styles.avatarRow, { borderTopColor: colors.soft }]}>
      <View style={{ width: 80 }}>
        <Text style={[type.cardTitle, { color: colors.cardText }]}>{name}</Text>
        <Text style={[type.monoLabel, { color: colors.cardText, fontSize: 9 }]}>{caption}</Text>
      </View>
      {SIZES.map((s) => (
        <Avatar key={s} id={id} size={s} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  button: { height: 60 },
  section: { padding: 14, gap: 10 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: 2, paddingTop: 10 },
  chipRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  playButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10, paddingVertical: 6 },
});
