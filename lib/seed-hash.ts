/** Deterministic 32-bit-ish hash — same input → same output on every device and build. */
export function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Single seed for Description mode word visibility + reveal order.
 * Same UTC `dayKey` + same daily answer `secretKey` → same shuffle for all players.
 */
export function getDescriptionRevealOrderSeed(dayKey: string, secretKey: string): string {
  return `${dayKey}_description_reveal_${secretKey}`;
}
