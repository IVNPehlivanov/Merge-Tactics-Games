import { SITE, getGameMetaBySlug } from "@/lib/content";
import { DAILY_GAME_SLUGS, type DailyGameSlug, getPersistedGameState } from "@/lib/daily";

type ModeShareStatus = "won" | "in_progress" | "none";

function modeShareOutcome(
  slug: DailyGameSlug,
  dayKey: string,
): { tries: number; status: ModeShareStatus } {
  if (slug === "classic") {
    const s = getPersistedGameState<{ guesses?: unknown[]; won?: boolean }>("classic", dayKey);
    if (!s) return { tries: 0, status: "none" };
    const n = s.guesses?.length ?? 0;
    if (s.won) {
      return { tries: n > 0 ? n : 1, status: "won" };
    }
    if (n > 0) return { tries: n, status: "in_progress" };
    return { tries: 0, status: "none" };
  }

  const s = getPersistedGameState<{ wrongGuesses?: string[]; won?: boolean }>(slug, dayKey);
  if (!s) return { tries: 0, status: "none" };
  const w = s.wrongGuesses?.length ?? 0;
  if (s.won) {
    return { tries: w + 1, status: "won" };
  }
  if (w > 0) return { tries: w, status: "in_progress" };
  return { tries: 0, status: "none" };
}

/**
 * Multi-line share blurb: 🔥 when won; ❌ when not won (including in-progress with attempts, or 0 tries).
 */
export function buildMergedleDailyShareText(dayKey: string): string {
  const lines: string[] = ["My #Mergedle results for today:"];

  for (const slug of DAILY_GAME_SLUGS) {
    const gameName = getGameMetaBySlug(slug)?.title ?? slug;
    const { tries, status } = modeShareOutcome(slug, dayKey);
    const w = tries === 1 ? "Try" : "Tries";

    if (status === "won") {
      lines.push(`${gameName}: ${tries} ${w} 🔥`);
    } else if (status === "in_progress") {
      lines.push(`${gameName}: ${tries} ${w} ❌`);
    } else {
      lines.push(`${gameName}: 0 Tries ❌`);
    }
  }

  lines.push("", SITE.url);
  return lines.join("\n");
}
