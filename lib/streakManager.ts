/**
 * Daily streak manager: multi-layer persistence (localStorage, IndexedDB, cookies)
 * so streak survives refresh and browser close. Uses UTC date (YYYY-MM-DD) to match
 * the rest of the app's daily puzzle logic.
 */

const STORAGE_KEY = "mergedle_streak";
const IDB_NAME = "mergedle_streak_db";
const IDB_STORE = "streak";
const IDB_VERSION = 1;
const COOKIE_NAME = "mergedle_streak";
const COOKIE_MAX_AGE_DAYS = 365;
const SIGNATURE_SALT = "mergedle_streak_v1";

export interface StreakRecord {
  streak: number;
  lastPlayed: string;
  completedDays: string[];
  wins: number;
  _ts?: number;
  _sig?: string;
}

function getUTCDateString(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h = h & h;
  }
  return Math.abs(h);
}

function signRecord(record: Omit<StreakRecord, "_sig">): string {
  const payload = [
    record.streak,
    record.lastPlayed,
    record.wins,
    [...record.completedDays].sort().join(","),
  ].join("|");
  return String(simpleHash(payload + SIGNATURE_SALT));
}

function validateSignature(record: StreakRecord): boolean {
  if (!record._sig) return false;
  const { _sig, _ts, ...rest } = record;
  void _sig; void _ts;
  const expected = signRecord(rest);
  return record._sig === expected;
}

/** Reject records with lastPlayed in the future (time tampering). */
function isValidDateProgression(record: StreakRecord): boolean {
  const today = getUTCDateString();
  return record.lastPlayed <= today;
}

function isValidRecord(r: unknown): r is StreakRecord {
  if (!r || typeof r !== "object") return false;
  const o = r as Record<string, unknown>;
  return (
    typeof o.streak === "number" &&
    typeof o.lastPlayed === "string" &&
    Array.isArray(o.completedDays) &&
    o.completedDays.every((d) => typeof d === "string") &&
    typeof o.wins === "number"
  );
}

function normalizeRecord(record: StreakRecord): StreakRecord {
  const completedDays = [...new Set(record.completedDays)].filter(Boolean).sort();
  return {
    streak: Math.max(0, Math.floor(record.streak)),
    lastPlayed: record.lastPlayed,
    completedDays,
    wins: Math.max(0, Math.floor(record.wins)),
    _ts: Date.now(),
    _sig: signRecord({ ...record, completedDays }),
  };
}

function createEmptyRecord(): StreakRecord {
  return normalizeRecord({
    streak: 0,
    lastPlayed: "",
    completedDays: [],
    wins: 0,
  });
}

// --- localStorage ---
function readLocalStorage(): StreakRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isValidRecord(parsed)) return null;
    const record = parsed as StreakRecord;
    if (!validateSignature(record) || !isValidDateProgression(record)) return null;
    return record;
  } catch {
    return null;
  }
}

function writeLocalStorage(record: StreakRecord): void {
  if (typeof window === "undefined") return;
  try {
    const normalized = normalizeRecord(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // quota or parse
  }
}

// --- IndexedDB ---
function openIDB(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !window.indexedDB) return Promise.resolve(null);
  return new Promise((resolve) => {
    const req = window.indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onerror = () => resolve(null);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: "id" });
      }
    };
  });
}

async function readIndexedDB(): Promise<StreakRecord | null> {
  const db = await openIDB();
  if (!db) return null;
  return new Promise((resolve) => {
    const tx = db.transaction(IDB_STORE, "readonly");
    const store = tx.objectStore(IDB_STORE);
    const req = store.get("main");
    req.onsuccess = () => {
      const row = req.result as { data: StreakRecord } | undefined;
      db.close();
      if (!row?.data) { resolve(null); return; }
      const record = row.data;
      if (!isValidRecord(record) || !validateSignature(record) || !isValidDateProgression(record)) {
        resolve(null); return;
      }
      resolve(record);
    };
    req.onerror = () => { db.close(); resolve(null); };
  });
}

async function writeIndexedDB(record: StreakRecord): Promise<void> {
  const db = await openIDB();
  if (!db) return;
  const normalized = normalizeRecord(record);
  return new Promise((resolve) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    const store = tx.objectStore(IDB_STORE);
    store.put({ id: "main", data: normalized, updatedAt: Date.now() });
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); resolve(); };
  });
}

