// DEV ONLY: Results with the DESIGN.md §6 sample match (wordfox_ 4,800 vs
// 4,400) against Bolt, for comparing with docs/design/screens/phone/Results*.png.
// /dev/results?mode=practice shows the practice version.

import { useLocalSearchParams } from 'expo-router';

import Results from '@/app/results';
import { setLastMatch } from '@/features/match/matchStore';
import { KAIJUMO_WORDS, SAMPLE_BOARD, WORDFOX_WORDS } from '@/game/__fixtures__/sample';
import { gameDictionary, parseBoard, solveBoard } from '@/game/engine';
import { buildMatchResult } from '@/game/results';

export default function SampleResults() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const result = buildMatchResult({
    mode: mode === 'practice' ? 'practice' : 'ranked',
    solved: solveBoard(parseBoard(SAMPLE_BOARD), gameDictionary()),
    yourWords: WORDFOX_WORDS,
    theirWords: KAIJUMO_WORDS,
    yourRating: 1642,
    theirRating: 1700,
    rankedPlayed: 50,
  });
  setLastMatch({ result, opponentId: 'bolt', seed: 1 });
  return <Results />;
}
