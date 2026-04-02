/**
 * Client-side wrappers for community stats API.
 * All errors are caught and return null — stats are non-critical and must never break the game.
 */

import { getUTCDateString } from "@/lib/daily";
import type {
  PostPlayPayload,
  PostPlayResponse,
  CommunityStatsResponse,
} from "@/lib/community-stats";

export type { PostPlayPayload, PostPlayResponse, CommunityStatsResponse };

/**
 * Record a completed game play to the community stats backend.
 * Fire-and-forget safe — caller does not need to await.
 */
export async function recordPlay(
  payload: PostPlayPayload
): Promise<PostPlayResponse | null> {
  try {
    const res = await fetch("/api/community-stats/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return res.json() as Promise<PostPlayResponse>;
  } catch {
    return null;
  }
}

/**
 * Fetch display stats for a game mode (player count, top wrong guesses, yesterday's card).
 * Returns null on any failure.
 */
export async function fetchCommunityStats(
  gameSlug: string,
  dayKey?: string
): Promise<CommunityStatsResponse | null> {
  try {
    const day = dayKey ?? getUTCDateString();
    const res = await fetch(`/api/community-stats/${gameSlug}?day=${day}`);
    if (!res.ok) return null;
    return res.json() as Promise<CommunityStatsResponse>;
  } catch {
    return null;
  }
}
