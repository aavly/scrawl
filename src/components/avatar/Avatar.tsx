import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { housePlayer, isHousePlayerId } from '@/game/housePlayers';
import { useTheme } from '@/theme';

import { avatarArt } from './art.generated';

export type AvatarId = keyof typeof avatarArt;

export const PLAYER_AVATAR_IDS = (Object.keys(avatarArt) as AvatarId[]).filter(
  (id) => avatarArt[id].family === 'player',
);

type Props = {
  id: AvatarId;
  /** Slot diameter. Design sizes: 28/34 (lists, board header), 40–44, 52, 92, 120–130 (picker). */
  size: number;
  /** House players show a level badge from 40px up (DESIGN.md §4.8). Set false to hide it. */
  badge?: boolean;
  /** Selection ring colour, e.g. Cobalt in the avatar picker. */
  ring?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * The circular avatar slot. The slot, outline and level badge are drawn here;
 * the art is SVG from the design files. House players (animals, full-bleed,
 * badge) and players (people, no badge) are deliberately different.
 */
export function Avatar({ id, size, badge = true, ring, style }: Props) {
  const { colors, fonts } = useTheme();
  const art = avatarArt[id];
  const border = size <= 36 ? 2 : size >= 88 ? 4 : 3;
  const inner = size - border * 2;
  const house = isHousePlayerId(id) ? housePlayer(id) : null;
  const showBadge = !!house && badge && size >= 40;
  const badgeSize = Math.round(size * 0.36);
  const label = house ? `${house.name}, house player, level ${house.level}` : `Avatar: ${art.name}`;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
      style={[{ width: size, height: size }, style]}
    >
      <View
        style={[
          styles.slot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: border,
            borderColor: colors.ink,
            backgroundColor: art.bg,
          },
          ring ? { outlineColor: ring, outlineWidth: 3, outlineStyle: 'solid' } : null,
        ]}
      >
        <SvgXml xml={`<svg viewBox="0 0 100 100">${art.svg}</svg>`} width={inner} height={inner} />
      </View>
      {showBadge && (
        <View
          style={[
            styles.badge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              right: -Math.round(size * 0.04),
              bottom: -Math.round(size * 0.04),
              borderColor: colors.ink,
              backgroundColor: colors.paper,
            },
          ]}
        >
          <Text
            style={{
              fontFamily: fonts.mono[700],
              fontSize: Math.max(9, Math.round(badgeSize * 0.5)),
              lineHeight: Math.max(9, Math.round(badgeSize * 0.5)) + 2,
              color: colors.ink,
            }}
          >
            {house.level}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  slot: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
