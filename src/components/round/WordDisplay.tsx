import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Polygon } from 'react-native-svg';

import { Icon } from '@/components/icons';
import { StickerBox } from '@/components/StickerBox';
import { wordTier } from '@/game/engine/scoring';
import { lineHeightFor, useTheme } from '@/theme';

import { Pop } from './Pop';

export type WordLook = 'empty' | 'tracing' | 'valid' | 'duplicate' | 'invalid';

type Props = {
  look: WordLook;
  word: string;
  points?: number;
  /** A cheeky reaction for a mild word ("CHEEKY!"), shown instead of the word-tier label. */
  exclamation?: string;
  /** Changes on every submitted word, to replay the stickers and the shake. */
  resultKey: number;
  compact?: boolean;
};

const TIER_LABEL = { nice: 'NICE!', great: 'GREAT!', amazing: 'AMAZING!', legendary: 'LEGENDARY!' } as const;

/** The word above the board (DESIGN.md §4.5). Each state has an icon and a tag as well as a colour. */
export function WordDisplay({ look, word, points, exclamation, resultKey, compact }: Props) {
  const { colors, fonts, radii } = useTheme();
  const reduced = useReducedMotion();
  const height = compact ? 48 : 62;

  const shake = useSharedValue(0);
  useEffect(() => {
    if (look === 'invalid' && !reduced) {
      shake.value = withSequence(
        ...[-7, 6, -4, 3, 0].map((x) => withTiming(x, { duration: 70 })),
      );
    }
  }, [look, resultKey, reduced, shake]);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));

  const fill = look === 'invalid' ? colors.bubblegum : colors.card;
  const textColor = look === 'invalid' ? colors.ink : colors.cardText;
  const tier = look === 'valid' ? wordTier(word) : 'none';
  const iconSize = compact ? 26 : 32;
  // Both sides get the same width so the word stays centred.
  const side = compact ? 62 : 74;

  return (
    <Animated.View style={shakeStyle}>
      <StickerBox
        fill={fill}
        radius={radii.scoreCard}
        borderStyle={look === 'duplicate' ? 'dashed' : 'solid'}
        style={{ height }}
        contentStyle={[styles.bar, { paddingHorizontal: compact ? 12 : 16 }]}
        accessibilityLiveRegion="polite"
        accessibilityLabel={describe(look, word, points)}
      >
        <View style={{ width: side, height: iconSize, alignItems: 'flex-start', justifyContent: 'center' }}>
          {(look === 'tracing' || look === 'empty') && (
            <Svg width={iconSize} height={iconSize} viewBox="0 0 32 32">
              <Circle cx={16} cy={16} r={12} fill="none" stroke={textColor} strokeWidth={3} strokeDasharray="6 5" />
            </Svg>
          )}
          {look === 'valid' && (
            <View style={[styles.disc, { width: iconSize, height: iconSize, backgroundColor: colors.mint, borderColor: colors.ink }]}>
              <Icon name="check" size={iconSize * 0.6} color={colors.ink} strokeWidth={4} />
            </View>
          )}
          {look === 'duplicate' && <Icon name="repeat" size={iconSize * 0.9} color={colors.butter === colors.bg ? colors.cardText : colors.butter} />}
          {look === 'invalid' && (
            <View style={[styles.disc, { width: iconSize, height: iconSize, backgroundColor: colors.ink, borderColor: colors.ink }]}>
              <Icon name="x" size={iconSize * 0.5} color={colors.paper} strokeWidth={4} />
            </View>
          )}
        </View>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            styles.word,
            {
              fontFamily: fonts.display[800],
              fontSize: compact ? 30 : 42,
              lineHeight: compact ? 35 : 48,
              letterSpacing: (compact ? 30 : 42) * 0.08,
              color: textColor,
              opacity: look === 'duplicate' ? 0.7 : 1,
            },
          ]}
        >
          {word}
        </Text>
        <View style={{ width: side, alignItems: 'flex-end' }}>
          {look === 'tracing' && word.length > 0 && (
            <Text numberOfLines={1} style={{ fontFamily: fonts.mono[700], fontSize: 11, lineHeight: lineHeightFor(11), letterSpacing: 0.66, color: textColor }}>
              {word.length} {word.length === 1 ? 'LETTER' : 'LETTERS'}
            </Text>
          )}
        </View>
      </StickerBox>

      {look === 'valid' && points !== undefined && (
        <Pop key={`p${resultKey}`} style={styles.tagRight}>
          <Sticker fill={colors.cobalt} color={colors.paper} rotate={5} big>
            {`+${points.toLocaleString('en-US')}`}
          </Sticker>
        </Pop>
      )}
      {look === 'valid' && exclamation ? (
        <Pop key={`m${resultKey}`} style={styles.tagLeft}>
          <Starburst label={exclamation} fill={colors.bubblegum} />
        </Pop>
      ) : (
        tier !== 'none' && (
          <Pop key={`t${resultKey}`} style={styles.tagLeft}>
            <Starburst label={TIER_LABEL[tier]} fill={colors.butter} />
          </Pop>
        )
      )}
      {look === 'duplicate' && (
        <Pop key={`d${resultKey}`} style={styles.tagRight}>
          <Sticker fill={colors.butter} color={colors.ink} rotate={3}>
            ALREADY FOUND
          </Sticker>
        </Pop>
      )}
      {look === 'invalid' && (
        <Pop key={`i${resultKey}`} style={styles.tagRight}>
          <Sticker fill={colors.paper} color={colors.ink} rotate={3}>
            NOT A WORD
          </Sticker>
        </Pop>
      )}
    </Animated.View>
  );
}

