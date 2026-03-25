import { SITE, getGameMetaBySlug } from "@/lib/content";
import {
  DAILY_GAME_SLUGS,
  type DailyGameSlug,
  hasPlayedOnDay,
  getPersistedGameState,
} from "@/lib/daily";

/** Tries for a finished daily mode, or `null` if not completed today. */
function completedTries(slug: DailyGameSlug, dayKey: string): number | null {
  if (!hasPlayedOnDay(slug, dayKey)) return null;

  if (slug === "classic") {
    const s = getPersistedGameState<{ guesses?: unknown[] }>("classic", dayKey);
    const n = s?.guesses?.length ?? 0;
    return n > 0 ? n : 1;
  }

  const s = getPersistedGameState<{ wrongGuesses?: string[] }>(slug, dayKey);
  const w = s?.wrongGuesses?.length ?? 0;
  return w + 1;
}

/**
 * Multi-line share blurb for the three daily modes: 🔥 when done today, `0 Tries ❌` when not.
 */
export function buildMergedleDailyShareText(dayKey: string): string {
  const lines: string[] = ["My #Mergedle results for today:"];

  for (const slug of DAILY_GAME_SLUGS) {
    const gameName = getGameMetaBySlug(slug)?.title ?? slug;
    const tries = completedTries(slug, dayKey);
    if (tries !== null) {
      const w = tries === 1 ? "Try" : "Tries";
      lines.push(`${gameName}: ${tries} ${w} 🔥`);
    } else {
      lines.push(`${gameName}: 0 Tries ❌`);
    }
  }

  lines.push("", SITE.url);
  return lines.join("\n");
}
