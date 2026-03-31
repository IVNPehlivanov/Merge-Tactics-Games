import { simpleHash } from "@/lib/seed-hash";

export type DescriptionToken =
  | { type: "word"; wordIndex: number; word: string }
  | { type: "raw"; text: string };

/** Split description into words (letters/digits + optional inner apostrophe chunks) and raw spacing/punctuation. */
export function tokenizeDescription(s: string): DescriptionToken[] {
  const out: DescriptionToken[] = [];
  let i = 0;
  let wordIndex = 0;
  while (i < s.length) {
    const slice = s.slice(i);
    const m = slice.match(/^([a-zA-Z0-9]+(?:'[a-zA-Z0-9]+)*)/);
    if (m) {
      const w = m[1];
      out.push({ type: "word", wordIndex: wordIndex++, word: w });
      i += w.length;
    } else {
      out.push({ type: "raw", text: s[i] });
      i += 1;
    }
  }
  return out;
}

/** Mulberry32 — deterministic PRNG from a 32-bit seed. */
function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Random permutation of word indices — identical for everyone when `seed` matches
 * (use `getDescriptionRevealOrderSeed`). Initial + wrong-guess reveals follow this order.
 */
export function wordRevealOrderSeeded(wordCount: number, seed: string): number[] {
  if (wordCount <= 0) return [];
  const order = Array.from({ length: wordCount }, (_, k) => k);
  const rand = mulberry32(simpleHash(seed) || 1);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = order[i]!;
    order[i] = order[j]!;
    order[j] = tmp;
  }
  return order;
}

export function initialRevealedWordCount(totalWords: number): number {
  if (totalWords <= 0) return 0;
  return Math.max(1, Math.ceil(totalWords * 0.25));
}

/** Which word indices are visible: initial ~25% plus one more per wrong guess (order from `revealOrder`). */
export function revealedWordIndexSet(
  totalWords: number,
  revealOrder: number[],
  wrongGuessCount: number,
): Set<number> {
  if (totalWords <= 0) return new Set();
  const initial = initialRevealedWordCount(totalWords);
  const n = Math.min(totalWords, initial + wrongGuessCount);
  return new Set(revealOrder.slice(0, n));
}
