// TEMPORARY: a specimen page for checking the foundations against
// docs/design/screens/specs (avatars, tier chips) on real devices, and a way
// into a round. Replaced by the Welcome and Home screens later in Stage 1.

import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, PLAYER_AVATAR_IDS, type AvatarId } from '@/components/avatar/Avatar';
import { StickerBox } from '@/components/StickerBox';
import { StickerButton } from '@/components/StickerButton';
import { TierChip } from '@/components/TierChip';
import { HOUSE_PLAYERS } from '@/game/housePlayers';
import { TIERS } from '@/game/tiers';
import { useTheme, useThemeChoice, type ThemeChoiceValue } from '@/theme';

const SIZES = [92, 52, 44, 34];
const THEME_OPTIONS: { value: ThemeChoiceValue; label: string }[] = [
  { value: 'system', label: 'Phone' },
  { value: 'butter', label: 'Butter' },
  { value: 'night', label: 'Night' },
];

export default function Specimen() {
  const theme = useTheme();
  const { colors, type } = theme;
  const { choice, setChoice } = useThemeChoice();
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

        <Section title="THEME">
          <View style={styles.row}>
            {THEME_OPTIONS.map((o) => {
              const selected = choice === o.value;
              return (
                <StickerButton
                  key={o.value}
                  onPress={() => setChoice(o.value)}
                  accessibilityLabel={`Theme: ${o.label}${selected ? ', selected' : ''}`}
                  fill={selected ? colors.cobalt : colors.card}
                  shadow="secondary"
                  radius={16}
                  style={styles.flex}
                  contentStyle={styles.themeButton}
                >
                  <Text style={[type.cardTitle, { fontSize: 16, lineHeight: 20, color: selected ? colors.paper : colors.cardText }]}>{o.label}</Text>
                </StickerButton>
              );
            })}
          </View>
        </Section>

        <Section title="PLAY A ROUND">
          {HOUSE_PLAYERS.map((h) => (
            <StickerButton
              key={h.id}
              onPress={() => router.push({ pathname: '/round', params: { opponent: h.id } })}
              accessibilityLabel={`Play ${h.name}, level ${h.level}`}
              fill={colors.butter}
              shadow="secondary"
              radius={18}
              contentStyle={styles.playButton}
            >
              <Avatar id={h.id} size={44} />
              <Text style={[type.cardTitle, styles.flex, { color: colors.ink }]}>{h.name}</Text>
              <Text style={[type.monoLabel, { color: colors.ink }]}>
                LV {h.level} · {h.label}
              </Text>
            </StickerButton>
          ))}
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
            <View key={t.id} style={styles.tierBlock}>
              <TierChip tier={t} size="l" />
              <View style={styles.row}>
                <TierChip tier={t} size="m" />
                <TierChip tier={t} size="s" />
              </View>
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
        <Text style={[type.monoLabel, { color: colors.cardText, fontSize: 9, lineHeight: 12 }]}>{caption}</Text>
      </View>
      {SIZES.map((s) => (
        <Avatar key={s} id={id} size={s} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  section: { padding: 14, gap: 12 },
  themeButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  playButton: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 60, paddingHorizontal: 12, paddingVertical: 8 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: 2, paddingTop: 10 },
  tierBlock: { gap: 6 },
});
