"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { getRulerByKey } from "@/lib/ruler-stats";
import { getValidSkinPool, skinEntryMatchesSearch } from "@/lib/skin-cards";
import {
  markPlayedToday,
  setPersistedGameState,
  getPersistedGameState,
  seededIndex,
} from "@/lib/daily";
import type { SkinEntry } from "@/lib/skin-cards";
import NextModeLink from "@/components/NextModeLink";
import { RoyaledlyPromoBox } from "@/components/RoyaledlyPromoBox";
import DailyResetTimer from "@/components/DailyResetTimer";
import ClassicShareBox from "@/components/ClassicShareBox";
import { useFocusSearchOnTyping } from "@/lib/useFocusSearchOnTyping";
import { useDismissDropdownOnOutside } from "@/lib/useDismissDropdownOnOutside";
import { useSearchDropdownHighlight } from "@/lib/useSearchDropdownHighlight";

// ── Zoom config ───────────────────────────────────────────────────────────────
// Scale at each wrong-guess count: 0 wrong = 4×, 1 = 3×, 2 = 2×, 3 = 1.5×, 4+ = 1×
const ZOOM_LEVELS = [4,3.6, 3.2, 3, 2.8,2.6,2.4,2.2,2,1.7,1.5,1.2,1];

// 4 quadrant origins: top-left, top-right, bottom-left, bottom-right
const QUADRANT_ORIGINS = ["0% 0%", "100% 0%", "0% 100%", "100% 100%"];

interface Props {
  secretEntry: SkinEntry;
  dayKey: string;
  onSolved: () => void;
}

interface PersistedState {
  wrongGuesses: string[];
  won: boolean;
  secretSkinName: string;
  secretSkinImagePath: string;
}

