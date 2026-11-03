import { KAIJUMO_WORDS, SAMPLE_BOARD, WORDFOX_WORDS } from '../__fixtures__/sample';
import { parseBoard } from '../engine/board';
import { gameDictionary } from '../engine/dictionary';
import { solveBoard } from '../engine/solver';
import { buildMatchResult } from '../results';

const solved = solveBoard(parseBoard(SAMPLE_BOARD), gameDictionary());
const base = { solved, yourWords: WORDFOX_WORDS, theirWords: KAIJUMO_WORDS, yourRating: 1642, theirRating: 1655, rankedPlayed: 50 };

describe('buildMatchResult: the DESIGN.md sample match', () => {
  const r = buildMatchResult({ ...base, mode: 'ranked' });

  it('scores 4,800 to 4,400, a win worth +17', () => {
    expect(r.outcome).toBe('win');
    expect([r.you.score, r.them.score]).toEqual([4800, 4400]);
    expect(r.rating).toMatchObject({ delta: 17, newRating: 1659 });
  });

  it('lists words highest-scoring first and stars the ones only you found', () => {
    expect(r.you.words.slice(0, 4).map((w) => w.word)).toEqual(['STRIDE', 'CHART', 'CLONE', 'SPEND']);
    expect(r.you.words.find((w) => w.word === 'STRIDE')!.unique).toBe(true);
    expect(r.you.words.find((w) => w.word === 'CHART')!.unique).toBe(false);
  });

  it('suggests the three best familiar words you missed', () => {
    expect(r.missed).toHaveLength(3);
    expect(r.missed.every((m) => !WORDFOX_WORDS.includes(m.word))).toBe(true);
    expect(r.missed[0].points).toBeGreaterThanOrEqual(r.missed[2].points);
    const common = new Map(solved.words.map((s) => [s.word, s.commonness]));
    expect(r.missed.every((m) => common.get(m.word)! <= 2)).toBe(true);
  });
});

describe('buildMatchResult: modes', () => {
  it('practice and tutorial never change rating', () => {
    expect(buildMatchResult({ ...base, mode: 'practice' }).rating).toBeNull();
    expect(buildMatchResult({ ...base, mode: 'tutorial' }).rating).toBeNull();
  });

  it('reports a loss and a softened rating drop', () => {
    const r = buildMatchResult({ ...base, mode: 'ranked', yourWords: KAIJUMO_WORDS, theirWords: WORDFOX_WORDS });
    expect(r.outcome).toBe('loss');
    expect(r.rating!.delta).toBeLessThan(0);
  });
});
