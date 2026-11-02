// Word lookup backed by one sorted array. Binary search answers both "is this
// a word?" and "does any word start with this?", which is all the solver
// needs, without the memory of a trie.

/** 1 everyday, 2 familiar, 3 uncommon, 4 rare. */
export type Commonness = 1 | 2 | 3 | 4;

export class Dictionary {
  private readonly words: readonly string[];
  private readonly levels: string | null;

  /**
   * Words must be lower case and sorted. `commonness` is optional: one digit
   * (1–4) per word in the same order.
   */
  constructor(sortedWords: readonly string[], commonness: string | null = null) {
    this.words = sortedWords;
    this.levels = commonness;
  }

  static fromNewlineList(list: string, commonness: string | null = null): Dictionary {
    return new Dictionary(list.split('\n'), commonness);
  }

  get size(): number {
    return this.words.length;
  }

  has(word: string): boolean {
    return this.indexOf(word) >= 0;
  }

  /** True if at least one word starts with the prefix (the prefix itself counts). */
  hasPrefix(prefix: string): boolean {
    const p = prefix.toLowerCase();
    const i = this.lowerBound(p);
    return i < this.words.length && this.words[i].startsWith(p);
  }

  /** How common the word is. Unknown words and dictionaries without levels count as rare. */
  commonness(word: string): Commonness {
    const i = this.indexOf(word);
    if (i < 0 || !this.levels) return 4;
    return Number(this.levels[i]) as Commonness;
  }

  private indexOf(word: string): number {
    const w = word.toLowerCase();
    const i = this.lowerBound(w);
    return i < this.words.length && this.words[i] === w ? i : -1;
  }

  private lowerBound(target: string): number {
    let lo = 0;
    let hi = this.words.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (this.words[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
}

let shared: Dictionary | null = null;

/**
 * The game dictionary (ENABLE minus offensive words, with SCOWL commonness).
 * Loaded on first use because the word list is large.
 */
export function gameDictionary(): Dictionary {
  if (!shared) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { WORDS, COMMONNESS } = require('./words.generated') as { WORDS: string; COMMONNESS: string };
    shared = Dictionary.fromNewlineList(WORDS, COMMONNESS);
  }
  return shared;
}
