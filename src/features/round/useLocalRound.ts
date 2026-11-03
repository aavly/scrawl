import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { WordLook } from '@/components/round/WordDisplay';
import { feedback } from '@/feedback/feedback';
import { gameDictionary, generateBoard, mildExclamation, planHouseRound, PlayerRound, ROUND_MS } from '@/game/engine';
import { housePlayer, type HousePlayerId } from '@/game/housePlayers';

/** How long a submitted word's colours stay on the tiles. */
const RESULT_MS = 650;

export type TraceView = {
  path: number[];
  look: 'tracing' | 'valid' | 'duplicate' | 'invalid';
};

/**
 * A full round against a house player, entirely on the device (Practice, the
 * tutorial, and the ranked fallback until the server exists). The house
 * player's round is planned up front and played back against the clock.
 */
export function useLocalRound(opponentId: HousePlayerId, seed: number) {
  const dictionary = useMemo(() => gameDictionary(), []);
  const { board, solved } = useMemo(() => generateBoard(seed, dictionary), [seed, dictionary]);
  const opponent = housePlayer(opponentId);
  const plan = useMemo(() => planHouseRound(opponent.style, solved, seed + 1), [opponent, solved, seed]);

  const round = useMemo(() => new PlayerRound(board, dictionary), [board, dictionary]);
  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(startedAt);
  const elapsed = Math.min(ROUND_MS, now - startedAt);
  const finished = elapsed >= ROUND_MS;

  // Clock: ten updates a second is plenty for M:SS and the opponent's score.
  useEffect(() => {
    feedback({ type: 'round-start' });
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, []);

  // Opponent score from the plan, and a "+points" bubble when it changes.
  const opponentFinds = plan.filter((f) => f.atMs <= elapsed);
  const opponentScore = opponentFinds.reduce((sum, f) => sum + f.points, 0);
  const lastOpponentFind = opponentFinds[opponentFinds.length - 1];
  const bubbleShown = useRef(0);
  const bubble = lastOpponentFind && elapsed - lastOpponentFind.atMs < 1200 ? { text: `+${lastOpponentFind.points.toLocaleString('en-US')}`, key: opponentFinds.length } : null;
  useEffect(() => {
    if (opponentFinds.length > bubbleShown.current) {
      bubbleShown.current = opponentFinds.length;
      feedback({ type: 'opponent-scored' });
    }
  }, [opponentFinds.length]);

  // A tick each second in the last 10.
  const secondsLeft = Math.ceil((ROUND_MS - elapsed) / 1000);
  useEffect(() => {
    if (secondsLeft <= 10 && secondsLeft > 0) feedback({ type: 'last10-tick', secondsLeft });
  }, [secondsLeft]);

  // The player's side.
  const [trace, setTrace] = useState<TraceView>({ path: [], look: 'tracing' });
  const [word, setWord] = useState<{ look: WordLook; text: string; points?: number; exclamation?: string; key: number }>({
    look: 'empty',
    text: '',
    key: 0,
  });
  const [finds, setFinds] = useState(round.finds);
  const [duplicate, setDuplicate] = useState<{ word: string; key: number } | null>(null);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tracedLength = useRef(0);

  const onTraceChange = useCallback(
    (path: number[]) => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
      // A tick for each tile added, none when sliding back to undo one.
      if (path.length > tracedLength.current) feedback({ type: 'tile', letterIndex: path.length - 1 });
      tracedLength.current = path.length;
      setTrace({ path, look: 'tracing' });
      setDuplicate(null);
      setWord((w) => ({ look: 'tracing', text: path.map((i) => board.letters[i]).join(''), key: w.key }));
    },
    [board],
  );

  const onTraceEnd = useCallback(
    (path: number[]) => {
      tracedLength.current = 0;
      const result = round.submit(path, Date.now() - startedAt);
      const key = Date.now();
      if (result.kind === 'valid') {
        feedback({ type: 'valid', letters: result.word.length, mild: result.mild });
        setTrace({ path, look: 'valid' });
        setWord({ look: 'valid', text: result.word, points: result.points, exclamation: result.mild ? mildExclamation(key) : undefined, key });
        setFinds(round.finds);
      } else if (result.kind === 'duplicate') {
        feedback({ type: 'duplicate' });
        setTrace({ path, look: 'duplicate' });
        setWord({ look: 'duplicate', text: result.word, key });
        setDuplicate({ word: result.word, key });
      } else if (result.kind === 'invalid') {
        feedback({ type: 'invalid' });
        setTrace({ path, look: 'invalid' });
        setWord({ look: 'invalid', text: result.word, key });
      } else {
        // One or two letters: just let go, no penalty.
        setTrace({ path: [], look: 'tracing' });
        setWord({ look: 'empty', text: '', key });
        return;
      }
      if (clearTimer.current) clearTimeout(clearTimer.current);
      clearTimer.current = setTimeout(() => setTrace({ path: [], look: 'tracing' }), RESULT_MS);
    },
    [round, startedAt],
  );

  useEffect(() => {
    if (finished) feedback({ type: 'round-end', won: round.score === opponentScore ? null : round.score > opponentScore });
    // Only when the round ends.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  useEffect(() => () => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
  }, []);

  return {
    board,
    solved,
    opponent,
    msLeft: ROUND_MS - elapsed,
    finished,
    player: { score: round.score, finds },
    opponentScore,
    opponentFinds,
    bubble,
    trace,
    word,
    duplicate,
    highlightNewest: word.look === 'valid',
    onTraceChange,
    onTraceEnd,
  };
}