// --- Cookies ---
function readCookie(): StreakRecord | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie.match(new RegExp("(?:^|;\\s*)" + COOKIE_NAME + "=([^;]*)"));
    const value = match ? decodeURIComponent(match[1]) : null;
    if (!value) return null;
    const parsed = JSON.parse(value) as unknown;
    if (!isValidRecord(parsed)) return null;
    const record = parsed as StreakRecord;
    if (!validateSignature(record) || !isValidDateProgression(record)) return null;
    return record;
  } catch {
    return null;
  }
}

function writeCookie(record: StreakRecord): void {
  if (typeof document === "undefined") return;
  try {
    const normalized = normalizeRecord(record);
    const value = encodeURIComponent(JSON.stringify(normalized));
    const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch {
    // ignore
  }
}

// --- Cache API ---
const CACHE_NAME = "mergedle_streak_v1";
const CACHE_KEY = "/.streak-data";

async function readCache(): Promise<StreakRecord | null> {
  if (typeof caches === "undefined") return null;
  try {
    const cache = await caches.open(CACHE_NAME);
    const res = await cache.match(CACHE_KEY);
    if (!res) return null;
    const parsed = (await res.json()) as unknown;
    if (!isValidRecord(parsed)) return null;
    const record = parsed as StreakRecord;
    if (!validateSignature(record) || !isValidDateProgression(record)) return null;
    return record;
  } catch {
    return null;
  }
}

async function writeCache(record: StreakRecord): Promise<void> {
  if (typeof caches === "undefined") return;
  try {
    const normalized = normalizeRecord(record);
    const cache = await caches.open(CACHE_NAME);
    await cache.put(
      CACHE_KEY,
      new Response(JSON.stringify(normalized), {
        headers: { "Content-Type": "application/json" },
      })
    );
  } catch {
    // ignore
  }
}

// --- Merge by lastPlayed ---
function mergeRecords(records: (StreakRecord | null)[]): StreakRecord {
  const valid = records.filter(
    (r): r is StreakRecord => r !== null && isValidRecord(r) && isValidDateProgression(r)
  );
  if (valid.length === 0) return createEmptyRecord();
  const best = valid.reduce((a, b) => (a.lastPlayed >= b.lastPlayed ? a : b));
  return normalizeRecord(best);
}

async function readAllLayers(): Promise<StreakRecord> {
  const fromLS = readLocalStorage();
  const fromIDB = await readIndexedDB();
  const fromCookie = readCookie();
  const fromCache = await readCache();
  const merged = mergeRecords([fromLS, fromIDB, fromCookie, fromCache]);
  if (!fromLS || fromLS.lastPlayed !== merged.lastPlayed) writeLocalStorage(merged);
  if (!fromCookie || fromCookie.lastPlayed !== merged.lastPlayed) writeCookie(merged);
  if (!fromIDB || fromIDB.lastPlayed !== merged.lastPlayed) await writeIndexedDB(merged);
  await writeCache(merged);
  return merged;
}

export async function getStreakData(): Promise<StreakRecord> {
  return readAllLayers();
}

export async function syncAllStorage(record: StreakRecord): Promise<void> {
  const normalized = normalizeRecord(record);
  writeLocalStorage(normalized);
  writeCookie(normalized);
  await writeIndexedDB(normalized);
  await writeCache(normalized);
}

export function requestPersistentStorage(): void {
  if (typeof navigator !== "undefined" && navigator.storage?.persist) {
    navigator.storage.persist().catch(() => {});
  }
}

export function isTodayCompleted(record: StreakRecord): boolean {
  const today = getUTCDateString();
  return record.completedDays.includes(today);
}

function isYesterday(lastPlayed: string, today: string): boolean {
  const a = new Date(lastPlayed + "T12:00:00Z").getTime();
  const b = new Date(today + "T12:00:00Z").getTime();
  return b - a === 86400000;
}

export async function markTodayCompleted(): Promise<StreakRecord> {
  const today = getUTCDateString();
  const current = await getStreakData();
  if (current.completedDays.includes(today)) return current;
  const completedDays = [...current.completedDays, today].filter(Boolean).sort();
  const next: StreakRecord = normalizeRecord({
    ...current,
    lastPlayed: today,
    completedDays,
    wins: current.wins + 1,
    streak:
      current.lastPlayed === ""
        ? 1
        : isYesterday(current.lastPlayed, today)
          ? current.streak + 1
          : 1,
  });
  await syncAllStorage(next);
  return next;
}

export async function updateStreakOnWin(): Promise<StreakRecord> {
  requestPersistentStorage();
  return markTodayCompleted();
}

export function getDisplayStreak(record: StreakRecord): number {
  return record.streak;
}

export function isTodayCompletedForUI(record: StreakRecord): boolean {
  return isTodayCompleted(record);
}
