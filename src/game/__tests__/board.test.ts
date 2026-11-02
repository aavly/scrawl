import { boardToString, isAdjacent, neighbours, parseBoard } from '../engine/board';
import { readTrace } from '../engine/trace';

import { SAMPLE_BOARD } from '../__fixtures__/sample';

const board = parseBoard(SAMPLE_BOARD);

describe('board', () => {
  it('parses and prints row by row', () => {
    expect(board.size).toBe(4);
    expect(board.letters.join('')).toBe('CHASLORTENIEPSDA');
    expect(boardToString(board)).toBe(SAMPLE_BOARD);
  });

  it('rejects a board that is not square', () => {
    expect(() => parseBoard('ABC/DE')).toThrow();
  });

  it('counts neighbours including diagonals', () => {
    const n = neighbours(4);
    expect(n[0]).toHaveLength(3); // corner
    expect(n[1]).toHaveLength(5); // edge
    expect(n[5]).toHaveLength(8); // middle
  });

  it('treats diagonals as adjacent but not wrap-arounds', () => {
    expect(isAdjacent(board, 0, 5)).toBe(true);
    expect(isAdjacent(board, 3, 4)).toBe(false); // end of row 0 to start of row 1
    expect(isAdjacent(board, 0, 0)).toBe(false);
  });
});

describe('readTrace', () => {
  // S(3) T(7) R(6) I(10) D(14) E(11) — as traced in the Board mockup, plus E.
  it('spells a valid path', () => {
    expect(readTrace(board, [3, 7, 6, 10, 14, 11])).toEqual({ ok: true, word: 'STRIDE' });
  });

  it.each([
    [[], 'empty'],
    [[3, 16], 'out-of-bounds'],
    [[3, 7, 3], 'repeated-tile'],
    [[0, 15], 'not-adjacent'],
  ] as const)('rejects %j as %s', (path, error) => {
    expect(readTrace(board, path)).toEqual({ ok: false, error });
  });
});
