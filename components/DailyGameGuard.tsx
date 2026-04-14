"use client";
import { useEffect, useRef, useState } from "react";
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
import { recordPlay, fetchCommunityStats } from "@/lib/community-stats-client";
import ClassicGame from "@/app/classic/ClassicGame";
import PixelGame from "@/app/pixel/PixelGame";
import SkinGame from "@/app/skin/SkinGame";
import DescriptionGame from "@/app/description/DescriptionGame";

function LivePlayerCount({ slug, dayKey, justSolved }: { slug: string; dayKey: string; justSolved: boolean }) {
  const [count, setCount] = useState<number | null>(null);
  const [optimisticBump, setOptimisticBump] = useState(0);
  const lastServerCountRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    lastServerCountRef.current = 0;
    const applyStats = (d: Awaited<ReturnType<typeof fetchCommunityStats>>) => {
      if (!d || cancelled) return;
      if (d.playerCount > lastServerCountRef.current) {
        lastServerCountRef.current = d.playerCount;
        setOptimisticBump(0);
      } else {
        lastServerCountRef.current = d.playerCount;
      }
      setCount(d.playerCount);
    };
    fetchCommunityStats(slug, dayKey).then((d) => {
      if (cancelled) return;
      if (d) applyStats(d);
      else {
        lastServerCountRef.current = 0;
        setCount(0);
      }
    });
    const interval = setInterval(() => {
      fetchCommunityStats(slug, dayKey).then((d) => {
        if (cancelled || !d) return;
        applyStats(d);
      });
    }, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [slug, dayKey]);

  useEffect(() => {
    if (justSolved) setOptimisticBump(1);
  }, [justSolved]);

  const displayed = count !== null ? count + optimisticBump : null;
  const countText =
    displayed === null
      ? "\u00A0"
      : displayed === 0
        ? "Be the first to find out today!"
        : `${displayed.toLocaleString()} ${displayed === 1 ? "person has" : "people have"} already found out!`;

  return (
    <div className="mb-4 shrink-0 flex items-center justify-center h-[44px] min-h-[44px] text-center overflow-hidden">
      <p className="font-supercell text-sm font-bold text-yellow-400">{countText}</p>
    </div>
  );
}

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
  const [justSolved, setJustSolved] = useState(false);
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
    setJustSolved(true);
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
      <LivePlayerCount slug={slug} dayKey={dayKey} justSolved={justSolved} />
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
