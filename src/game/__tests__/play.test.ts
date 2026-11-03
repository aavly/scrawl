import { boardToString } from '../engine/board';
import { gameDictionary } from '../engine/dictionary';
import { DEFAULT_BOARD_RULES, generateBoard } from '../engine/generator';
import { planHouseRound } from '../engine/housePlay';
import { checkPlausibility } from '../engine/plausibility';
import { ROUND_MS } from '../engine/round';
import { HOUSE_PLAYERS, housePlayer } from '../housePlayers';

const dictionary = gameDictionary();
const boards = Array.from({ length: 60 }, (_, i) => generateBoard(5000 + i, dictionary));

describe('generateBoard', () => {
  it('is deterministic for a seed', () => {
    expect(boardToString(generateBoard(7, dictionary).board)).toBe(boardToString(generateBoard(7, dictionary).board));
    expect(boardToString(generateBoard(7, dictionary).board)).not.toBe(boardToString(generateBoard(8, dictionary).board));
  });

  it('only returns boards that meet the quality rules', () => {
    for (const { solved } of boards) {
      expect(solved.words.length).toBeGreaterThanOrEqual(DEFAULT_BOARD_RULES.minWords);
      expect(Math.max(...solved.words.map((w) => w.word.length))).toBeGreaterThanOrEqual(DEFAULT_BOARD_RULES.minLongestWord);
    }
  });

  it('never uses Q and keeps rare letters to one each', () => {
    for (const { board } of boards) {
      expect(board.letters).not.toContain('Q');
      for (const rare of ['J', 'K', 'V', 'X', 'Z']) expect(board.letters.filter((l) => l === rare).length).toBeLessThanOrEqual(1);
    }
  });
});

describe('planHouseRound', () => {
  const { solved } = boards[0];

  it('never plays a mild word', () => {
    for (const { solved: s } of boards) {
      for (const h of HOUSE_PLAYERS) {
        const mild = new Set(s.words.filter((w) => w.mild).map((w) => w.word));
        expect(planHouseRound(h.style, s, 9).filter((f) => mild.has(f.word))).toEqual([]);
      }
    }
  });

  it('is deterministic for a seed', () => {
    const style = housePlayer('bolt').style;
    expect(planHouseRound(style, solved, 1)).toEqual(planHouseRound(style, solved, 1));
  });

  it('only finds real words on the board, once each, inside the round', () => {
    const onBoard = new Set(solved.words.map((s) => s.word));
    for (const h of HOUSE_PLAYERS) {
      const plan = planHouseRound(h.style, solved, 3);
      expect(plan.every((f) => onBoard.has(f.word))).toBe(true);
      expect(new Set(plan.map((f) => f.word)).size).toBe(plan.length);
      expect(plan.every((f) => f.atMs >= 2500 && f.atMs < ROUND_MS)).toBe(true);
      expect(plan.map((f) => f.atMs)).toEqual([...plan.map((f) => f.atMs)].sort((a, b) => a - b));
    }
  });

  it('gets stronger level by level, and Bolt scores like the sample Gold II player', () => {
    const median = (id: (typeof HOUSE_PLAYERS)[number]['id']) => {
      const scores = boards
        .map((b, i) => planHouseRound(housePlayer(id).style, b.solved, i).reduce((s, f) => s + f.points, 0))
        .sort((a, b) => a - b);
      return scores[Math.floor(scores.length / 2)];
    };
    const medians = HOUSE_PLAYERS.map((h) => median(h.id));
    expect(medians).toEqual([...medians].sort((a, b) => a - b));
    expect(new Set(medians).size).toBe(medians.length);
    // The sample Gold II player scored 4,800 (DESIGN.md §6).
    expect(median('bolt')).toBeGreaterThan(3000);
    expect(median('bolt')).toBeLessThan(7000);
  });
});

describe('checkPlausibility', () => {
  const { solved } = boards[1];

  it('passes every house player, which plays like a person', () => {
    for (const h of HOUSE_PLAYERS) {
      for (let seed = 0; seed < 10; seed++) {
        expect(checkPlausibility(planHouseRound(h.style, solved, seed), solved)).toEqual({ plausible: true, flags: [] });
      }
    }
  });

  it('flags a solver dumping every word at machine speed', () => {
    const dump = solved.words.map((s, i) => ({ word: s.word, atMs: 3000 + i * 40 }));
    const result = checkPlausibility(dump, solved);
    expect(result.plausible).toBe(false);
    expect(result.flags).toEqual(expect.arrayContaining(['too-fast', 'too-many-rare-words', 'too-much-of-board', 'robotic-timing']));
  });

  it('flags metronome-even timing even at a human pace', () => {
    const even = solved.words.slice(0, 15).map((s, i) => ({ word: s.word, atMs: 4000 + i * 4000 }));
    expect(checkPlausibility(even, solved).flags).toContain('robotic-timing');
  });
});
