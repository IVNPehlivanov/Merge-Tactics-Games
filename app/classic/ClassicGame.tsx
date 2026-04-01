"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  CARD_STATS,
  SPEED_ORDER,
  type CardSpeed,
  getClassicCardKeys,
  getCardDisplayName,
  cardMatchesSearch,
  findExactMatchKey,
  cardImagePath,
} from "@/lib/card-stats";
import {
  getDailySecretFromPool,
  markPlayedToday,
  setPersistedGameState,
  getPersistedGameState,
} from "@/lib/daily";
import { getTraitDisplayName } from "@/lib/traits";
import type { ClassicGuess, ClassicGuessAttributes, AttributeResult } from "@/types/game";
import NextModeLink from "@/components/NextModeLink";
import { RoyaledlyPromoBox } from "@/components/RoyaledlyPromoBox";
import DailyResetTimer from "@/components/DailyResetTimer";
import ClassicShareBox from "@/components/ClassicShareBox";
import { useFocusSearchOnTyping } from "@/lib/useFocusSearchOnTyping";
import { useDismissDropdownOnOutside } from "@/lib/useDismissDropdownOnOutside";
import { useSearchDropdownHighlight } from "@/lib/useSearchDropdownHighlight";
import { useLockBodyScrollWhileDropdownOpen } from "@/lib/useLockBodyScrollWhileDropdownOpen";
import { fireWinConfettiFromRect } from "@/lib/win-confetti";
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

/**
 * Match Clash-Royale-Games Classic behavior for ordered attrs with possible N/A:
 * - guess N/A vs secret value => higher (up arrow)
 * - guess value vs secret N/A => lower (down arrow)
 */
function compareOrderedWithNA(
  guessVal: number | undefined,
  secretVal: number | undefined,
): AttributeResult["result"] {
  if (guessVal === undefined && secretVal === undefined) return "correct";
  if (guessVal !== undefined && secretVal !== undefined) {
    if (guessVal === secretVal) return "correct";
    return secretVal > guessVal ? "higher" : "lower";
  }
  if (guessVal === undefined && secretVal !== undefined) return "higher";
  return "lower";
}

function buildGuessAttributes(guessKey: string, secretKey: string): ClassicGuessAttributes {
  const g = CARD_STATS[guessKey];
  const s = CARD_STATS[secretKey];
  const gh = g.hitSpeed;
  const sh = s.hitSpeed;
  const gsRaw = g.speed ? SPEED_ORDER.indexOf(g.speed as CardSpeed) : undefined;
  const ssRaw = s.speed ? SPEED_ORDER.indexOf(s.speed as CardSpeed) : undefined;
  const gs = gsRaw !== undefined && gsRaw >= 0 ? gsRaw : undefined;
  const ss = ssRaw !== undefined && ssRaw >= 0 ? ssRaw : undefined;

  const parseYear = (d: string) => {
    const y = parseInt(d.slice(0, 4), 10);
    return Number.isFinite(y) ? y : new Date(d).getUTCFullYear();
  };
  const gy = parseYear(g.releaseDate);
  const sy = parseYear(s.releaseDate);

  return {
    elixirCost:     { value: g.elixirCost,     result: compareOrdered(g.elixirCost, s.elixirCost) },
    hitSpeed:       { value: gh ?? "N/A",               result: compareOrderedWithNA(gh, sh) },
    speed:          { value: g.speed ?? "N/A",          result: compareOrderedWithNA(gs, ss) },
    primaryTrait:   { value: g.primaryTrait,   result: g.primaryTrait   === s.primaryTrait   ? "correct" : "wrong" },
    secondaryTrait: { value: g.secondaryTrait, result: g.secondaryTrait === s.secondaryTrait ? "correct" : "wrong" },
    cardType:       { value: g.cardType,       result: g.cardType       === s.cardType       ? "correct" : "wrong" },
    releaseYear:    { value: gy,               result: compareOrdered(gy, sy) },
  };
}

// -- Sub-components --

