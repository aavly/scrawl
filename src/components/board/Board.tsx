import { useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Svg, { Polyline } from 'react-native-svg';

import { StickerBox } from '@/components/StickerBox';
import { isAdjacent, type Board as BoardData } from '@/game/engine/board';
import { useTheme } from '@/theme';

import { tileAt, tileCentre } from './geometry';
import { Tile, type TileState } from './Tile';

/** What the chain and tiles show: a live trace, or the result of the last word. */
export type TraceLook = 'tracing' | 'valid' | 'duplicate' | 'invalid';

type Props = {
  board: BoardData;
  tile: number;
  gap: number;
  /** The tiles to highlight, in order: the live trace or the last result. */
  path: readonly number[];
  look: TraceLook;
  /** Tutorial: a tile to point at with a dashed ring and a dotted line. */
  hintTile?: number | null;
  disabled?: boolean;
  onTraceChange: (path: number[]) => void;
  onTraceEnd: (path: number[]) => void;
};

const PAD = 8;
const BORDER = 3;
const INSET = PAD + BORDER;

/**
 * The letter board (DESIGN.md §4.1). One pan gesture over the whole plate:
 * the first touch is generous, after that a tile only joins when the finger
 * is near its centre, so diagonal slides don't catch neighbours. Sliding
 * back onto the previous tile undoes the last letter.
 */
export function Board({ board, tile, gap, path, look, hintTile, disabled, onTraceChange, onTraceEnd }: Props) {
  const { colors, radii } = useTheme();
  const inner = board.size * tile + (board.size - 1) * gap;
  const plate = inner + INSET * 2;

  // Gesture callbacks run on the JS thread and read live values from refs.
  const live = useRef<number[]>([]);
  const callbacks = useRef({ onTraceChange, onTraceEnd, disabled });
  callbacks.current = { onTraceChange, onTraceEnd, disabled };
  const [, force] = useState(0);

  const handle = (x: number, y: number, first: boolean) => {
    if (callbacks.current.disabled) return;
    const gx = x - INSET;
    const gy = y - INSET;
    const hit = tileAt(gx, gy, tile, gap, board.size, first ? 1 : 0.65);
    if (hit === null) return;
    const p = live.current;
    const last = p[p.length - 1];
    if (hit === last) return;
    if (p.length >= 2 && hit === p[p.length - 2]) {
      live.current = p.slice(0, -1);
    } else if (p.length === 0 || (!p.includes(hit) && isAdjacent(board, last, hit))) {
      live.current = [...p, hit];
    } else {
      return;
    }
    callbacks.current.onTraceChange(live.current);
  };

  const pan = usePanGesture({
    minDistance: 0,
    runOnJS: true,
    shouldCancelWhenOutside: false,
    onBegin: (e) => {
      live.current = [];
      handle(e.x, e.y, true);
    },
    onUpdate: (e) => handle(e.x, e.y, false),
    onFinalize: () => {
      const finished = live.current;
      live.current = [];
      if (finished.length > 0) callbacks.current.onTraceEnd(finished);
      force((n) => n + 1);
    },
  });

  const tileStates = useMemo(() => {
    const state: TileState = look === 'tracing' ? 'selected' : look;
    const map = new Map<number, number>();
    path.forEach((t, i) => map.set(t, i + 1));
    return { state, order: map };
  }, [path, look]);

  const chain = chainStyle(look, tile, colors);
  const points = (indexes: readonly number[]) =>
    indexes
      .map((i) => {
        const c = tileCentre(i, tile, gap, board.size);
        return `${c.x},${c.y}`;
      })
      .join(' ');
  const hintFrom = path.length > 0 && hintTile != null ? [path[path.length - 1], hintTile] : null;

  return (
    <GestureDetector gesture={pan} touchAction="none" userSelect="none">
      <View accessibilityLabel="Letter board" style={{ width: plate, height: plate }}>
        <StickerBox
          fill={colors.board}
          shadow="cardLarge"
          radius={Math.round(plate * 0.082)}
          style={{ width: plate, height: plate }}
          contentStyle={{ padding: PAD }}
        >
          <View style={{ width: inner, height: inner }}>
            <Svg width={inner} height={inner} style={StyleSheet.absoluteFill} pointerEvents="none">
              {path.length > 1 && (
                <>
                  <Polyline points={points(path)} fill="none" stroke={colors.ink} strokeWidth={chain.under} strokeLinecap="round" strokeLinejoin="round" />
                  <Polyline
                    points={points(path)}
                    fill="none"
                    stroke={chain.color}
                    strokeWidth={chain.over}
                    strokeDasharray={chain.dash}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}
              {hintFrom && (
                <Polyline points={points(hintFrom)} fill="none" stroke={colors.butter} strokeWidth={Math.round(tile * 0.075)} strokeDasharray="2 12" strokeLinecap="round" />
              )}
            </Svg>
            <View style={[styles.grid, { gap }]}>
              {board.letters.map((letter, i) => {
                const order = tileStates.order.get(i);
                return (
                  <Tile
                    key={i}
                    letter={letter}
                    size={tile}
                    state={order ? tileStates.state : 'idle'}
                    order={order}
                    hint={hintTile === i && !order}
                  />
                );
              })}
            </View>
          </View>
        </StickerBox>
      </View>
    </GestureDetector>
  );
}

function chainStyle(look: TraceLook, tile: number, colors: ReturnType<typeof useTheme>['colors']) {
  const s = tile / 80;
  const base = { under: Math.round(20 * s), over: Math.round(9 * s) };
  switch (look) {
    case 'valid':
      return { ...base, color: colors.paper, dash: undefined };
    case 'duplicate':
      return { ...base, color: colors.butter, dash: '14 12' };
    case 'invalid':
      return { ...base, color: colors.bubblegum, dash: '1 16' };
    default:
      return { ...base, color: colors.butter, dash: undefined };
  }
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
});
