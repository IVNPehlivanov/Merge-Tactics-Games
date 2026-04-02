"use client";
import { useEffect, useState } from "react";
import {
  getDayKey,
  hasPlayedOnDay,
  clearPersistedGameState,
  setDevDayKey,
  getUTCDateString,
  getDailySecretFromPool,
} from "@/lib/daily";
import { getValidSkinPool } from "@/lib/skin-cards";
import { fireWinConfettiFromViewportCenter } from "@/lib/win-confetti";
import { updateStreakOnWin } from "@/lib/streakManager";
import { dispatchStreakUpdated } from "@/components/StreakBadge";
import { recordPlay } from "@/lib/community-stats-client";
import ClassicGame from "@/app/classic/ClassicGame";
import PixelGame from "@/app/pixel/PixelGame";
import SkinGame from "@/app/skin/SkinGame";
import DescriptionGame from "@/app/description/DescriptionGame";

export interface SolvedPayload {
  cardKey: string;
  guessCount: number;
  wrongGuessKeys: string[];
}

interface Props {
  slug: string;
}

export default function DailyGameGuard({ slug }: Props) {
  const [mounted, setMounted] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [dayKey, setDayKey] = useState("");
  const isDev = typeof window !== "undefined" && window.location.hostname === "localhost";

  useEffect(() => {
    const key = getDayKey();
    setDayKey(key);
    const played = hasPlayedOnDay(slug, key);
    setHasPlayed(played);
    setMounted(true);
  }, [slug]);

  if (!mounted || !dayKey) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const onSolved = (payload: SolvedPayload) => {
    if (slug !== "classic") {
      requestAnimationFrame(() => fireWinConfettiFromViewportCenter());
    }
    updateStreakOnWin().then(() => dispatchStreakUpdated());
    recordPlay({
      gameSlug: slug,
      dayKey,
      cardKey: payload.cardKey,
      guessCount: payload.guessCount,
      won: true,
      wrongGuessKeys: payload.wrongGuessKeys,
    });
    setHasPlayed(true);
  };

  const game =
    slug === "classic" ? (
      <ClassicGame dayKey={dayKey} onSolved={onSolved} />
    ) : slug === "pixel" ? (
      <PixelGame dayKey={dayKey} onSolved={onSolved} />
    ) : slug === "skin" ? (
      <SkinGame
        secretEntry={getDailySecretFromPool(getValidSkinPool(), "skin", dayKey)}
        dayKey={dayKey}
        onSolved={onSolved}
      />
    ) : slug === "description" ? (
      <DescriptionGame dayKey={dayKey} onSolved={onSolved} />
    ) : (
      <p className="text-white/50 text-center">Unknown game mode.</p>
    );

  return (
    <div className="flex w-full min-w-0 flex-col items-center">
      {game}
      {isDev && hasPlayed && (
        <div className="mt-8 w-full max-w-md space-y-2 rounded-xl border border-indigo-400/30 bg-indigo-400/5 p-3">
          <p className="font-mono text-xs text-indigo-400/70">Dev tools</p>
          <button
            type="button"
            className="block w-full rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/20"
            onClick={() => {
              clearPersistedGameState(slug, dayKey);
              try {
                const raw = localStorage.getItem("mergedle_daily_played");
                const data: Record<string, string[]> = raw ? JSON.parse(raw) : {};
                if (data[dayKey]) {
                  data[dayKey] = data[dayKey].filter((s) => s !== slug);
                  localStorage.setItem("mergedle_daily_played", JSON.stringify(data));
                }
              } catch {
                /* ignore */
              }
              window.location.reload();
            }}
          >
            Play again (reset today)
          </button>
          <button
            type="button"
            className="block w-full rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/20"
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
            type="button"
            className="block w-full rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/20"
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
