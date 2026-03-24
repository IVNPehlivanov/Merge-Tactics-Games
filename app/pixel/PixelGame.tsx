"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { getCardKeys, getCardDisplayName, cardImagePath, nameMatchesSearch } from "@/lib/card-stats";
import { getRulerKeys, getRulerByKey, defaultRulerImagePath } from "@/lib/ruler-stats";
import {
  getDailySecretFromPool,
  getDayKey,
  markPlayedToday,
  setPersistedGameState,
  getPersistedGameState,
} from "@/lib/daily";
import NextModeLink from "@/components/NextModeLink";
import DailyResetTimer from "@/components/DailyResetTimer";
import { useFocusSearchOnTyping } from "@/lib/useFocusSearchOnTyping";
import { useSearchDropdownHighlight } from "@/lib/useSearchDropdownHighlight";

// ── Canvas pixel config (copied from wrdle) ──────────────────────────────────
const DISPLAY_WIDTH  = 200;
const DISPLAY_HEIGHT = 260;

/** Pixelation grid: (wrongCount + 2) × (wrongCount + 3), starts at 2×3 */
function getPixelGrid(wrongCount: number): [number, number] {
  return [wrongCount + 2, wrongCount + 3];
}

/** Crop insets so we sample inner art only, avoiding card frame edges */
const CROP_INSET_X      = 0.15;
const CROP_INSET_TOP    = 0.25;
const CROP_INSET_BOTTOM = 0.25;

// ── PixelatedCard ─────────────────────────────────────────────────────────────
function PixelatedCard({ src, pixelWidth, pixelHeight }: { src: string; pixelWidth: number; pixelHeight: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !src) return;

    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = Math.max(2, pixelWidth);
      const h = Math.max(2, pixelHeight);

      const sx = img.width  * CROP_INSET_X;
      const sy = img.height * CROP_INSET_TOP;
      const sw = img.width  * (1 - 2 * CROP_INSET_X);
      const sh = img.height * (1 - CROP_INSET_TOP - CROP_INSET_BOTTOM);

      const offscreen = document.createElement("canvas");
      offscreen.width  = w;
      offscreen.height = h;
      const off = offscreen.getContext("2d");
      if (!off) return;

      off.imageSmoothingEnabled = false;
      off.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);

      const data    = off.getImageData(0, 0, w, h);
      const blockW  = DISPLAY_WIDTH  / w;
      const blockH  = DISPLAY_HEIGHT / h;

      canvas.width  = DISPLAY_WIDTH;
      canvas.height = DISPLAY_HEIGHT;
      for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
          const idx = (py * w + px) * 4;
          const r = data.data[idx];
          const g = data.data[idx + 1];
          const b = data.data[idx + 2];
          const a = data.data[idx + 3];
          const x  = Math.floor(px * blockW);
          const y  = Math.floor(py * blockH);
          const bw = px === w - 1 ? DISPLAY_WIDTH  - x : Math.ceil(blockW);
          const bh = py === h - 1 ? DISPLAY_HEIGHT - y : Math.ceil(blockH);
          ctx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
          ctx.fillRect(x, y, bw, bh);
        }
      }
    };
    img.src = src;
  }, [src, pixelWidth, pixelHeight]);

  return (
    <canvas
      ref={canvasRef}
      width={DISPLAY_WIDTH}
      height={DISPLAY_HEIGHT}
      className="rounded-lg shadow-lg"
    />
  );
}

// ── EntryThumbnail ────────────────────────────────────────────────────────────
function EntryThumbnail({ imagePath }: { imagePath: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded bg-white/10 text-white/40">?</div>
    );
  }
  return (
    <img
      src={imagePath}
      alt=""
      width={56}
      height={56}
      className="h-14 w-14 flex-shrink-0 rounded object-contain"
      onError={() => setFailed(true)}
    />
  );
}

// ── Combined pool (cards + rulers) ───────────────────────────────────────────
interface PoolEntry { key: string; name: string; imagePath: string; }

// Keep ruler entries limited to keys that have shipped image assets.
const PIXEL_ENABLED_RULER_KEYS = new Set<string>(["royale_king"]);

