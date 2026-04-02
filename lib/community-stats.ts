/**
 * Shared TypeScript interfaces for community stats.
 * Used by both client-side fetch wrappers and server-side API routes.
 */

export interface PostPlayPayload {
  gameSlug: string;
  dayKey: string;           // "YYYY-MM-DD" UTC
  cardKey: string;          // the secret card for that day (written to daily_secrets)
  guessCount: number;
  won: boolean;
  wrongGuessKeys: string[]; // card keys guessed wrong, in submission order
}

export interface CommunityStatsResponse {
  playerCount: number;
  topWrongGuesses: Array<{ cardKey: string; count: number }>;
  yesterdayCardKey: string | null;
  bestScore: number | null;
}

export interface PostPlayResponse {
  ok: boolean;
  playerCount: number;
}

export const DAILY_GAME_SLUGS = ["classic", "pixel", "skin", "description"] as const;
export type DailyGameSlug = (typeof DAILY_GAME_SLUGS)[number];
