"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  getDescriptionGameKeys,
  getDescriptionDisplayName,
  descriptionMatchesSearch,
  findExactDescriptionMatchKey,
  descriptionImagePath,
  getDescriptionTextForKey,
} from "@/lib/description-game";
import {
  getDailySecretFromPool,
  getDescriptionRevealOrderSeed,
  markPlayedToday,
  setPersistedGameState,
  getPersistedGameState,
} from "@/lib/daily";
import {
  tokenizeDescription,
  wordRevealOrderSeeded,
  revealedWordIndexSet,
  type DescriptionToken,
} from "@/lib/description-reveal";
import NextModeLink from "@/components/NextModeLink";
import DailyResetTimer from "@/components/DailyResetTimer";
import ClassicShareBox from "@/components/ClassicShareBox";
import Image from "next/image";
import { useFocusSearchOnTyping } from "@/lib/useFocusSearchOnTyping";
import { useDismissDropdownOnOutside } from "@/lib/useDismissDropdownOnOutside";
import { useSearchDropdownHighlight } from "@/lib/useSearchDropdownHighlight";

/** Small gray underscores per letter — sans font, not the game display font. */
function HiddenWordSpans({ letterCount }: { letterCount: number }) {
  return (
    <span
      className="mx-0.5 inline-flex items-end gap-[3px] align-baseline font-sans [vertical-align:baseline]"
      aria-hidden
    >
      {Array.from({ length: letterCount }, (_, ci) => (
        <span
          key={ci}
          className="text-sm font-semibold leading-none text-gray-700 [text-shadow:0_0_1px_rgba(255,255,255,0.35)] sm:text-base"
        >
          _
        </span>
      ))}
    </span>
  );
}

interface Props {
  dayKey: string;
  onSolved: () => void;
}

interface PersistedState {
  guesses: string[];
  won: boolean;
  secretKey: string;
}

