"use client";
import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  CARD_STATS,
  getCardKeys,
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
import NextModeLink from "@/components/NextModeLink";
import Image from "next/image";

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
  const cardKeys = getCardKeys().filter((k) => CARD_STATS[k]?.description);
  const secretKey = getDailySecretFromPool(cardKeys, "description", dayKey);
  const secret = CARD_STATS[secretKey];

  const [guesses, setGuesses] = useState<string[]>([]);
  const [won, setWon] = useState(false);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleInput = (val: string) => {
    setInput(val);
    setError("");
    if (val.length < 1) { setSuggestions([]); return; }
    setSuggestions(
      cardKeys
        .filter((k) => cardMatchesSearch(k, val) && !guesses.includes(k))
        .slice(0, 8)
    );
  };

  const submitGuess = (key: string) => {
    setInput("");
    setSuggestions([]);
    if (guesses.includes(key)) { setError("Already guessed!"); return; }
    const newGuesses = [key, ...guesses];
    const isWon = key === secretKey;
    setGuesses(newGuesses);
    persist(newGuesses, isWon);
    if (isWon) {
      setWon(true);
      markPlayedToday("description");
      onSolved();
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ["#818cf8", "#34d399", "#60a5fa"] });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = findExactMatchKey(input);
    if (key) { submitGuess(key); return; }
    if (suggestions.length === 1) { submitGuess(suggestions[0]); return; }
    setError("Select a card from the list.");
  };

  return (
    <div className="space-y-4">
      {/* Description card */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Card Description</p>
        <p className="text-white/90 text-sm leading-relaxed italic">"{secret?.description}"</p>
      </div>

      {!won && (
        <div className="relative">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="Type a card name…"
              autoComplete="off"
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 outline-none focus:border-indigo-400/60 text-sm"
            />
            <button type="submit" className="px-4 py-2 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-400 transition-colors text-sm">
              Guess
            </button>
          </form>

          {suggestions.length > 0 && (
            <ul className="absolute z-20 w-full mt-1 bg-gray-900 border border-white/20 rounded-lg overflow-hidden shadow-xl">
              {suggestions.map((k) => (
                <li key={k}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 text-white flex items-center gap-2"
                    onClick={() => submitGuess(k)}
                  >
                    <Image src={cardImagePath(k)} alt="" width={24} height={24} className="rounded" unoptimized />
                    {getCardDisplayName(k)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      {won && (
        <div className="text-center py-4 animate-fade-up">
          <p className="text-green-400 font-bold text-xl mb-1">Correct!</p>
          <Image src={cardImagePath(secretKey)} alt={getCardDisplayName(secretKey)} width={80} height={80} className="mx-auto rounded-xl my-2" unoptimized />
          <p className="text-white/60 text-sm">
            {getCardDisplayName(secretKey)} · {guesses.length} {guesses.length === 1 ? "guess" : "guesses"}
          </p>
          <NextModeLink currentSlug="description" />
        </div>
      )}

      {guesses.length > 0 && (
        <div className="space-y-1 mt-2">
          <p className="text-xs text-white/40 uppercase tracking-widest">Guesses</p>
          {guesses.map((k) => {
            const correct = k === secretKey;
            return (
              <div
                key={k}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm animate-wrong-in ${
                  correct ? "bg-green-600/30 border border-green-500/40" : "bg-red-800/20 border border-red-500/20"
                }`}
              >
                <Image src={cardImagePath(k)} alt="" width={24} height={24} className="rounded" unoptimized />
                <span className={correct ? "text-green-300" : "text-white/60"}>{getCardDisplayName(k)}</span>
                <span className="ml-auto">{correct ? "✓" : "✗"}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
