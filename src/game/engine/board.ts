// A square letter grid. Tiles are numbered row by row from 0 (top left).
// The size is a parameter so other grids can come later (DESIGN.md §16).

export type Board = {
  size: number;
  /** Upper-case letters, row-major, length size × size. */
  letters: string[];
};

/** Parses "CHAS/LORT/ENIE/PSDA" (rows separated by slashes). */
export function parseBoard(text: string): Board {
  const rows = text.trim().toUpperCase().split('/');
  const size = rows.length;
  if (!rows.every((r) => r.length === size)) throw new Error(`Board must be square: ${text}`);
  return { size, letters: rows.join('').split('') };
}

export function boardToString(board: Board): string {
  const rows: string[] = [];
  for (let r = 0; r < board.size; r++) rows.push(board.letters.slice(r * board.size, (r + 1) * board.size).join(''));
  return rows.join('/');
}

export function rowCol(board: Board, index: number): { row: number; col: number } {
  return { row: Math.floor(index / board.size), col: index % board.size };
}

/** True when two tiles touch, diagonals included. */
export function isAdjacent(board: Board, a: number, b: number): boolean {
  if (a === b) return false;
  const p = rowCol(board, a);
  const q = rowCol(board, b);
  return Math.abs(p.row - q.row) <= 1 && Math.abs(p.col - q.col) <= 1;
}

const neighbourCache = new Map<number, number[][]>();

/** Every tile's neighbours, cached per board size. */
export function neighbours(size: number): number[][] {
  let table = neighbourCache.get(size);
  if (!table) {
    table = [];
    for (let i = 0; i < size * size; i++) {
      const row = Math.floor(i / size);
      const col = i % size;
      const list: number[] = [];
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const r = row + dr;
          const c = col + dc;
          if (r >= 0 && r < size && c >= 0 && c < size) list.push(r * size + c);
        }
      }
      table.push(list);
    }
    neighbourCache.set(size, table);
  }
  return table;
}
