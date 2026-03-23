"use client";

export type DailyGameSlug = "classic" | "pixel" | "skin";
export const DAILY_GAME_SLUGS: DailyGameSlug[] = ["classic", "pixel", "skin"];
export const DAILY_PROGRESS_UPDATE_EVENT = "mergedle-daily-progress-update";

export function getUTCDateString(date?: Date): string {
  const d = date ?? new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const DEV_DAY_KEY = "mergedle_dev_day_key";

export function getDayKey(): string {
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    const override = localStorage.getItem(DEV_DAY_KEY);
    if (override) return override;
  }
  return getUTCDateString();
}

export function setDevDayKey(key: string | null): void {
  if (key === null) localStorage.removeItem(DEV_DAY_KEY);
  else localStorage.setItem(DEV_DAY_KEY, key);
}

export function getNextMidnightUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function seededIndex(seed: string, max: number): number {
  return simpleHash(seed) % max;
}

export function getDailySecretFromPool<T>(pool: T[], gameSlug: string, dayKey: string): T {
  const seed = `${dayKey}_${gameSlug}`;
  return pool[seededIndex(seed, pool.length)];
}

const PLAYED_KEY = "mergedle_daily_played";

export function hasPlayedToday(gameSlug: string): boolean {
  return hasPlayedOnDay(gameSlug, getDayKey());
}

export function hasPlayedOnDay(gameSlug: string, dayKey: string): boolean {
  try {
    const raw = localStorage.getItem(PLAYED_KEY);
    const data: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    return (data[dayKey] ?? []).includes(gameSlug);
  } catch { return false; }
}

export function markPlayedToday(gameSlug: string): void {
  try {
    const raw = localStorage.getItem(PLAYED_KEY);
    const data: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    const today = getDayKey();
    if (!data[today]) data[today] = [];
    if (!data[today].includes(gameSlug)) data[today].push(gameSlug);
    localStorage.setItem(PLAYED_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event(DAILY_PROGRESS_UPDATE_EVENT));
  } catch { /* ignore */ }
}

function stateKey(slug: string, dayKey: string) {
  return `mergedle_daily_state_${slug}_${dayKey}`;
}

export function getPersistedGameState<T>(slug: string, dayKey: string): T | null {
  try {
    const raw = localStorage.getItem(stateKey(slug, dayKey));
    return raw ? (JSON.parse(raw) as T) : null;
  } catch { return null; }
}

export function setPersistedGameState(slug: string, dayKey: string, state: unknown): void {
  try {
    localStorage.setItem(stateKey(slug, dayKey), JSON.stringify(state));
  } catch { /* ignore */ }
}

export function clearPersistedGameState(slug: string, dayKey: string): void {
  localStorage.removeItem(stateKey(slug, dayKey));
}