function describe(look: WordLook, word: string, points?: number) {
  switch (look) {
    case 'valid':
      return `${word}, plus ${points}`;
    case 'duplicate':
      return `${word} already found`;
    case 'invalid':
      return `${word} is not a word`;
    case 'tracing':
      return `Word so far: ${word}`;
    default:
      return 'No word yet';
  }
}

function Sticker({ children, fill, color, rotate, big }: { children: string; fill: string; color: string; rotate: number; big?: boolean }) {
  const { colors, fonts } = useTheme();
  return (
    <View
      style={[
        styles.sticker,
        { backgroundColor: fill, borderColor: colors.ink, transform: [{ rotate: `${rotate}deg` }], paddingHorizontal: big ? 12 : 10 },
      ]}
    >
      <Text style={big ? { fontFamily: fonts.display[800], fontSize: 20, lineHeight: lineHeightFor(20), color } : { fontFamily: fonts.mono[700], fontSize: 11, lineHeight: lineHeightFor(11), color }}>
        {children}
      </Text>
    </View>
  );
}

/** Word-tier label (NICE!, GREAT! …) or a mild-word reaction on a starburst. */
function Starburst({ label, fill }: { label: string; fill: string }) {
  const { colors, fonts } = useTheme();
  const w = 34 + label.length * 9;
  const h = 40;
  const points: string[] = [];
  const spikes = 12;
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (Math.PI * i) / spikes;
    const r = i % 2 === 0 ? 1 : 0.78;
    points.push(`${w / 2 + Math.cos(angle) * (w / 2 - 2) * r},${h / 2 + Math.sin(angle) * (h / 2 - 2) * r}`);
  }
  return (
    <View style={{ width: w, height: h, transform: [{ rotate: '-6deg' }] }}>
      <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
        <Polygon points={points.join(' ')} fill={fill} stroke={colors.ink} strokeWidth={3} strokeLinejoin="round" />
      </Svg>
      <View style={styles.burstText}>
        <Text style={{ fontFamily: fonts.display[800], fontSize: 13, lineHeight: lineHeightFor(13), color: colors.ink }}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  word: { flex: 1, textAlign: 'center' },
  disc: { borderRadius: 99, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  sticker: { borderWidth: 3, borderRadius: 10, paddingVertical: 1 },
  tagRight: { position: 'absolute', right: -4, top: -16 },
  tagLeft: { position: 'absolute', left: -6, top: -20 },
  burstText: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
});