// ── Wrong guess row ───────────────────────────────────────────────────────────
function WrongGuessRow({ skinName, rulerKey, imagePath }: { skinName: string; rulerKey?: string; imagePath?: string }) {
  const rulerName = rulerKey ? (getRulerByKey(rulerKey)?.name ?? rulerKey) : undefined;
  return (
    <div className="flex items-center gap-3 rounded-xl border-2 border-red-400/80 bg-white/10 px-4 py-3 backdrop-blur-sm font-game">
      {imagePath && (
        <img src={imagePath} alt={skinName} className="h-12 w-12 flex-shrink-0 rounded-lg object-cover" />
      )}
      <span className="flex-1 text-base font-medium text-white">{skinName}</span>
      {rulerName && <span className="text-sm text-white/50">{rulerName}</span>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SkinGame({ secretEntry, dayKey, onSolved }: Props) {
  const skinPool = useMemo(() => getValidSkinPool(), []);

  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [won,          setWon]          = useState(false);
  /** false = restored win / revisit: win panel above wrong guesses. true = fresh win this load: win below wrong guesses. */
  const [winPanelBelowGuesses, setWinPanelBelowGuesses] = useState(true);
  const [search,       setSearch]       = useState("");
  const [dropdownOpen, setDropdown]     = useState(false);

  const searchInputRef   = useRef<HTMLInputElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);
  const winPanelRef      = useRef<HTMLElement | null>(null);
  const scrollWinPanelIntoViewRef = useRef(false);
  // Seed the zoom quadrant from dayKey so all players see the same corner
  const quadrantOrigin = QUADRANT_ORIGINS[seededIndex(dayKey + "_skin_q", 4)];

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
    const saved = getPersistedGameState<PersistedState>("skin", dayKey);
    if (saved && saved.secretSkinName === secretEntry.skinName) {
      setWrongGuesses(saved.wrongGuesses ?? []);
      if (saved.won) setWon(true);
      setWinPanelBelowGuesses(!saved.won);
    }
  }, [dayKey, secretEntry.skinName]);

  useDismissDropdownOnOutside(searchSectionRef, () => setDropdown(false));

  useFocusSearchOnTyping(searchInputRef, {
    enabled: !won,
    commit: (next) => {
      setSearch(next);
      if (next.trim()) setDropdown(true);
    },
  });

  const alreadyGuessed = useMemo(() => new Set(wrongGuesses), [wrongGuesses]);
  const filteredSkins = useMemo(() => {
    if (!search.trim()) return [];
    return skinPool.filter(
      (s) => !alreadyGuessed.has(s.skinName) && skinEntryMatchesSearch(s, search)
    );
  }, [skinPool, search, alreadyGuessed]);

  const dropdownListCount =
    !won && dropdownOpen && search.trim() ? filteredSkins.length : 0;

  const { highlightIndex, dropdownRef, handleArrowKeys, optionPointerHandlers, onDropdownPointerLeave } =
    useSearchDropdownHighlight({
      enabled: !won,
      itemCount: dropdownListCount,
      resetKey: search,
    });

  // Current zoom scale
  const scale = won ? 1 : ZOOM_LEVELS[Math.min(wrongGuesses.length, ZOOM_LEVELS.length - 1)];

  function handleGuess(skinName: string) {
    if (alreadyGuessed.has(skinName)) return;
    setSearch("");
    setDropdown(false);

    if (skinName === secretEntry.skinName) {
      scrollWinPanelIntoViewRef.current = true;
      setWon(true);
      markPlayedToday("skin");
      setPersistedGameState("skin", dayKey, { wrongGuesses, won: true, secretSkinName: secretEntry.skinName, secretSkinImagePath: secretEntry.imagePath });
      onSolved();
      return;
    }

    const newWrong = [...wrongGuesses, skinName];
    setWrongGuesses(newWrong);
    setPersistedGameState("skin", dayKey, { wrongGuesses: newWrong, won: false, secretSkinName: secretEntry.skinName, secretSkinImagePath: secretEntry.imagePath });
  }

  const rulerName = getRulerByKey(secretEntry.rulerKey)?.name ?? secretEntry.rulerKey;

  function submitSkinFromSearch() {
    if (filteredSkins.length === 0) return;
    if (highlightIndex >= 0 && highlightIndex < filteredSkins.length) {
      handleGuess(filteredSkins[highlightIndex].skinName);
      return;
    }
    handleGuess(filteredSkins[0].skinName);
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
        <p className="mt-3 font-game text-2xl font-bold text-white">{secretEntry.skinName}!</p>
        <p className="mt-1 font-game text-sm text-white/60">{rulerName}</p>
        <div className="mt-4 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={secretEntry.imagePath}
            alt={secretEntry.skinName}
            width={168}
            height={168}
            className="rounded-xl border border-white/20 shadow-lg object-cover"
            style={{ width: 168, height: 168 }}
          />
        </div>
        <p className="mt-4 font-supercell text-sm text-white sm:text-base">
          Number of tries: {wrongGuesses.length + 1}
        </p>
        <ClassicShareBox dayKey={dayKey} className="mt-6" />
        <div className="mt-6">
          <DailyResetTimer />
        </div>
        <NextModeLink currentSlug="skin" />
        <div className="mt-4">
          <RoyaledlyPromoBox />
        </div>
      </section>
    ) : null;

  return (
    <div className="w-full space-y-6 max-md:pb-48">

      {/* ── Skin image (same layout pattern as Classic: image block, then search block) ── */}
      {!won && (
        <section className="flex flex-col items-center gap-3">
          <div
            className="relative overflow-hidden rounded-xl shadow-2xl border-2 border-white/20"
            style={{ width: 320, height: 320 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={secretEntry.imagePath}
              alt="Mystery skin"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${scale})`,
                transformOrigin: quadrantOrigin,
                filter: "grayscale(100%)",
                transition: "transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 1.2s ease",
              }}
            />
          </div>
        </section>
      )}

      {/* ── Search — matches ClassicGame markup/classes ── */}
      {!won && (
        <section ref={searchSectionRef} className="relative z-30 mx-auto w-full max-w-md px-4">
          <div className="relative w-full min-w-0">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search any skin name..."
              value={search}
              autoComplete="off"
              onChange={(e) => { setSearch(e.target.value); if (e.target.value.trim()) setDropdown(true); }}
              onFocus={() => { if (search.trim()) setDropdown(true); }}
              onKeyDown={(e) => {
                handleArrowKeys(e);
                if (e.key !== "Enter") return;
                e.preventDefault();
                submitSkinFromSearch();
              }}
              className="w-full rounded-xl border-2 border-gray-300 bg-white py-3 pl-4 pr-20 text-base text-gray-900 placeholder:text-sm placeholder:text-gray-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={submitSkinFromSearch}
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
                {filteredSkins.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-600">No skins match.</p>
                ) : (
                  <ul role="list">
                    {filteredSkins.map((s, optionIndex) => (
                      <li key={s.skinName} role="option">
                        <button
                          type="button"
                          data-search-option-index={optionIndex}
                          data-search-active={highlightIndex === optionIndex ? "true" : undefined}
                          {...optionPointerHandlers(optionIndex)}
                          onClick={() => handleGuess(s.skinName)}
                          className="card-search-option flex w-full min-w-0 items-center bg-white text-left text-base font-medium text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        >
                          <img
                            src={s.imagePath}
                            alt={s.skinName}
                            className="card-search-dropdown-thumb rounded-lg object-cover"
                          />
                          <span className="min-w-0 flex-1 truncate">{s.skinName}</span>
                          <span className="shrink-0 text-sm text-gray-500">{getRulerByKey(s.rulerKey)?.name}</span>
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

      {/* ── Wrong guesses ── */}
      {wrongGuesses.length > 0 && (
        <section className="relative z-0 rounded-xl border-2 border-white/40 bg-white/10 p-4 backdrop-blur-sm font-game">
          <h3 className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-white/90">
            Wrong guesses
          </h3>
          <div className="mx-auto max-w-md space-y-2">
            {[...wrongGuesses].reverse().map((skinName) => {
              const entry = skinPool.find((s) => s.skinName === skinName);
              return (
                <div key={skinName} className="animate-wrong-guess-in">
                  <WrongGuessRow skinName={skinName} rulerKey={entry?.rulerKey} imagePath={entry?.imagePath} />
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
