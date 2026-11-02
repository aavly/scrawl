import { boardLayout, tileAt, tileCentre } from '../geometry';

describe('boardLayout: DESIGN.md §4.1b', () => {
  it.each([
    // width, height, available height after insets → mode, tile
    [390, 844, 751, 'full', 80], // iPhone 14
    [375, 812, 728, 'compact', 76], // iPhone 13 mini
    [375, 667, 629, 'compact', 76], // iPhone SE
    [360, 640, 596, 'compact', 72], // Android
    [360, 592, 520, 'compact', 72], // short Android (the design table says 64; its formula gives 72)
  ])('%i×%i → %s, %ipx tiles', (w, h, a, mode, tile) => {
    expect(boardLayout(w, h, a)).toMatchObject({ mode, tile });
  });

  it('gives the 366pt plate on a full-size phone', () => {
    expect(boardLayout(390, 844, 751).plate).toBe(366);
  });

  it('reports too small to play below 56px tiles', () => {
    expect(boardLayout(300, 500, 380).tile).toBe(0);
  });
});

describe('tileAt', () => {
  const t = 80;
  const g = 8;

  it('hits a tile near its centre', () => {
    expect(tileAt(40, 40, t, g)).toBe(0);
    const c = tileCentre(5, t, g);
    expect(tileAt(c.x + 10, c.y - 10, t, g)).toBe(5);
  });

  it('misses at the corners, so diagonal slides skip neighbours', () => {
    // Where tiles 0, 1, 4 and 5 meet.
    expect(tileAt(84, 84, t, g)).toBeNull();
  });

  it('accepts a wider radius for the first touch', () => {
    expect(tileAt(76, 40, t, g, 4, 0.65)).toBeNull();
    expect(tileAt(76, 40, t, g, 4, 1)).toBe(0);
  });

  it('ignores points off the grid', () => {
    expect(tileAt(-20, 40, t, g)).toBeNull();
    expect(tileAt(40, 400, t, g)).toBeNull();
  });
});
