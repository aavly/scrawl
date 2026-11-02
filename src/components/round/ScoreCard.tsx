import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar, type AvatarId } from '@/components/avatar/Avatar';
import { StickerBox } from '@/components/StickerBox';
import { scoreFontSize, useTheme } from '@/theme';

import { Pop } from './Pop';

type Props = {
  side: 'you' | 'opponent';
  avatar: AvatarId;
  name: string;
  score: number;
  /** The bottom line: AHEAD/BEHIND, a rating, or a house player's level pill. */
  footer: ReactNode;
  /** "+300" when the opponent scores; pops above the card. Changes key to replay. */
  bubble?: { text: string; key: number } | null;
  compact?: boolean;
};

/** Board header card (DESIGN.md §4.2). */
export function ScoreCard({ side, avatar, name, score, footer, bubble, compact }: Props) {
  const { colors, fonts } = useTheme();
  const you = side === 'you';
  const formatted = score.toLocaleString('en-US');
  const textColor = you ? colors.cardText : colors.ink;

  return (
    <View style={styles.wrap}>
      <StickerBox
        fill={you ? colors.card : colors.bubblegum}
        radius={compact ? 14 : 16}
        contentStyle={[styles.card, compact ? styles.compact : styles.full]}
      >
        <View style={styles.nameRow}>
          <Avatar id={avatar} size={compact ? 24 : 28} badge={false} />
          <Text numberOfLines={1} style={[styles.name, { fontFamily: fonts.mono[700], color: textColor }]}>
            {name}
          </Text>
        </View>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: fonts.display[800],
            fontSize: scoreFontSize(compact ? 'boardCompact' : 'boardFull', formatted),
            color: textColor,
          }}
        >
          {formatted}
        </Text>
        {footer}
      </StickerBox>
      {bubble && (
        <Pop key={bubble.key} style={styles.bubble} holdMs={900}>
          <View style={[styles.bubbleInner, { borderColor: colors.line, backgroundColor: colors.paper }]}>
            <Text style={{ fontFamily: fonts.mono[700], fontSize: 12, color: colors.ink }}>{bubble.text}</Text>
          </View>
        </Pop>
      )}
    </View>
  );
}

/** Small mono pill used for AHEAD/BEHIND and the house-player level. */
export function SubPill({ label, fill, color, icon }: { label: string; fill: string; color: string; icon?: ReactNode }) {
  const { colors, fonts } = useTheme();
  return (
    <View style={[styles.pill, { backgroundColor: fill, borderColor: colors.line }]}>
      {icon}
      <Text numberOfLines={1} style={{ fontFamily: fonts.mono[700], fontSize: 10, color }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, minWidth: 0 },
  card: { gap: 2 },
  full: { paddingHorizontal: 10, paddingTop: 8, paddingBottom: 9 },
  compact: { paddingHorizontal: 8, paddingVertical: 5 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 11, letterSpacing: 0.44, flexShrink: 1 },
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderRadius: 99,
  },
  bubble: { position: 'absolute', right: 6, top: -18 },
  bubbleInner: { paddingHorizontal: 9, borderWidth: 2, borderRadius: 99 },
});
