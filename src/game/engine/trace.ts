import { isAdjacent, type Board } from './board';

export type TraceError = 'empty' | 'out-of-bounds' | 'repeated-tile' | 'not-adjacent';

export type TraceResult = { ok: true; word: string } | { ok: false; error: TraceError };

/**
 * Checks a traced path of tile indexes: every tile on the board, none used
 * twice, each touching the last. Returns the word it spells (upper case).
 * Dictionary checks happen separately.
 */
export function readTrace(board: Board, path: readonly number[]): TraceResult {
  if (path.length === 0) return { ok: false, error: 'empty' };
  const seen = new Set<number>();
  for (let i = 0; i < path.length; i++) {
    const tile = path[i];
    if (!Number.isInteger(tile) || tile < 0 || tile >= board.letters.length) return { ok: false, error: 'out-of-bounds' };
    if (seen.has(tile)) return { ok: false, error: 'repeated-tile' };
    if (i > 0 && !isAdjacent(board, path[i - 1], tile)) return { ok: false, error: 'not-adjacent' };
    seen.add(tile);
  }
  return { ok: true, word: path.map((t) => board.letters[t]).join('') };
}
