"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { getCardKeys, getCardDisplayName, cardImagePath, nameMatchesSearch } from "@/lib/card-stats";
import { getRulerKeys, getRulerByKey, pixelRulerCardImagePath } from "@/lib/ruler-stats";
import {
  getDailySecretFromPool,
  getDayKey,
  markPlayedToday,
  setPersistedGameState,
  getPersistedGameState,
} from "@/lib/daily";
import NextModeLink from "@/components/NextModeLink";
import { RoyaledlyPromoBox } from "@/components/RoyaledlyPromoBox";
import DailyResetTimer from "@/components/DailyResetTimer";
import ClassicShareBox from "@/components/ClassicShareBox";
import { useFocusSearchOnTyping } from "@/lib/useFocusSearchOnTyping";
import { useDismissDropdownOnOutside } from "@/lib/useDismissDropdownOnOutside";
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
      <div className="card-search-dropdown-thumb flex items-center justify-center rounded bg-white/10 text-white/40">?</div>
    );
  }
  return (
    <img
      src={imagePath}
      alt=""
      width={56}
      height={56}
      className="card-search-dropdown-thumb rounded object-contain"
      onError={() => setFailed(true)}
    />
  );
}

// ── Combined pool (cards + rulers) ───────────────────────────────────────────
interface PoolEntry { key: string; name: string; imagePath: string; }

// Rulers with shipped `/public/Cards/{Name}.webp` art (used for pixelation + search thumbnails).
const PIXEL_ENABLED_RULER_KEYS = new Set<string>([
  "spirit_empress",
  "goblin_queen",
  "elixir_loong",
  "battle_machine",
  "echo_sage",
  "dagger_duchess",
  "royale_king",
]);

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
      imagePath: pixelRulerCardImagePath(k),
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
  /** false = restored win / revisit: win panel above wrong guesses. true = fresh win this load: win below wrong guesses. */
  const [winPanelBelowGuesses, setWinPanelBelowGuesses] = useState(true);
  const [search,       setSearch]       = useState("");
  const [dropdownOpen, setDropdown]     = useState(false);

  const searchInputRef   = useRef<HTMLInputElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);
  const wrongGuessesRef  = useRef<string[]>([]);
  const winPanelRef      = useRef<HTMLElement | null>(null);
  const scrollWinPanelIntoViewRef = useRef(false);

  useEffect(() => {
    if (!won || !scrollWinPanelIntoViewRef.current) return;
    scrollWinPanelIntoViewRef.current = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        winPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
    return () => cancelAnimationFrame(id);
  }, [won]);

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
      const restoredWon = Boolean(saved.won && saved.secretKey === secretKey);
      setWon(restoredWon);
      setWinPanelBelowGuesses(!restoredWon);
    }
  }, [dayKey, secretKey, poolKeys]);

  useEffect(() => {
    wrongGuessesRef.current = wrongGuesses;
  }, [wrongGuesses]);

  useDismissDropdownOnOutside(searchSectionRef, () => setDropdown(false));

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
      scrollWinPanelIntoViewRef.current = true;
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

  const winPanelSection =
    won ? (
      <section
        ref={winPanelRef}
        className="animate-win-message mx-auto max-w-md rounded-xl border-2 border-green-500/60 bg-white/10 p-6 text-center backdrop-blur-sm"
      >
        <p className="font-supercell text-lg font-bold tracking-wide text-green-400 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)] sm:text-xl">
          You guessed correctly!
        </p>
        <p className="mt-3 font-game text-2xl font-bold text-white">
          {secretEntry.name}!
        </p>
        <div className="mt-2 flex justify-center">
          <img
            src={src}
            alt={secretEntry.name}
            width={DISPLAY_WIDTH}
            height={DISPLAY_HEIGHT}
            className="rounded-xl border border-white/20 shadow-lg"
            style={{ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT, objectFit: "contain" }}
          />
        </div>
        <p className="mt-4 font-supercell text-sm text-white sm:text-base">
          Number of tries: {wrongGuesses.length + 1}
        </p>
        <ClassicShareBox dayKey={dayKey} className="mt-6" />
        <div className="mt-6">
          <DailyResetTimer />
        </div>
        <NextModeLink currentSlug="pixel" />
        <div className="mt-4">
          <RoyaledlyPromoBox />
        </div>
      </section>
    ) : null;

  return (
    <div className="w-full space-y-6 max-md:pb-48">

      {/* ── Pixelated image (same layout pattern as Classic: image block, then search block) ── */}
      {!won && (
        <section className="flex justify-center">
          <PixelatedCard src={src} pixelWidth={pixelWidth} pixelHeight={pixelHeight} />
        </section>
      )}

      {/* ── Search — matches ClassicGame markup/classes ── */}
      {!won && (
        <section ref={searchSectionRef} className="relative z-30 mx-auto w-full max-w-md px-4">
          <div className="relative w-full min-w-0">
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

            {dropdownOpen && search.trim() && (
              <div
                ref={dropdownRef}
                className="card-search-dropdown absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border-2 border-gray-300 bg-white py-1"
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
                          className="card-search-option flex w-full items-center bg-white text-left text-base font-medium text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
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
          </div>
        </section>
      )}

      {!winPanelBelowGuesses && winPanelSection}

      {/* ── Wrong guesses list ── */}
      {wrongGuesses.length > 0 && (
        <section className="relative z-0 rounded-xl border-2 border-white/40 bg-white/10 p-4 backdrop-blur-sm font-game">
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

      {winPanelBelowGuesses && winPanelSection}
    </div>
  );
}