function buildPool(): PoolEntry[] {
  const cards = getCardKeys().map((k) => ({
    key: k,
    name: getCardDisplayName(k),
    imagePath: cardImagePath(k),
  }));
  const rulers = getRulerKeys()
    .filter((k) => PIXEL_ENABLED_RULER_KEYS.has(k))
    .map((k) => ({
      key: `ruler__${k}`,
      name: getRulerByKey(k)?.name ?? k,
      imagePath: defaultRulerImagePath(k),
    }));
  return [...cards, ...rulers];
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Props { dayKey: string; onSolved: () => void; }
interface PersistedState { wrongGuesses: string[]; won: boolean; secretKey: string; }

function pickBestPersistedState(
  primary: PersistedState | null,
  fallback: PersistedState | null
): PersistedState | null {
  if (!primary) return fallback;
  if (!fallback) return primary;
  return (fallback.wrongGuesses?.length ?? 0) > (primary.wrongGuesses?.length ?? 0) ? fallback : primary;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PixelGame({ dayKey, onSolved }: Props) {
  const pool      = useMemo(() => buildPool(), []);
  const poolKeys  = useMemo(() => pool.map((e) => e.key), [pool]);
  const secretKey = useMemo(() => getDailySecretFromPool(poolKeys, "pixel", dayKey), [poolKeys, dayKey]);
  const secretEntry = useMemo(() => pool.find((e) => e.key === secretKey)!, [pool, secretKey]);

  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [won,          setWon]          = useState(false);
  const [search,       setSearch]       = useState("");
  const [dropdownOpen, setDropdown]     = useState(false);

  const searchInputRef   = useRef<HTMLInputElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);
  const winBoxRef        = useRef<HTMLElement | null>(null);
  const justWonRef       = useRef(false);
  const wrongGuessesRef  = useRef<string[]>([]);

  // Restore persisted state
  useEffect(() => {
    const liveDayKey = getDayKey();
    const savedPrimary = getPersistedGameState<PersistedState>("pixel", dayKey);
    const savedFallback = liveDayKey === dayKey
      ? null
      : getPersistedGameState<PersistedState>("pixel", liveDayKey);
    const saved = pickBestPersistedState(savedPrimary, savedFallback);
    if (saved) {
      const restoredWrong = Array.isArray(saved.wrongGuesses)
        ? saved.wrongGuesses.filter((k) => poolKeys.includes(k))
        : [];
      setWrongGuesses(restoredWrong);
      setWon(Boolean(saved.won && saved.secretKey === secretKey));
    }
  }, [dayKey, secretKey, poolKeys]);

  useEffect(() => {
    wrongGuessesRef.current = wrongGuesses;
  }, [wrongGuesses]);

  // Confetti on win
  useEffect(() => {
    if (!won || !justWonRef.current || !winBoxRef.current) return;
    const el = winBoxRef.current;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = (rect.left + rect.width  / 2) / window.innerWidth;
        const y = (rect.top  + rect.height / 2) / window.innerHeight;
        const opts = { particleCount: 120, origin: { x, y }, spread: 100, startVelocity: 65, scalar: 1.8 };
        confetti({ ...opts, angle: 60 });
        confetti({ ...opts, angle: 120 });
        justWonRef.current = false;
      });
    });
  }, [won]);

  // Close dropdown on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent | TouchEvent) {
      if (searchSectionRef.current?.contains(e.target as Node)) return;
      setDropdown(false);
    }
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("touchstart", onOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("touchstart", onOutside);
    };
  }, []);

  useFocusSearchOnTyping(searchInputRef, {
    enabled: !won,
    commit: (next) => {
      setSearch(next);
      if (next.trim()) setDropdown(true);
    },
  });

  const alreadyGuessed  = useMemo(() => new Set(wrongGuesses), [wrongGuesses]);
  const filteredEntries = useMemo(() => {
    if (!search.trim()) return [];
    return pool.filter(
      (e) => !alreadyGuessed.has(e.key) && nameMatchesSearch(e.name, search)
    );
  }, [pool, search, alreadyGuessed]);

  const dropdownListCount =
    !won && dropdownOpen && search.trim() ? filteredEntries.length : 0;

  const { highlightIndex, dropdownRef, handleArrowKeys, optionPointerHandlers, onDropdownPointerLeave } =
    useSearchDropdownHighlight({
      enabled: !won,
      itemCount: dropdownListCount,
      resetKey: search,
    });

  const [pixelWidth, pixelHeight] = getPixelGrid(wrongGuesses.length);
  const src = secretEntry.imagePath;

  function handleGuess(key: string) {
    if (alreadyGuessed.has(key)) return;
    setSearch("");
    setDropdown(false);

    if (key === secretKey) {
      justWonRef.current = true;
      setWon(true);
      markPlayedToday("pixel");
      const solvedState = { wrongGuesses: wrongGuessesRef.current, won: true, secretKey };
      setPersistedGameState("pixel", dayKey, solvedState);
      const liveDayKey = getDayKey();
      if (liveDayKey !== dayKey) {
        setPersistedGameState("pixel", liveDayKey, solvedState);
      }
      onSolved();
      return;
    }

    const newWrong = [...wrongGuessesRef.current, key];
    wrongGuessesRef.current = newWrong;
    const inProgressState = { wrongGuesses: newWrong, won: false, secretKey };
    setPersistedGameState("pixel", dayKey, inProgressState);
    const liveDayKey = getDayKey();
    if (liveDayKey !== dayKey) {
      setPersistedGameState("pixel", liveDayKey, inProgressState);
    }
    setWrongGuesses(newWrong);
  }

  function submitFromSearch() {
    if (filteredEntries.length === 0) return;
    if (highlightIndex >= 0 && highlightIndex < filteredEntries.length) {
      handleGuess(filteredEntries[highlightIndex].key);
      return;
    }
    const q = search.trim().toLowerCase();
    const exact = filteredEntries.find((e) => e.name.toLowerCase() === q);
    handleGuess(exact ? exact.key : filteredEntries[0].key);
  }

  return (
    <div className="space-y-6">

      {/* ── Pixelated / revealed image ── */}
      <section className="flex justify-center">
        {won ? (
          <img
            src={src}
            alt={secretEntry.name}
            width={DISPLAY_WIDTH}
            height={DISPLAY_HEIGHT}
            className="rounded-lg shadow-lg"
            style={{ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT, objectFit: "contain" }}
          />
        ) : (
          <PixelatedCard src={src} pixelWidth={pixelWidth} pixelHeight={pixelHeight} />
        )}
      </section>

      {/* ── Win box ── */}
      {won && (
        <section
          ref={winBoxRef}
          className="animate-win-message mx-auto max-w-md rounded-xl border-2 border-green-500/60 bg-white/10 p-6 text-center backdrop-blur-sm"
        >
          <DailyResetTimer />
          <p className="mt-3 text-green-400 font-bold text-2xl mb-1">
            {secretEntry.name}!
          </p>
          <p className="text-white/60 text-sm mb-4">
            Solved in {wrongGuesses.length + 1} {wrongGuesses.length + 1 === 1 ? "guess" : "guesses"}
          </p>
          <NextModeLink currentSlug="pixel" />
        </section>
      )}

      {/* ── Search input ── */}
      {!won && (
        <section ref={searchSectionRef} className="relative mx-auto max-w-md">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search any card..."
              value={search}
              autoComplete="off"
              onChange={(e) => { setSearch(e.target.value); if (e.target.value.trim()) setDropdown(true); }}
              onFocus={() => { if (search.trim()) setDropdown(true); }}
              onKeyDown={(e) => {
                handleArrowKeys(e);
                if (e.key !== "Enter") return;
                e.preventDefault();
                submitFromSearch();
              }}
              className="w-full rounded-xl border-2 border-gray-300 bg-white py-3 pl-4 pr-20 text-base text-gray-900 placeholder:text-sm placeholder:text-gray-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={submitFromSearch}
              className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Submit guess"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            {search.trim() && (
              <button
                type="button"
                onClick={() => { setSearch(""); setDropdown(false); searchInputRef.current?.focus(); }}
                className="absolute right-12 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>

          {dropdownOpen && search.trim() && (
            <div
              ref={dropdownRef}
              className="card-search-dropdown absolute top-full left-0 right-0 z-50 mt-1 overflow-y-auto rounded-xl border-2 border-gray-300 bg-white py-1"
              role="listbox"
              data-keyboard-nav={highlightIndex >= 0 ? "true" : undefined}
              onPointerLeave={onDropdownPointerLeave}
            >
              {filteredEntries.length === 0 ? (
                <p className="px-4 py-3 text-sm text-gray-600">No cards match.</p>
              ) : (
                <ul role="list">
                  {filteredEntries.map((entry, optionIndex) => (
                    <li key={entry.key} role="option">
                      <button
                        type="button"
                        data-search-option-index={optionIndex}
                        data-search-active={highlightIndex === optionIndex ? "true" : undefined}
                        {...optionPointerHandlers(optionIndex)}
                        onClick={() => handleGuess(entry.key)}
                        className="flex w-full items-center gap-4 bg-white px-4 py-3 text-left text-gray-900 transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      >
                        <EntryThumbnail imagePath={entry.imagePath} />
                        <span className="text-base font-medium">{entry.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── Wrong guesses list ── */}
      {wrongGuesses.length > 0 && (
        <section className="rounded-xl border-2 border-white/40 bg-white/10 p-4 backdrop-blur-sm">
          <h3 className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-white/90">
            Wrong guesses
          </h3>
          <div className="mx-auto max-w-md space-y-2">
            {[...wrongGuesses].reverse().map((key) => {
              const entry = pool.find((e) => e.key === key);
              return (
                <div
                  key={key}
                  className="animate-wrong-guess-in flex w-full items-center gap-3 rounded-xl border-2 border-red-400/80 bg-white/10 px-4 py-3 backdrop-blur-sm"
                >
                  {entry && <EntryThumbnail imagePath={entry.imagePath} />}
                  <span className="text-base font-medium text-white">{entry?.name ?? key}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