export default function DescriptionGame({ dayKey, onSolved }: Props) {
  const cardKeys = useMemo(() => getDescriptionGameKeys(), []);
  const secretKey = useMemo(() => getDailySecretFromPool(cardKeys, "description", dayKey), [cardKeys, dayKey]);

  const [guesses, setGuesses] = useState<string[]>([]);
  const [won, setWon] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdown] = useState(false);
  const [error, setError] = useState("");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = getPersistedGameState<PersistedState>("description", dayKey);
    if (saved && saved.secretKey === secretKey) {
      setGuesses(saved.guesses);
      setWon(saved.won);
    }
  }, [dayKey, secretKey]);

  const persist = (g: string[], w: boolean) => {
    setPersistedGameState("description", dayKey, { guesses: g, won: w, secretKey });
  };

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    return cardKeys
      .filter((k) => descriptionMatchesSearch(k, search) && !guesses.includes(k))
      .slice(0, 8);
  }, [cardKeys, search, guesses]);

  const dropdownListCount =
    !won && dropdownOpen && search.trim() ? suggestions.length : 0;

  const { highlightIndex, dropdownRef, handleArrowKeys, optionPointerHandlers, onDropdownPointerLeave } =
    useSearchDropdownHighlight({
      enabled: !won,
      itemCount: dropdownListCount,
      resetKey: search,
    });

  useDismissDropdownOnOutside(searchSectionRef, () => setDropdown(false));

  useFocusSearchOnTyping(searchInputRef, {
    enabled: !won,
    commit: (next) => {
      setSearch(next);
      setError("");
      if (next.trim()) setDropdown(true);
    },
  });

  const descriptionText = useMemo(() => getDescriptionTextForKey(secretKey), [secretKey]);
  const descTokens = useMemo(() => tokenizeDescription(descriptionText), [descriptionText]);
  const wordCount = useMemo(
    () => descTokens.filter((t): t is Extract<DescriptionToken, { type: "word" }> => t.type === "word").length,
    [descTokens],
  );
  const revealOrder = useMemo(
    () => wordRevealOrderSeeded(wordCount, getDescriptionRevealOrderSeed(dayKey, secretKey)),
    [wordCount, dayKey, secretKey],
  );
  const wrongGuessCount = guesses.filter((g) => g !== secretKey).length;

  /** After a win, only list incorrect guesses under the success message. */
  const guessesToShow = won ? guesses.filter((k) => k !== secretKey) : guesses;
  const revealedWordIndices = useMemo(
    () => revealedWordIndexSet(wordCount, revealOrder, wrongGuessCount),
    [wordCount, revealOrder, wrongGuessCount],
  );

  const submitGuess = (key: string) => {
    setSearch("");
    setDropdown(false);
    if (guesses.includes(key)) {
      setError("Already guessed!");
      return;
    }
    const newGuesses = [key, ...guesses];
    const isWon = key === secretKey;
    setGuesses(newGuesses);
    persist(newGuesses, isWon);
    if (isWon) {
      setWon(true);
      markPlayedToday("description");
      onSolved();
    }
  };

  function submitFromSearch() {
    if (suggestions.length === 0) return;
    if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
      submitGuess(suggestions[highlightIndex]);
      return;
    }
    const key = findExactDescriptionMatchKey(search);
    if (key && suggestions.includes(key)) {
      submitGuess(key);
      return;
    }
    const q = search.trim().toLowerCase();
    const exact = suggestions.find((k) => getDescriptionDisplayName(k).toLowerCase() === q);
    submitGuess(exact ?? suggestions[0]);
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = findExactDescriptionMatchKey(search);
    if (key && !guesses.includes(key) && descriptionMatchesSearch(key, search)) {
      submitGuess(key);
      return;
    }
    if (suggestions.length === 1) {
      submitGuess(suggestions[0]);
      return;
    }
    if (suggestions.length > 0) {
      submitFromSearch();
      return;
    }
    setError("Select a card from the list.");
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 px-4">
      <section className="rounded-xl border-2 border-white/40 bg-white/10 p-4 backdrop-blur-sm sm:p-5">
        {won ? (
          <p className="text-center font-game text-base leading-relaxed text-white whitespace-pre-line [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]">
            {descriptionText}
          </p>
        ) : (
          <div className="text-center font-game text-base leading-relaxed text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.9)]">
            {descTokens.map((t, i) => {
              if (t.type === "raw") {
                if (t.text === "\n") {
                  return <br key={i} />;
                }
                return (
                  <span key={i} className="whitespace-pre-wrap">
                    {t.text}
                  </span>
                );
              }
              if (revealedWordIndices.has(t.wordIndex)) {
                return (
                  <span key={i} className="whitespace-pre-wrap">
                    {t.word}
                  </span>
                );
              }
              return <HiddenWordSpans key={i} letterCount={t.word.length} />;
            })}
          </div>
        )}
      </section>

      {!won && (
        <section ref={searchSectionRef} className="relative w-full min-w-0">
          <div className="relative w-full min-w-0">
            <form onSubmit={handleFormSubmit} className="relative w-full min-w-0">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search any card or ruler..."
                value={search}
                autoComplete="off"
                onChange={(e) => {
                  setSearch(e.target.value);
                  setError("");
                  if (e.target.value.trim()) setDropdown(true);
                }}
                onFocus={() => {
                  if (search.trim()) setDropdown(true);
                }}
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
                onClick={() => submitFromSearch()}
                className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Submit guess"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              {search.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setDropdown(false);
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-12 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Clear search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </form>

            {dropdownOpen && search.trim() && (
              <div
                ref={dropdownRef}
                className="card-search-dropdown absolute top-full left-0 right-0 z-50 mt-1 overflow-y-auto rounded-xl border-2 border-gray-300 bg-white py-1 shadow-lg"
                role="listbox"
                data-keyboard-nav={highlightIndex >= 0 ? "true" : undefined}
                onPointerLeave={onDropdownPointerLeave}
              >
                {suggestions.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-600">No cards or rulers match.</p>
                ) : (
                  <ul role="list">
                    {suggestions.map((k, optionIndex) => (
                      <li key={k} role="option">
                        <button
                          type="button"
                          data-search-option-index={optionIndex}
                          data-search-active={highlightIndex === optionIndex ? "true" : undefined}
                          {...optionPointerHandlers(optionIndex)}
                          onClick={() => submitGuess(k)}
                          className="flex w-full items-center gap-4 bg-white px-4 py-3 text-left text-gray-900 transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        >
                          <Image src={descriptionImagePath(k)} alt="" width={40} height={40} className="h-10 w-10 rounded object-contain" unoptimized />
                          <span className="text-base font-medium">{getDescriptionDisplayName(k)}</span>
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

      {error && <p className="text-center text-sm font-medium text-red-300 drop-shadow">{error}</p>}

      {won && (
        <section className="animate-win-message mx-auto max-w-md rounded-xl border-2 border-green-500/60 bg-white/10 p-6 text-center backdrop-blur-sm">
          <p className="font-supercell text-lg font-bold tracking-wide text-green-400 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)] sm:text-xl">
            You guessed correctly!
          </p>
          <p className="mt-3 font-game text-2xl font-bold text-white">{getDescriptionDisplayName(secretKey)}!</p>
          <div className="mt-2 flex justify-center">
            <Image src={descriptionImagePath(secretKey)} alt={getDescriptionDisplayName(secretKey)} width={80} height={80} className="rounded-xl" unoptimized />
          </div>
          <p className="mt-4 font-supercell text-sm text-white sm:text-base">
            Number of tries: {guesses.length}
          </p>
          <ClassicShareBox dayKey={dayKey} className="mt-6" />
          <div className="mt-6">
            <DailyResetTimer />
          </div>
          <NextModeLink currentSlug="description" />
        </section>
      )}

      {guessesToShow.length > 0 && (
        <section className="rounded-xl border-2 border-white/40 bg-white/10 p-4 backdrop-blur-sm font-game">
          <h3 className="mb-3 text-center text-sm font-semibold uppercase tracking-wide text-white/90">
            {won ? "Wrong guesses" : "Your guesses"}
          </h3>
          <div className="mx-auto max-w-md space-y-2">
            {guessesToShow.map((k) => {
              const correct = k === secretKey;
              return (
                <div
                  key={k}
                  className={`animate-wrong-guess-in flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 backdrop-blur-sm ${
                    correct
                      ? "border-green-500/70 bg-white/10"
                      : "border-red-400/80 bg-white/10"
                  }`}
                >
                  <Image
                    src={descriptionImagePath(k)}
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 flex-shrink-0 rounded object-contain"
                    unoptimized
                  />
                  <span className={`text-base font-medium ${correct ? "text-green-300" : "text-white"}`}>
                    {getDescriptionDisplayName(k)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
