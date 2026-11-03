// Word lookup backed by one sorted array. Binary search answers both "is this
// a word?" and "does any word start with this?", which is all the solver
// needs, without the memory of a trie.

/** 1 everyday, 2 familiar, 3 uncommon, 4 rare. */
export type Commonness = 1 | 2 | 3 | 4;

export class Dictionary {
  private readonly words: readonly string[];
  private readonly levels: string | null;
  private readonly mild: ReadonlySet<string>;

  /**
   * Words must be lower case and sorted. `commonness` is optional: one digit
   * (1–4) per word in the same order. `mild` lists valid words that house
   * players avoid.
   */
  constructor(sortedWords: readonly string[], commonness: string | null = null, mild: ReadonlySet<string> = new Set()) {
    this.words = sortedWords;
    this.levels = commonness;
    this.mild = mild;
  }

  static fromNewlineList(list: string, commonness: string | null = null, mild: ReadonlySet<string> = new Set()): Dictionary {
    return new Dictionary(list.split('\n'), commonness, mild);
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

  /** Valid, but mild profanity or a clinical term: house players never play it. */
  isMild(word: string): boolean {
    return this.mild.has(word.toLowerCase());
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
 * The game dictionary (ENABLE minus blocked words, with SCOWL commonness and
 * the mild-word list).
 * Loaded on first use because the word list is large.
 */
export function gameDictionary(): Dictionary {
  if (!shared) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { WORDS, COMMONNESS, MILD } = require('./words.generated') as { WORDS: string; COMMONNESS: string; MILD: string };
    shared = Dictionary.fromNewlineList(WORDS, COMMONNESS, new Set(MILD.split('\n')));
  }
  return shared;
}
