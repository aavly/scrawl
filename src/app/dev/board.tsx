// DEV ONLY: the board screen frozen in each state from the design mockups,
// with the DESIGN.md §6 sample data, for side-by-side comparison with
// docs/design/screens/phone/Board*.png. Open /dev/board?state=valid etc.

import { useLocalSearchParams } from 'expo-router';

import { RoundView, type RoundViewProps } from '@/features/round/RoundView';
import { SAMPLE_BOARD } from '@/game/__fixtures__/sample';
import { parseBoard } from '@/game/engine/board';
import { pointsForWord } from '@/game/engine/scoring';
import { housePlayer } from '@/game/housePlayers';

const board = parseBoard(SAMPLE_BOARD);
// The mockups' found words (newest first).
const LONG = ['SIDE', 'TIED', 'RIDE', 'SPEND', 'CLONE', 'CHART', 'EDIT', 'HORN', 'TIDE', 'ARID', 'SEND', 'LENS', 'ONE', 'HAS', 'TIE', 'DIE', 'LEND', 'RITE', 'ORT', 'DIN', 'HORNS', 'CHARTS'];
const finds = (words: string[]) => words.map((w) => ({ word: w, points: pointsForWord(w) }));
const noop = () => {};

const STATES: Record<string, Partial<RoundViewProps> & { opponentScore: number }> = {
  tracing: {
    msLeft: 23_000,
    me: { avatar: 'marlow', username: 'wordfox_', score: 3700 },
    opponentScore: 3100,
    word: { look: 'tracing', text: 'STRID', key: 1 },
    finds: finds(LONG),
    trace: { path: [3, 7, 6, 10, 14], look: 'tracing' },
  },
  valid: {
    msLeft: 21_000,
    me: { avatar: 'marlow', username: 'wordfox_', score: 4700 },
    opponentScore: 3400,
    word: { look: 'valid', text: 'STRIDE', points: 1000, key: 2 },
    finds: finds(['STRIDE', ...LONG]),
    highlightNewest: true,
    trace: { path: [3, 7, 6, 10, 14, 11], look: 'valid' },
  },
  duplicate: {
    msLeft: 17_000,
    me: { avatar: 'marlow', username: 'wordfox_', score: 4700 },
    opponentScore: 3400,
    word: { look: 'duplicate', text: 'STRIDE', key: 3 },
    finds: finds(['STRIDE', ...LONG]),
    duplicate: { word: 'STRIDE', key: 3 },
    trace: { path: [3, 7, 6, 10, 14, 11], look: 'duplicate' },
  },
  invalid: {
    msLeft: 14_000,
    me: { avatar: 'marlow', username: 'wordfox_', score: 4700 },
    opponentScore: 3700,
    word: { look: 'invalid', text: 'SRT', key: 4 },
    finds: finds(['STRIDE', ...LONG]),
    trace: { path: [3, 6, 7], look: 'invalid' },
  },
  last10: {
    msLeft: 7_000,
    me: { avatar: 'marlow', username: 'wordfox_', score: 4700 },
    opponentScore: 4000,
    word: { look: 'tracing', text: 'DIN', key: 5 },
    finds: finds(['STRIDE', ...LONG]),
    trace: { path: [14, 10, 9], look: 'tracing' },
  },
  highscore: {
    msLeft: 31_000,
    me: { avatar: 'marlow', username: 'wordfox_', score: 12400 },
    opponentScore: 11900,
    word: { look: 'valid', text: 'ASTRIDE', points: 1600, key: 6 },
    finds: finds(['ASTRIDE', ...LONG]),
    highlightNewest: true,
    trace: { path: [2, 3, 7, 6, 10, 14, 11], look: 'valid' },
  },
};

export default function BoardStatesPreview() {
  const { state = 'tracing' } = useLocalSearchParams<{ state?: string }>();
  const s = STATES[state] ?? STATES.tracing;
  return (
    <RoundView
      board={board}
      msLeft={s.msLeft!}
      me={s.me!}
      opponent={{ player: housePlayer('bolt'), score: s.opponentScore }}
      word={s.word!}
      finds={s.finds!}
      highlightNewest={s.highlightNewest ?? false}
      duplicate={s.duplicate ?? null}
      trace={s.trace!}
      onTraceChange={noop}
      onTraceEnd={noop}
    />
  );
}
