"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import confetti from "canvas-confetti";
import { getRulerByKey } from "@/lib/ruler-stats";
import { getValidSkinPool } from "@/lib/skin-cards";
import {
  markPlayedToday,
  setPersistedGameState,
  getPersistedGameState,
  seededIndex,
} from "@/lib/daily";
import type { SkinEntry } from "@/lib/skin-cards";
import NextModeLink from "@/components/NextModeLink";
import DailyResetTimer from "@/components/DailyResetTimer";
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
    <div className="flex items-center gap-3 rounded-xl border-2 border-red-400/80 bg-white/10 px-4 py-3 backdrop-blur-sm">
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
  const [search,       setSearch]       = useState("");
  const [dropdownOpen, setDropdown]     = useState(false);

  const searchInputRef   = useRef<HTMLInputElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);
  const winBoxRef        = useRef<HTMLElement | null>(null);
  const justWonRef       = useRef(false);

  // Seed the zoom quadrant from dayKey so all players see the same corner
  const quadrantOrigin = QUADRANT_ORIGINS[seededIndex(dayKey + "_skin_q", 4)];

  // Restore persisted state
  useEffect(() => {
    const saved = getPersistedGameState<PersistedState>("skin", dayKey);
    if (saved && saved.secretSkinName === secretEntry.skinName) {
      setWrongGuesses(saved.wrongGuesses ?? []);
      if (saved.won) setWon(true);
    }
  }, [dayKey, secretEntry.skinName]);

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
    const q = search.toLowerCase();
    return skinPool.filter(
      (s) => !alreadyGuessed.has(s.skinName) && s.skinName.toLowerCase().includes(q)
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
      justWonRef.current = true;
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

  return (
    <div className="space-y-6">

      {/* ── Zoomed skin image ── */}
      <section className="flex flex-col items-center gap-3">
        <div
          className="relative overflow-hidden rounded-xl shadow-2xl border-2 border-white/20"
          style={{ width: 320, height: 320 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={secretEntry.imagePath}
            alt={won ? secretEntry.skinName : "Mystery skin"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${scale})`,
              transformOrigin: won ? "center center" : quadrantOrigin,
              filter: won ? "grayscale(0%)" : "grayscale(100%)",
              transition: "transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 1.2s ease",
            }}
          />
        </div>
        {won && (
          <p className="text-white/70 text-sm italic">"{secretEntry.skinName}"</p>
        )}
      </section>

      {/* ── Win box ── */}
      {won && (
        <section
          ref={winBoxRef}
          className="animate-win-message mx-auto max-w-md rounded-xl border-2 border-green-500/60 bg-white/10 p-6 text-center backdrop-blur-sm"
        >
          <DailyResetTimer />
          <p className="mt-3 text-green-400 font-bold text-2xl mb-1">{secretEntry.skinName}!</p>
          <p className="text-white/50 text-sm">{rulerName}</p>
          <p className="text-white/60 text-sm mb-4">
            Solved in {wrongGuesses.length + 1} {wrongGuesses.length + 1 === 1 ? "guess" : "guesses"}
          </p>
          <NextModeLink currentSlug="skin" />
        </section>
      )}

      {/* ── Search input ── */}
      {!won && (
        <section ref={searchSectionRef} className="relative mx-auto max-w-md">
          <div className="relative">
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
          </div>

          {dropdownOpen && search.trim() && (
            <div
              ref={dropdownRef}
              className="card-search-dropdown absolute top-full left-0 right-0 z-50 mt-1 overflow-y-auto rounded-xl border-2 border-gray-300 bg-white py-1"
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
                        className="flex w-full items-center gap-3 bg-white px-4 py-3 text-left text-gray-900 transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      >
                        <img
                          src={s.imagePath}
                          alt={s.skinName}
                          className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                        />
                        <span className="flex-1 text-base font-medium">{s.skinName}</span>
                        <span className="text-sm text-gray-400">{getRulerByKey(s.rulerKey)?.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── Wrong guesses ── */}
      {wrongGuesses.length > 0 && (
        <section className="rounded-xl border-2 border-white/40 bg-white/10 p-4 backdrop-blur-sm">
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
    </div>
  );
}