function CardThumbnail({ cardKey, size = "sm" }: { cardKey: string; size?: "sm" | "md" | "lg" | "xl" | "search" }) {
  const [failed, setFailed] = useState(false);
  const src = cardImagePath(cardKey);
  const dim =
    size === "search"
      ? "" /* unused — search uses .card-search-dropdown-thumb on the img */
      : size === "xl"
        ? "h-24 w-24"
        : size === "lg"
          ? "h-16 w-16"
          : size === "md"
            ? "h-14 w-14 sm:h-20 sm:w-20"
            : "h-10 w-10";
  const px = size === "search" ? 56 : size === "xl" ? 96 : size === "lg" ? 64 : size === "md" ? 80 : 40;
  if (failed) {
    return (
      <div
        className={`flex flex-shrink-0 items-center justify-center rounded bg-white/10 text-white/40 text-lg ${size === "search" ? "card-search-dropdown-thumb" : dim}`}
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
      className={
        size === "search"
          ? "card-search-dropdown-thumb rounded object-contain"
          : `${dim} flex-shrink-0 rounded object-contain`
      }
      onError={() => setFailed(true)}
    />
  );
}

function AttributeCell({
  attrKey,
  value,
  result,
}: {
  attrKey: keyof ClassicGuessAttributes;
  value: string | number | boolean;
  result: AttributeResult["result"];
}) {
  const isCorrect = result === "correct";
  const isHigher = result === "higher";
  const isLower = result === "lower";
  const bg = isCorrect ? "bg-green-600" : "bg-red-600";
  const showBigArrow = !isCorrect && (isHigher || isLower);
  const displayValue =
    typeof value === "boolean"
      ? value
        ? "Yes"
        : "No"
      : attrKey === "primaryTrait" || attrKey === "secondaryTrait"
        ? getTraitDisplayName(String(value))
        : attrKey === "hitSpeed"
          ? (typeof value === "number" ? `${String(value)} sec` : String(value))
          : attrKey === "speed"
            ? String(value)
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
        : String(value);

  return (
    <div
      className={`relative flex h-[3.5rem] w-full min-w-0 flex-wrap items-center justify-center overflow-hidden rounded-sm px-0.5 py-1 text-center text-[0.6rem] font-sans font-bold leading-tight text-white sm:h-[5rem] sm:px-1.5 sm:py-2 sm:text-sm ${bg}`}
    >
      {showBigArrow ? (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <span className="relative inline-block">
            <span className="inline-block text-[3rem] font-bold leading-none text-black opacity-40 sm:text-[6rem] [transform:translateX(0.04em)]">
              {isHigher ? "↑" : "↓"}
            </span>
            <span className="absolute inset-0 flex items-center justify-center leading-none text-white drop-shadow-md [transform:translate(0.04em,0.12em)]">
              {displayValue}
            </span>
          </span>
        </span>
      ) : attrKey === "releaseYear" ? (
        <span className="relative z-10 whitespace-nowrap text-center drop-shadow-sm">{displayValue}</span>
      ) : (
        <span className="relative z-10 min-w-0 text-center drop-shadow-sm">
          {String(displayValue).split(" ").map((word, i) => (
            <span key={i} className="block">{word}</span>
          ))}
        </span>
      )}
    </div>
  );
}

// -- Column config --

const ATTR_LABELS = ["Elixir Cost", "Type", "Trait 1", "Trait 2", "Hit Speed", "Speed", "Release Date"] as const;
const ATTR_KEYS: (keyof ClassicGuessAttributes)[] = [
  "elixirCost", "cardType", "primaryTrait", "secondaryTrait", "hitSpeed", "speed", "releaseYear",
];

const ATTRIBUTE_COLUMNS: { key: keyof ClassicGuessAttributes; label: (typeof ATTR_LABELS)[number] }[] =
  ATTR_KEYS.map((key, i) => ({ key, label: ATTR_LABELS[i] }));

/** Share row width on desktop (13% + 7×12.43% = 100%) — table stays within panel, no PC horizontal scroll */
const CARD_COL_PCT = "13%";
const ATTR_COL_PCT = `${87 / 7}%`;

const CELL_DELAY_MS = 200;

// -- Main component --

export default function ClassicGame({ dayKey, onSolved }: Props) {
  const cardKeys  = useMemo(() => getClassicCardKeys(), []);
  const secretKey = useMemo(() => getDailySecretFromPool(cardKeys, "classic", dayKey), [cardKeys, dayKey]);

  const [guesses, setGuesses]       = useState<ClassicGuess[]>([]);
  const [won, setWon]               = useState(false);
  const [showWinMsg, setShowWinMsg] = useState(false);
  /** Stagger attribute cells on the winning row (won=true skips the old `!won && rowIndex===0` path). */
  const [staggerWinningRow, setStaggerWinningRow] = useState(false);
  const [search, setSearch]         = useState("");
  const [dropdownOpen, setDropdown] = useState(false);

  const guessesRef       = useRef<ClassicGuess[]>([]);
  const justWonRef       = useRef(false);
  const searchInputRef   = useRef<HTMLInputElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);
  const winPanelRef      = useRef<HTMLElement | null>(null);
  /** True only for a win in this session (not restored from localStorage) — gates confetti once. */
  const confettiPendingRef = useRef(false);
  /** Scroll win panel into view only after a fresh correct guess, not on hydrate from storage. */
  const scrollWinPanelIntoViewRef = useRef(false);

  const winDelayMs = ATTR_KEYS.length * CELL_DELAY_MS + 500;

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

  // Show win message after attribute stagger finishes; clear winning-row animation flags
  useEffect(() => {
    if (!won || !justWonRef.current) return;
    const t = setTimeout(() => {
      setShowWinMsg(true);
      setStaggerWinningRow(false);
      justWonRef.current = false;
    }, winDelayMs);
    return () => clearTimeout(t);
  }, [won, winDelayMs]);

  // Confetti from the green win panel (not viewport center while the attribute row is animating).
  useEffect(() => {
    if (!showWinMsg || !won || !confettiPendingRef.current) return;
    confettiPendingRef.current = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = winPanelRef.current;
        if (el) fireWinConfettiFromRect(el.getBoundingClientRect());
      });
    });
    return () => cancelAnimationFrame(id);
  }, [showWinMsg, won]);

  // After win panel mounts, center it in the viewport (fresh win only).
  useEffect(() => {
    if (!showWinMsg || !won || !scrollWinPanelIntoViewRef.current) return;
    scrollWinPanelIntoViewRef.current = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        winPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
    return () => cancelAnimationFrame(id);
  }, [showWinMsg, won]);

  useDismissDropdownOnOutside(searchSectionRef, () => setDropdown(false));

  useLockBodyScrollWhileDropdownOpen(!won && dropdownOpen && !!search.trim());

  useFocusSearchOnTyping(searchInputRef, {
    enabled: !won,
    commit: (next) => {
      setSearch(next);
      if (next.trim()) setDropdown(true);
    },
  });

  const filteredKeys   = useMemo(() => {
    if (!search.trim()) return [];
    return cardKeys.filter((k) => cardMatchesSearch(k, search));
  }, [cardKeys, search]);

  const alreadyGuessed = useMemo(() => new Set(guesses.map((g) => g.cardKey)), [guesses]);

  const availableKeys = useMemo(
    () => filteredKeys.filter((k) => !alreadyGuessed.has(k)),
    [filteredKeys, alreadyGuessed],
  );

  const dropdownListCount =
    !won && dropdownOpen && search.trim() ? availableKeys.length : 0;

  /** After a win: correct row first, then wrong guesses (same order as stored for wrongs). */
  const guessesToShow = useMemo(() => {
    if (!won) return guesses;
    const wrongs = guesses.filter((g) => g.cardKey !== secretKey);
    const correctRow = guesses.find((g) => g.cardKey === secretKey);
    return correctRow ? [correctRow, ...wrongs] : wrongs;
  }, [won, guesses, secretKey]);

  const { highlightIndex, dropdownRef, handleArrowKeys, optionPointerHandlers, onDropdownPointerLeave } =
    useSearchDropdownHighlight({
      enabled: !won,
      itemCount: dropdownListCount,
      resetKey: search,
    });

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
      confettiPendingRef.current = true;
      scrollWinPanelIntoViewRef.current = true;
      justWonRef.current = true;
      setStaggerWinningRow(true);
      setWon(true);
      markPlayedToday("classic");
      onSolved();
    }
  }

  function submitFromSearch() {
    if (availableKeys.length === 0) return;
    if (highlightIndex >= 0 && highlightIndex < availableKeys.length) {
      handleGuess(availableKeys[highlightIndex]);
      return;
    }
    const exact = findExactMatchKey(search);
    handleGuess((exact && availableKeys.includes(exact)) ? exact : availableKeys[0]);
  }

  return (
    <div className="w-full space-y-6">

      {/* ── Search input ── */}
      {!won && (
        <section ref={searchSectionRef} className="relative z-30 mx-auto w-full max-w-md px-4">
          <div className="relative w-full min-w-0">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search any card..."
              value={search}
              autoComplete="off"
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value.trim()) setDropdown(true);
              }}
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
                {availableKeys.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-600">No cards match.</p>
                ) : (
                  <ul role="list">
                    {availableKeys.map((key, optionIndex) => (
                        <li key={key} role="option">
                          <button
                            type="button"
                            data-search-option-index={optionIndex}
                            data-search-active={highlightIndex === optionIndex ? "true" : undefined}
                            {...optionPointerHandlers(optionIndex)}
                            onClick={() => { handleGuess(key); }}
                            className="card-search-option flex w-full items-center bg-white text-left text-base font-medium text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          >
                            <CardThumbnail cardKey={key} size="search" />
                            <span className="text-base font-medium">{getCardDisplayName(key)}</span>
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

      {/* ── Guess table ── */}
      {(!won || guesses.length > 0) && (
        <>
          <section className="relative z-0 mx-auto w-full max-w-full rounded-xl border-2 border-white/40 bg-white/10 p-4 backdrop-blur-sm">
            <h3 className="mb-3 text-center font-supercell text-sm font-bold uppercase tracking-wide text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.9)] sm:text-base">
              Your guesses
            </h3>

            <div className="max-sm:overflow-x-auto max-sm:overscroll-x-contain sm:overflow-x-visible [-webkit-overflow-scrolling:touch] touch-pan-x max-sm:touch-pan-x">
              <table
                className="w-full min-w-0 table-fixed border-collapse text-base max-sm:min-w-[548px]"
              >
                <colgroup>
                  <col style={{ width: CARD_COL_PCT }} />
                  {ATTRIBUTE_COLUMNS.map((c) => (
                    <col key={c.key} style={{ width: ATTR_COL_PCT }} />
                  ))}
                </colgroup>
                <thead>
                  <tr className="border-b border-gray-300 font-supercell dark:border-gray-700">
                    <th className="px-0.5 py-1.5 text-center text-[0.4375rem] font-semibold text-white sm:px-2 sm:py-4 sm:text-base">
                      Card
                    </th>
                    {ATTRIBUTE_COLUMNS.map(({ key, label }) => (
                      <th
                        key={key}
                        className={`px-0.5 py-1.5 text-center text-[0.4375rem] font-semibold leading-tight text-white sm:px-2 sm:py-4 sm:text-base ${
                          key === "releaseYear" ? "min-w-0" : "min-w-0 break-words"
                        }`}
                      >
                        {label === "Trait 1" || label === "Trait 2" ? (
                          <>
                            <span className="block">Trait</span>
                            <span className="block">{label === "Trait 1" ? "1" : "2"}</span>
                          </>
                        ) : label === "Elixir Cost" || label === "Hit Speed" ? (
                          <>
                            {label === "Elixir Cost" ? (
                              <>
                                <span className="block">Elixir</span>
                                <span className="block">Cost</span>
                              </>
                            ) : (
                              <>
                                <span className="block">Hit</span>
                                <span className="block">Speed</span>
                              </>
                            )}
                          </>
                        ) : key === "releaseYear" ? (
                          <>
                            <span className="block whitespace-nowrap">Release</span>
                            <span className="block whitespace-nowrap">Date</span>
                          </>
                        ) : (
                          label
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guessesToShow.map((g, rowIndex) => {
                    const staggerCells =
                      (!won && rowIndex === 0) || (won && staggerWinningRow && rowIndex === 0);
                    return (
                      <tr
                        key={g.cardKey}
                        className={`border-b border-gray-200 dark:border-gray-700 ${staggerCells ? "animate-wrong-in" : ""}`}
                      >
                        <td className="px-1 py-2 align-top sm:px-2 sm:py-4">
                          <div className="flex flex-col items-center gap-1">
                            <div className="relative -mt-2 h-16 w-16 sm:hidden">
                              <CardThumbnail cardKey={g.cardKey} size="lg" />
                            </div>
                            <div className="relative -mt-3 hidden h-24 w-24 sm:block">
                              <CardThumbnail cardKey={g.cardKey} size="xl" />
                            </div>
                          </div>
                        </td>
                        {ATTRIBUTE_COLUMNS.map(({ key }, colIndex) => {
                          const cell = g.attributes[key] ?? {
                            value:
                              key === "hitSpeed"
                                ? (CARD_STATS[g.cardKey]?.hitSpeed ?? 0)
                                : key === "speed"
                                  ? (CARD_STATS[g.cardKey]?.speed ?? "very_slow")
                                  : key === "releaseYear"
                                    ? new Date(CARD_STATS[g.cardKey]?.releaseDate ?? "1970-01-01").getUTCFullYear()
                                    : key === "elixirCost"
                                      ? (CARD_STATS[g.cardKey]?.elixirCost ?? 0)
                                      : key === "primaryTrait"
                                        ? (CARD_STATS[g.cardKey]?.primaryTrait ?? "none")
                                        : key === "secondaryTrait"
                                          ? (CARD_STATS[g.cardKey]?.secondaryTrait ?? "none")
                                          : key === "cardType"
                                            ? (CARD_STATS[g.cardKey]?.cardType ?? "Troop")
                                            : "—",
                            result: "wrong" as const,
                          };
                          return (
                            <td key={key} className="min-w-0 px-1 py-2 align-top sm:px-2 sm:py-4">
                              <div
                                className={staggerCells ? "animate-attribute-reveal" : ""}
                                style={
                                  staggerCells
                                    ? {
                                        animationDelay: `${(colIndex + 1) * CELL_DELAY_MS}ms`,
                                        animationFillMode: "both",
                                      }
                                    : undefined
                                }
                              >
                                <AttributeCell attrKey={key} value={cell.value} result={cell.result} />
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* ── Win message (below YOUR GUESSES) ── */}
      {won && showWinMsg && (
        <section
          ref={winPanelRef}
          className="animate-win-message mx-auto max-w-md rounded-xl border-2 border-green-500/60 bg-white/10 p-6 text-center backdrop-blur-sm"
        >
          <p className="font-supercell text-lg font-bold tracking-wide text-green-400 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)] sm:text-xl">
            You guessed correctly!
          </p>
          <p className="mt-3 font-game text-2xl font-bold text-white">
            {getCardDisplayName(secretKey)}!
          </p>
          <div className="mt-2">
            <img
              src={cardImagePath(secretKey)}
              alt={getCardDisplayName(secretKey)}
              width={120}
              height={120}
              className="mx-auto rounded-xl border border-white/20"
            />
          </div>
          <p className="mt-4 font-supercell text-sm text-white sm:text-base">
            Number of tries: {guesses.length}
          </p>
          <ClassicShareBox dayKey={dayKey} className="mt-6" />
          <div className="mt-6">
            <DailyResetTimer />
          </div>
          <NextModeLink currentSlug="classic" />
          <div className="mt-4">
            <RoyaledlyPromoBox />
          </div>
        </section>
      )}
    </div>
  );
}
