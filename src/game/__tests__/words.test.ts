import fs from 'fs';
import path from 'path';

import { parseBoard } from '../engine/board';
import { gameDictionary } from '../engine/dictionary';
import { PlayerRound } from '../engine/round';
import { pointsForWord, wordTier } from '../engine/scoring';
import { solveBoard } from '../engine/solver';
import { readTrace } from '../engine/trace';

import { KAIJUMO_WORDS, SAMPLE_BOARD, SAMPLE_WORDS, WORDFOX_WORDS } from '../__fixtures__/sample';

const dictionary = gameDictionary();
const board = parseBoard(SAMPLE_BOARD);
const solved = solveBoard(board, dictionary);
const pathOf = (word: string) => solved.words.find((s) => s.word === word)!.path;

describe('dictionary', () => {
  it('knows words and prefixes', () => {
    expect(dictionary.has('stride')).toBe(true);
    expect(dictionary.has('STRIDE')).toBe(true);
    expect(dictionary.has('strid')).toBe(false);
    expect(dictionary.hasPrefix('strid')).toBe(true);
    expect(dictionary.hasPrefix('xqz')).toBe(false);
  });

  it('ranks everyday words as more common than obscure ones', () => {
    expect(dictionary.commonness('house')).toBe(1);
    expect(dictionary.commonness('ort')).toBe(4);
  });

  it('contains no word from the offensive-word list', () => {
    const list = fs
      .readFileSync(path.join(__dirname, '../../../data/offensive-words-en.txt'), 'utf8')
      .split('\n')
      .map((w) => w.trim().toLowerCase())
      .filter((w) => /^[a-z]{3,}$/.test(w));
    expect(list.length).toBeGreaterThan(100);
    expect(list.filter((w) => dictionary.has(w))).toEqual([]);
  });
});

describe('scoring', () => {
  it('follows the reward ladder', () => {
    expect(['ON', 'ONE', 'EDIT', 'CHART', 'STRIDE', 'ASTRIDE', 'AERATION'].map(pointsForWord)).toEqual([
      0, 100, 300, 600, 1000, 1600, 2400,
    ]);
    expect(wordTier('CHART')).toBe('nice');
    expect(wordTier('AERATIONS')).toBe('legendary');
  });
});

describe('solver', () => {
  it('finds every sample word from DESIGN.md', () => {
    const found = new Set(solved.words.map((s) => s.word));
    expect(SAMPLE_WORDS.filter((w) => !found.has(w))).toEqual([]);
  });

  it('returns a path that really spells each word', () => {
    for (const s of solved.words) expect(readTrace(board, s.path)).toEqual({ ok: true, word: s.word });
  });

  it('adds up the maximum score', () => {
    expect(solved.maxScore).toBe(solved.words.reduce((sum, s) => sum + s.points, 0));
  });
});

describe('PlayerRound', () => {
  it('scores the sample match: wordfox_ 4,800, kaijumo 4,400', () => {
    const play = (words: string[]) => {
      const round = new PlayerRound(board, dictionary);
      words.forEach((w, i) => round.submit(pathOf(w), i * 1000));
      return round.score;
    };
    expect(play(WORDFOX_WORDS)).toBe(4800);
    expect(play(KAIJUMO_WORDS)).toBe(4400);
  });

  it('reports valid, duplicate, invalid, too short and bad traces', () => {
    const round = new PlayerRound(board, dictionary);
    expect(round.submit(pathOf('STRIDE'), 1000)).toMatchObject({ kind: 'valid', word: 'STRIDE', points: 1000, score: 1000 });
    expect(round.submit(pathOf('STRIDE'), 2000)).toMatchObject({ kind: 'duplicate', score: 1000 });
    expect(round.submit([3, 7, 6], 3000)).toMatchObject({ kind: 'invalid', word: 'STR' });
    expect(round.submit([3, 7], 4000)).toMatchObject({ kind: 'too-short' });
    expect(round.submit([0, 15], 5000)).toMatchObject({ kind: 'bad-trace' });
    expect(round.finds.map((f) => f.word)).toEqual(['STRIDE']);
  });

  it('lists finds newest first', () => {
    const round = new PlayerRound(board, dictionary);
    round.submit(pathOf('ONE'), 1000);
    round.submit(pathOf('CHART'), 2000);
    expect(round.finds.map((f) => f.word)).toEqual(['CHART', 'ONE']);
  });
});
