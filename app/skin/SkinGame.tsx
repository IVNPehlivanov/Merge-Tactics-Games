"use client";
import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import Image from "next/image";
import { getRulerKeys, getRulerByKey, rulerImagePath } from "@/lib/ruler-stats";
import {
  markPlayedToday,
  setPersistedGameState,
  getPersistedGameState,
} from "@/lib/daily";
import type { SkinEntry } from "@/lib/skin-cards";
import NextModeLink from "@/components/NextModeLink";

interface Props {
  secretEntry: SkinEntry;
  dayKey: string;
  onSolved: () => void;
}

interface PersistedState {
  guesses: string[];
  won: boolean;
  secretRulerKey: string;
}

export default function SkinGame({ secretEntry, dayKey, onSolved }: Props) {
  const rulerKeys = getRulerKeys();

  const [guesses, setGuesses] = useState<string[]>([]);
  const [won, setWon] = useState(false);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = getPersistedGameState<PersistedState>("skin", dayKey);
    if (saved && saved.secretRulerKey === secretEntry.rulerKey) {
      setGuesses(saved.guesses);
      setWon(saved.won);
    }
  }, [dayKey, secretEntry.rulerKey]);

  const persist = (g: string[], w: boolean) => {
    setPersistedGameState("skin", dayKey, { guesses: g, won: w, secretRulerKey: secretEntry.rulerKey });
  };

  const getRulerName = (key: string) => getRulerByKey(key)?.name ?? key;

  const handleInput = (val: string) => {
    setInput(val);
    setError("");
    if (val.length < 1) { setSuggestions([]); return; }
    const q = val.toLowerCase();
    setSuggestions(
      rulerKeys
        .filter((k) => getRulerName(k).toLowerCase().includes(q) && !guesses.includes(k))
        .slice(0, 8)
    );
  };

  const submitGuess = (key: string) => {
    setInput("");
    setSuggestions([]);
    if (guesses.includes(key)) { setError("Already guessed!"); return; }

    const newGuesses = [...guesses, key];
    const isWon = key === secretEntry.rulerKey;

    setGuesses(newGuesses);
    persist(newGuesses, isWon);

    if (isWon) {
      setWon(true);
      markPlayedToday("skin");
      onSolved();
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ["#818cf8", "#34d399", "#60a5fa"] });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.toLowerCase().trim();
    const exact = rulerKeys.find((k) => getRulerName(k).toLowerCase() === q);
    if (exact) { submitGuess(exact); return; }
    if (suggestions.length === 1) { submitGuess(suggestions[0]); return; }
    setError("Select a ruler from the list.");
  };

  return (
    <div className="space-y-4">
      {/* Skin image — always fully visible */}
      <div className="flex flex-col items-center my-4 gap-2">
        <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-white/20">
          <Image
            src={secretEntry.imagePath}
            alt={secretEntry.skinName}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <p className="text-white/60 text-sm italic">"{secretEntry.skinName}"</p>
      </div>

      {!won && (
        <div className="relative">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => handleInput(e.target.value)}
              placeholder="Which ruler owns this skin?"
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
                    {getRulerName(k)}
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
          <p className="text-green-400 font-bold text-xl mb-2">Correct!</p>
          <Image
            src={rulerImagePath(secretEntry.rulerKey)}
            alt={getRulerName(secretEntry.rulerKey)}
            width={120}
            height={120}
            className="mx-auto rounded-xl border border-white/10 mb-2"
            unoptimized
          />
          <p className="text-white/80 font-semibold">{getRulerName(secretEntry.rulerKey)}</p>
          <p className="text-white/50 text-sm mt-1">
            Solved in {guesses.length} {guesses.length === 1 ? "guess" : "guesses"}
          </p>
          <NextModeLink currentSlug="skin" />
        </div>
      )}

      {guesses.filter((k) => k !== secretEntry.rulerKey).length > 0 && (
        <div className="mt-4">
          <p className="text-white/40 text-xs mb-2">Wrong guesses:</p>
          <div className="flex flex-wrap gap-2">
            {guesses.filter((k) => k !== secretEntry.rulerKey).map((k) => (
              <span key={k} className="px-2 py-1 bg-red-900/40 border border-red-500/30 rounded text-xs text-white/60 animate-wrong-in">
                {getRulerName(k)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
