import {
  CARD_STATS,
  getCardKeys,
  getCardDisplayName,
  cardImagePath,
  nameMatchesSearch,
} from "@/lib/card-stats";
import { RULERS, getRulerKeys, getRulerByKey, pixelRulerCardImagePath } from "@/lib/ruler-stats";

/** Same normalization as card search — keep in sync with `card-stats` behavior. */
function normalizeSearchText(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Troops/buildings + rulers that have description text (used by Description mode).
 * Sorted alphabetically so pool order is identical on every device (stable daily index).
 */
export function getDescriptionGameKeys(): string[] {
  const cards = getCardKeys().filter((k) => Boolean(CARD_STATS[k]?.description?.trim()));
  const rulers = getRulerKeys().filter((k) => Boolean(RULERS[k]?.description?.trim()));
  return [...cards, ...rulers].sort((a, b) => a.localeCompare(b));
}

export function getDescriptionDisplayName(key: string): string {
  if (CARD_STATS[key]) return getCardDisplayName(key);
  return getRulerByKey(key)?.name ?? key;
}

export function descriptionImagePath(key: string): string {
  if (CARD_STATS[key]) return cardImagePath(key);
  if (RULERS[key]) return pixelRulerCardImagePath(key);
  return cardImagePath(key);
}

export function descriptionMatchesSearch(key: string, query: string): boolean {
  return nameMatchesSearch(getDescriptionDisplayName(key), query);
}

export function findExactDescriptionMatchKey(query: string): string | null {
  const qNorm = normalizeSearchText(query);
  if (!qNorm) return null;
  const pool = getDescriptionGameKeys();
  return (
    pool.find((k) => normalizeSearchText(getDescriptionDisplayName(k)) === qNorm) ?? null
  );
}

export function getDescriptionTextForKey(key: string): string {
  return CARD_STATS[key]?.description?.trim() ?? RULERS[key]?.description?.trim() ?? "";
}
