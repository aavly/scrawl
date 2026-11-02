// TEMPORARY: a preview of the theme tokens and StickerBox for checking the
// look on real devices. Replaced by the Welcome and Home screens in Stage 1.

import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DotBackground } from '@/components/DotBackground';
import { StickerBox } from '@/components/StickerBox';
import { useTheme, useThemeChoice } from '@/theme';

export default function FoundationsPreview() {
  // Uses the real saved theme choice, the same one the Settings toggle will set.
  const { theme, setTheme } = useThemeChoice();
  return <Preview onToggle={() => setTheme(theme === 'butter' ? 'night' : 'butter')} />;
}

function Preview({ onToggle }: { onToggle: () => void }) {
  const theme = useTheme();
  const { colors, type, radii } = theme;
  const insets = useSafeAreaInsets();
  const [pressedTile, setPressedTile] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <DotBackground />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: theme.spacing.gutter,
          gap: theme.spacing.stackGap + 4,
        }}
      >
        <Text style={[type.monoLabel, { color: colors.muted }]}>
          FOUNDATIONS PREVIEW · {theme.name.toUpperCase()}
        </Text>
        <Text style={[type.screenTitle, { color: colors.text }]}>Find words. Beat people.</Text>

        <StickerBox fill={colors.cobalt} shadow="step" radius={radii.button} contentStyle={styles.button}>
          <Pressable onPress={onToggle} accessibilityRole="button" style={styles.fill}>
            <Text style={[type.cardTitle, { color: colors.paper }]}>
              Switch to {theme.name === 'butter' ? 'Night' : 'Butter'}
            </Text>
          </Pressable>
        </StickerBox>

        <StickerBox contentStyle={styles.card}>
          <Text style={[type.monoLabel, { color: colors.cardText }]}>RATING</Text>
          <Text style={[type.scoreResults, { color: colors.cardText }]}>1,642</Text>
          <Text style={[type.body, { color: colors.cardText }]}>
            Card with the standard hard shadow and 3px outline.
          </Text>
        </StickerBox>

        <View style={styles.row}>
          <Tile letter="C" fill={colors.tile} />
          <Tile letter="H" fill={colors.bubblegum} pressed />
          <Tile letter="A" fill={colors.mint} pressed />
          <Pressable
            onPressIn={() => setPressedTile(true)}
            onPressOut={() => setPressedTile(false)}
            accessibilityLabel="Press to test the pressed tile"
          >
            <Tile letter="S" fill={colors.tile} pressed={pressedTile} />
          </Pressable>
        </View>

        <View style={styles.row}>
          <StickerBox fill={colors.butter} shadow={null} radius={radii.tile} borderStyle="dashed" contentStyle={styles.tileFace}>
            <Text style={[type.tileLetter, { color: colors.ink }]}>R</Text>
          </StickerBox>
          <StickerBox fill={colors.mint} shadow="chip" radius={radii.chip} borderWidth={theme.outline.small} contentStyle={styles.chip}>
            <Text style={[type.monoLabel, { color: colors.ink }]}>SPEND +600</Text>
          </StickerBox>
        </View>

        <View style={styles.swatches}>
          {(
            ['cobalt', 'bubblegum', 'mint', 'butter', 'ink', 'paper', 'hatch', 'card', 'board'] as const
          ).map((key) => (
            <StickerBox key={key} fill={colors[key]} shadow="chip" radius={radii.chip} borderWidth={theme.outline.small} style={styles.swatch}>
              <View />
            </StickerBox>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Tile({ letter, fill, pressed }: { letter: string; fill: string; pressed?: boolean }) {
  const { colors, type, radii } = useTheme();
  return (
    <StickerBox fill={fill} shadow="step" radius={radii.tile} pressed={pressed} contentStyle={styles.tileFace}>
      <Text style={[type.tileLetter, { color: colors.ink }]}>{letter}</Text>
    </StickerBox>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  button: { height: 68 },
  card: { padding: 18, gap: 4 },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  tileFace: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  chip: { paddingHorizontal: 10, paddingVertical: 6 },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  swatch: { width: 44, height: 44 },
});
