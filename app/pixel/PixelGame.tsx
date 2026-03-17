"use client";
import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
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

const MAX_BLUR = 40;
const BLUR_STEP = 8;

export default function PixelGame({ dayKey, onSolved }: Props) {
  const cardKeys = getCardKeys();
  const secretKey = getDailySecretFromPool(cardKeys, "pixel", dayKey);

  const [guesses, setGuesses] = useState<string[]>([]);
  const [won, setWon] = useState(false);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = getPersistedGameState<PersistedState>("pixel", dayKey);
    if (saved && saved.secretKey === secretKey) {
      setGuesses(saved.guesses);
      setWon(saved.won);
    }
  }, [dayKey, secretKey]);

  const blurAmount = Math.max(0, MAX_BLUR - guesses.length * BLUR_STEP);
  const imagePath = cardImagePath(secretKey);

  const persist = (g: string[], w: boolean) => {
    setPersistedGameState("pixel", dayKey, { guesses: g, won: w, secretKey });
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

    const newGuesses = [...guesses, key];
    const isWon = key === secretKey;

    setGuesses(newGuesses);
    persist(newGuesses, isWon);

    if (isWon) {
      setWon(true);
      markPlayedToday("pixel");
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
      {/* Pixelated image */}
      <div className="flex justify-center my-4">
        <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-white/20">
          <Image
            src={imagePath}
            alt="Mystery card"
            fill
            className="object-cover transition-all duration-500"
            style={{ filter: won ? "none" : `blur(${blurAmount}px)`, transform: "scale(1.05)" }}
            unoptimized
          />
        </div>
      </div>

      {!won && (
        <p className="text-center text-white/50 text-xs">
          Wrong guesses reduce blur · {guesses.length} guess{guesses.length !== 1 ? "es" : ""} so far
        </p>
      )}

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
                    className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 text-white"
                    onClick={() => submitGuess(k)}
                  >
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
          <p className="text-green-400 font-bold text-xl mb-1">{getCardDisplayName(secretKey)}!</p>
          <p className="text-white/60 text-sm">{guesses.length} {guesses.length === 1 ? "guess" : "guesses"}</p>
          <NextModeLink currentSlug="pixel" />
        </div>
      )}

      {guesses.filter((k) => k !== secretKey).length > 0 && (
        <div className="mt-4">
          <p className="text-white/40 text-xs mb-2">Wrong guesses:</p>
          <div className="flex flex-wrap gap-2">
            {guesses.filter((k) => k !== secretKey).map((k) => (
              <span key={k} className="px-2 py-1 bg-red-900/40 border border-red-500/30 rounded text-xs text-white/60 animate-wrong-in">
                {getCardDisplayName(k)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
