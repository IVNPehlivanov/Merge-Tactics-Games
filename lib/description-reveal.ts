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

/** Word indices in left-to-right reading order — same sequence for every player. */
export function wordRevealOrderReadingOrder(wordCount: number): number[] {
  if (wordCount <= 0) return [];
  return Array.from({ length: wordCount }, (_, k) => k);
}

export function initialRevealedWordCount(totalWords: number): number {
  if (totalWords <= 0) return 0;
  return Math.max(1, Math.ceil(totalWords * 0.25));
}

/** Which word indices are visible: initial 25% plus one more per wrong guess (reading order). */
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
