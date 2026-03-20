"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import confetti from "canvas-confetti";
import {
  CARD_STATS,
  getCardKeys,
  getCardDisplayName,
  cardMatchesSearch,
  findExactMatchKey,
  cardImagePath,
  RARITY_ORDER,
  type CardRarity,
} from "@/lib/card-stats";
import {
  getDailySecretFromPool,
  markPlayedToday,
  setPersistedGameState,
  getPersistedGameState,
} from "@/lib/daily";
import type { ClassicGuess, ClassicGuessAttributes, AttributeResult } from "@/types/game";
import NextModeLink from "@/components/NextModeLink";
import DailyResetTimer from "@/components/DailyResetTimer";

interface Props {
  dayKey: string;
  onSolved: () => void;
}

interface PersistedState {
  guesses: ClassicGuess[];
  won: boolean;
  secretKey: string;
}

// -- Comparison helpers --

function compareOrdered(guessVal: number, secretVal: number): AttributeResult["result"] {
  if (guessVal === secretVal) return "correct";
  return secretVal > guessVal ? "higher" : "lower";
}

function buildGuessAttributes(guessKey: string, secretKey: string): ClassicGuessAttributes {
  const g = CARD_STATS[guessKey];
  const s = CARD_STATS[secretKey];

  const gi = RARITY_ORDER.indexOf(g.rarity as CardRarity);
  const si = RARITY_ORDER.indexOf(s.rarity as CardRarity);

  const parseYear = (d: string) => {
    const y = parseInt(d.slice(0, 4), 10);
    return Number.isFinite(y) ? y : new Date(d).getUTCFullYear();
  };
  const gy = parseYear(g.releaseDate);
  const sy = parseYear(s.releaseDate);

  return {
    rarity:         { value: g.rarity,        result: compareOrdered(gi, si) },
    elixirCost:     { value: g.elixirCost,     result: compareOrdered(g.elixirCost, s.elixirCost) },
    primaryTrait:   { value: g.primaryTrait,   result: g.primaryTrait   === s.primaryTrait   ? "correct" : "wrong" },
    secondaryTrait: { value: g.secondaryTrait, result: g.secondaryTrait === s.secondaryTrait ? "correct" : "wrong" },
    cardType:       { value: g.cardType,       result: g.cardType       === s.cardType       ? "correct" : "wrong" },
    releaseYear:    { value: gy,               result: compareOrdered(gy, sy) },
  };
}

// -- Sub-components --

