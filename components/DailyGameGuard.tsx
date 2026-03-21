"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  getDayKey,
  hasPlayedToday,
  getPersistedGameState,
  clearPersistedGameState,
  setDevDayKey,
  getUTCDateString,
  getDailySecretFromPool,
} from "@/lib/daily";
import { getCardDisplayName, cardImagePath } from "@/lib/card-stats";
import { getValidSkinPool } from "@/lib/skin-cards";
import type { SkinEntry } from "@/lib/skin-cards";
import DailyResetTimer from "@/components/DailyResetTimer";
import NextModeLink from "@/components/NextModeLink";
import dynamic from "next/dynamic";

const ClassicGame = dynamic(() => import("@/app/classic/ClassicGame"));
const PixelGame = dynamic(() => import("@/app/pixel/PixelGame"));
const SkinGame = dynamic(() => import("@/app/skin/SkinGame"));

interface Props {
  slug: string;
}

interface PersistedState {
  secretKey?: string;
  secretCardKey?: string;
  secretRulerKey?: string;
  guesses?: unknown[];
  won?: boolean;
}

export default function DailyGameGuard({ slug }: Props) {
  const [mounted, setMounted] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [persistedState, setPersistedState] = useState<PersistedState | null>(null);
  const [dayKey, setDayKey] = useState("");
  const isDev = typeof window !== "undefined" && window.location.hostname === "localhost";

  useEffect(() => {
    const key = getDayKey();
    setDayKey(key);
    const played = hasPlayedToday(slug);
    setHasPlayed(played);
    if (played) {
      const state = getPersistedGameState<PersistedState>(slug, key);
      setPersistedState(state);
    }
    setMounted(true);
  }, [slug]);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (hasPlayed) {
    const cardKey = persistedState?.secretKey ?? persistedState?.secretCardKey ?? "";
    const isSkin = slug === "skin";
    const guessCount = (persistedState?.guesses ?? []).length;
    const skinImagePath = (persistedState as Record<string, unknown>)?.secretSkinImagePath as string | undefined;
    const skinName     = (persistedState as Record<string, unknown>)?.secretSkinName     as string | undefined;
    const imgSrc      = isSkin ? (skinImagePath ?? null) : cardKey ? cardImagePath(cardKey) : null;
    const displayName = isSkin ? (skinName ?? null)      : cardKey ? getCardDisplayName(cardKey) : null;

    return (
      <div className="flex flex-col items-center py-8 animate-fade-up">
        <div className="mx-auto max-w-xs w-full rounded-xl border-2 border-green-500/60 bg-white/10 p-6 text-center backdrop-blur-sm">
          <p className="text-yellow-400 font-game text-2xl mb-4 [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">Already played today!</p>
          {imgSrc && displayName && (
            <>
              <Image
                src={imgSrc}
                alt={displayName}
                width={128}
                height={128}
                className="mx-auto rounded-lg object-contain"
                unoptimized
              />
              <p className="mt-3 text-xl font-game text-white">{displayName}</p>
              {guessCount > 0 && (
                <p className="mt-1 text-white/60 text-sm font-game">Solved in {guessCount} {guessCount === 1 ? "guess" : "guesses"}</p>
              )}
            </>
          )}
          <div className="mt-4">
            <DailyResetTimer />
          </div>
          <NextModeLink currentSlug={slug} />
        </div>

        {isDev && (
          <div className="mt-8 p-3 border border-indigo-400/30 rounded-xl bg-indigo-400/5 space-y-2">
            <p className="text-indigo-400/70 text-xs font-mono">Dev tools</p>
            <button
              className="block w-full text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 transition-colors"
              onClick={() => {
                clearPersistedGameState(slug, dayKey);
                try {
                  const raw = localStorage.getItem("mergedle_daily_played");
                  const data: Record<string, string[]> = raw ? JSON.parse(raw) : {};
                  if (data[dayKey]) {
                    data[dayKey] = data[dayKey].filter((s) => s !== slug);
                    localStorage.setItem("mergedle_daily_played", JSON.stringify(data));
                  }
                } catch { /* ignore */ }
                window.location.reload();
              }}
            >
              Play again (reset today)
            </button>
            <button
              className="block w-full text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 transition-colors"
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
                setDevDayKey(getUTCDateString(tomorrow));
                window.location.reload();
              }}
            >
              Next day (advance UTC date)
            </button>
            <button
              className="block w-full text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 transition-colors"
              onClick={() => {
                setDevDayKey(null);
                window.location.reload();
              }}
            >
              Reset to today
            </button>
          </div>
        )}
      </div>
    );
  }

  const onSolved = () => {
    setHasPlayed(true);
    const state = getPersistedGameState<PersistedState>(slug, dayKey);
    setPersistedState(state);
  };

  switch (slug) {
    case "classic":
      return <ClassicGame dayKey={dayKey} onSolved={onSolved} />;
    case "pixel":
      return <PixelGame dayKey={dayKey} onSolved={onSolved} />;
    case "skin": {
      const skinPool = getValidSkinPool();
      const secretEntry: SkinEntry = getDailySecretFromPool(skinPool, "skin", dayKey);
      return <SkinGame secretEntry={secretEntry} dayKey={dayKey} onSolved={onSolved} />;
    }
    default:
      return <p className="text-white/50 text-center">Unknown game mode.</p>;
  }
}
