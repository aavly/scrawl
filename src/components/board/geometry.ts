// Board sizing and hit-testing. Pure functions, unit tested.

export type BoardLayoutMode = 'full' | 'compact';

export const BOARD_GAP = 8;
const PLATE_EXTRA = 22; // 2 × 8 padding + 2 × 3 border
const HEADER_BLOCK = 160; // score cards, word display, found-words row and gaps
const MIN_TILE = 56;

/**
 * Which board layout to use and how big the tiles are (DESIGN.md §4.1b).
 * `width`/`height` are the screen size; `available` is the height left after
 * the real safe-area insets (status bar, home indicator, browser bars).
 * Returns tile 0 when the screen is too small to play.
 */
export function boardLayout(width: number, height: number, available: number, size = 4) {
  const mode: BoardLayoutMode = width >= 390 && height >= 720 ? 'full' : 'compact';
  const room = Math.min(width - 24, available - HEADER_BLOCK) - PLATE_EXTRA - (size - 1) * BOARD_GAP;
  const fitted = Math.min(80, Math.floor(room / size));
  const tile = fitted < MIN_TILE ? 0 : fitted;
  return { mode, tile, gap: BOARD_GAP, plate: size * tile + (size - 1) * BOARD_GAP + PLATE_EXTRA };
}

/** Centre of a tile, measured from the top left of the tile grid. */
export function tileCentre(index: number, tile: number, gap: number, size = 4) {
  return {
    x: tile / 2 + (index % size) * (tile + gap),
    y: tile / 2 + Math.floor(index / size) * (tile + gap),
  };
}

/**
 * The tile under a point, or null. `radius` is the share of half a tile that
 * counts as a hit: generous for the first touch, tighter while dragging so a
 * diagonal slide past a corner doesn't catch the neighbouring tile (§15).
 */
export function tileAt(x: number, y: number, tile: number, gap: number, size = 4, radius = 0.65): number | null {
  const pitch = tile + gap;
  const col = Math.floor((x + gap / 2) / pitch);
  const row = Math.floor((y + gap / 2) / pitch);
  if (col < 0 || row < 0 || col >= size || row >= size) return null;
  const index = row * size + col;
  const c = tileCentre(index, tile, gap, size);
  const limit = (tile / 2) * radius;
  return Math.hypot(x - c.x, y - c.y) <= limit ? index : null;
}