function CardThumbnail({ cardKey, size = "sm" }: { cardKey: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const [failed, setFailed] = useState(false);
  const src = cardImagePath(cardKey);
  const dim = size === "xl" ? "h-24 w-24" : size === "lg" ? "h-16 w-16" : size === "md" ? "h-14 w-14" : "h-10 w-10";
  const px  = size === "xl" ? 96 : size === "lg" ? 64 : size === "md" ? 56 : 40;
  if (failed) {
    return (
      <div
        className={`flex flex-shrink-0 items-center justify-center rounded bg-white/10 text-white/40 text-lg ${dim}`}
        style={{ minWidth: px, minHeight: px }}
        aria-hidden
      >?</div>
    );
  }
  return (
    <img
      src={src}
      alt=""
      width={px}
      height={px}
      className={`${dim} flex-shrink-0 rounded object-contain`}
      onError={() => setFailed(true)}
    />
  );
}

function AttributeCell({ value, result }: { value: string | number | boolean; result: AttributeResult["result"] }) {
  const isCorrect = result === "correct";
  const isHigher  = result === "higher";
  const isLower   = result === "lower";
  const bg = isCorrect ? "bg-green-600" : "bg-red-600";
  const displayValue = typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
  const showBigArrow = !isCorrect && (isHigher || isLower);

  return (
    <div
      className={`relative flex h-[5rem] w-full min-w-0 flex-wrap items-center justify-center overflow-hidden rounded-sm px-1 py-1.5 text-center text-xs font-sans font-bold leading-tight text-white sm:px-1.5 sm:py-2 sm:text-sm ${bg}`}
    >
      {showBigArrow ? (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <span className="relative inline-block">
            <span className="inline-block text-[5.5rem] font-bold leading-none text-black opacity-40 sm:text-[6rem] [transform:translateX(0.04em)]">
              {isHigher ? "↑" : "↓"}
            </span>
            <span className="absolute inset-0 flex items-center justify-center leading-none text-white drop-shadow-md [transform:translate(0.04em,0.12em)]">
              {displayValue}
            </span>
          </span>
        </span>
      ) : (
        <span className="relative z-10 min-w-0 break-words text-center drop-shadow-sm whitespace-nowrap">
          {displayValue}
        </span>
      )}
    </div>
  );
}

// -- Column config --

const ATTR_LABELS = ["Rarity", "Elixir", "Trait 1", "Trait 2", "Type", "Year"] as const;
const ATTR_KEYS: (keyof ClassicGuessAttributes)[] = [
  "rarity", "elixirCost", "primaryTrait", "secondaryTrait", "cardType", "releaseYear",
];

const CELL_DELAY_MS = 200;
const WIN_DELAY_MS  = ATTR_KEYS.length * CELL_DELAY_MS + 500; // 1700ms

// -- Main component --

export default function ClassicGame({ dayKey, onSolved }: Props) {
  const cardKeys  = useMemo(() => getCardKeys(), []);
  const secretKey = useMemo(() => getDailySecretFromPool(cardKeys, "classic", dayKey), [cardKeys, dayKey]);

  const [guesses, setGuesses]       = useState<ClassicGuess[]>([]);
  const [won, setWon]               = useState(false);
  const [showWinMsg, setShowWinMsg] = useState(false);
  const [search, setSearch]         = useState("");
  const [dropdownOpen, setDropdown] = useState(false);

  const guessesRef       = useRef<ClassicGuess[]>([]);
  const justWonRef       = useRef(false);
  const searchInputRef   = useRef<HTMLInputElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);
  const winBoxRef        = useRef<HTMLElement | null>(null);

  // Restore persisted state
  useEffect(() => {
    const saved = getPersistedGameState<PersistedState>("classic", dayKey);
    if (saved && saved.secretKey === secretKey) {
      setGuesses(saved.guesses);
      guessesRef.current = saved.guesses;
      if (saved.won) {
        setWon(true);
        setShowWinMsg(true);
      }
    }
  }, [dayKey, secretKey]);

  // Show win message after animations finish
  useEffect(() => {
    if (!won || !justWonRef.current) return;
    const t = setTimeout(() => {
      setShowWinMsg(true);
      justWonRef.current = false;
    }, WIN_DELAY_MS);
    return () => clearTimeout(t);
  }, [won]);

  // Fire confetti from the win box
  useEffect(() => {
    if (!won || !showWinMsg || !winBoxRef.current) return;
    const el = winBoxRef.current;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = (rect.left + rect.width  / 2) / window.innerWidth;
        const y = (rect.top  + rect.height / 2) / window.innerHeight;
        const opts = {
          particleCount: 120,
          origin: { x, y },
          spread: 100,
          startVelocity: 65,
          scalar: 1.8,
          colors: ["#818cf8", "#34d399", "#60a5fa", "#f59e0b"],
        };
        confetti({ ...opts, angle: 60 });
        confetti({ ...opts, angle: 120 });
      });
    });
    return () => cancelAnimationFrame(id);
  }, [won, showWinMsg]);

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

  const filteredKeys   = useMemo(() => {
    if (!search.trim()) return [];
    return cardKeys.filter((k) => cardMatchesSearch(k, search));
  }, [cardKeys, search]);

  const alreadyGuessed = useMemo(() => new Set(guesses.map((g) => g.cardKey)), [guesses]);

  function handleGuess(key: string) {
    if (alreadyGuessed.has(key)) return;

    const attributes = buildGuessAttributes(key, secretKey);
    const newGuess: ClassicGuess = { cardKey: key, cardName: getCardDisplayName(key), attributes };
    const newGuesses = [newGuess, ...guessesRef.current];
    guessesRef.current = newGuesses;

    setGuesses(newGuesses);
    setSearch("");
    setDropdown(false);

    const isWon = key === secretKey;
    setPersistedGameState("classic", dayKey, { guesses: newGuesses, won: isWon, secretKey });

    if (isWon) {
      justWonRef.current = true;
      setWon(true);
      markPlayedToday("classic");
      onSolved();
    }
  }

  function submitFromSearch() {
    const available = filteredKeys.filter((k) => !alreadyGuessed.has(k));
    if (available.length === 0) return;
    const exact = findExactMatchKey(search);
    handleGuess((exact && available.includes(exact)) ? exact : available[0]);
  }

  return (
    <div className="space-y-6">

      {/* ── Search input ── */}
      {!won && (
        <section ref={searchSectionRef} className="relative mx-auto max-w-md">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search any tactician..."
              value={search}
              autoComplete="off"
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value.trim()) setDropdown(true);
              }}
              onFocus={() => { if (search.trim()) setDropdown(true); }}
              onKeyDown={(e) => {
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
              className="card-search-dropdown absolute top-full left-0 right-0 z-50 mt-1 overflow-y-auto rounded-xl border-2 border-gray-300 bg-white py-1"
              role="listbox"
            >
              {filteredKeys.filter((k) => !alreadyGuessed.has(k)).length === 0 ? (
                <p className="px-4 py-3 text-sm text-gray-600">No tacticians match.</p>
              ) : (
                <ul role="list">
                  {filteredKeys
                    .filter((k) => !alreadyGuessed.has(k))
                    .map((key) => (
                      <li key={key} role="option">
                        <button
                          type="button"
                          onClick={() => { handleGuess(key); }}
                          className="flex w-full items-center gap-4 bg-white px-4 py-3 text-left text-gray-900 transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        >
                          <CardThumbnail cardKey={key} size="md" />
                          <span className="text-base font-medium">{getCardDisplayName(key)}</span>
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── Guess table ── */}
      {guesses.length > 0 && (
        <section className="rounded-xl border-2 border-white/40 bg-white/10 p-3 backdrop-blur-sm">
          <h3 className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-white/90">
            Your guesses
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[824px] table-fixed border-collapse">
              <colgroup>
                <col style={{ width: "104px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "100px" }} />
              </colgroup>
              <thead>
                <tr className="border-b border-white/20">
                  <th className="px-1 py-3 text-center text-sm font-semibold text-white sm:px-2 sm:py-4 sm:text-base">Card</th>
                  {ATTR_LABELS.map((label) => (
                    <th
                      key={label}
                      className="min-w-0 break-words px-1 py-3 text-center text-sm font-semibold leading-tight text-white sm:px-2 sm:py-4 sm:text-base"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guesses.map((g, rowIndex) => {
                  const isNewRow = rowIndex === 0;
                  return (
                    <tr key={g.cardKey} className="border-b border-white/10">
                      <td className="px-2 py-4 align-top">
                        <div
                          className={`flex flex-col items-center gap-1 ${isNewRow ? "animate-attribute-reveal" : ""}`}
                          style={isNewRow ? { animationDelay: "0ms", animationFillMode: "both" } : undefined}
                        >
                          <div className="-mt-3 h-24 w-24">
                            <CardThumbnail cardKey={g.cardKey} size="xl" />
                          </div>
                        </div>
                      </td>
                      {ATTR_KEYS.map((key, colIndex) => (
                        <td key={key} className="min-w-0 px-2 py-4 align-top">
                          <div
                            className={isNewRow ? "animate-attribute-reveal" : ""}
                            style={
                              isNewRow
                                ? { animationDelay: `${(colIndex + 1) * CELL_DELAY_MS}ms`, animationFillMode: "both" }
                                : undefined
                            }
                          >
                            <AttributeCell
                              value={g.attributes[key].value}
                              result={g.attributes[key].result}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Win message ── */}
      {won && showWinMsg && (
        <section
          ref={winBoxRef}
          className="animate-win-message mx-auto max-w-md rounded-xl border-2 border-green-500/60 bg-white/10 p-6 text-center backdrop-blur-sm"
        >
          <DailyResetTimer />
          <div className="my-4">
            <img
              src={cardImagePath(secretKey)}
              alt={getCardDisplayName(secretKey)}
              width={120}
              height={120}
              className="mx-auto rounded-xl border border-white/20"
            />
          </div>
          <p className="text-green-400 font-bold text-2xl mb-1">
            {getCardDisplayName(secretKey)}!
          </p>
          <p className="text-white/60 text-sm mb-4">
            Solved in {guesses.length} {guesses.length === 1 ? "guess" : "guesses"}
          </p>
          <NextModeLink currentSlug="classic" />
        </section>
      )}
    </div>
  );
}
