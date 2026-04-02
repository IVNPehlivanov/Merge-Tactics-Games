"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchCommunityStats } from "@/lib/community-stats-client";
import { cardImagePath, getCardDisplayName, getCardKeys, CARD_STATS } from "@/lib/card-stats";
import { getRulerByKey, getRulerKeys, pixelRulerCardImagePath } from "@/lib/ruler-stats";
import { getDailySecretFromPool, DAILY_GAME_SLUGS } from "@/lib/daily";
import { getValidSkinPool } from "@/lib/skin-cards";
import { getClassicCardKeys } from "@/lib/card-stats";
import { getDescriptionGameKeys } from "@/lib/description-game";
import type { CommunityStatsResponse } from "@/lib/community-stats";

const PIXEL_ENABLED_RULER_KEYS = new Set([
  "spirit_empress", "goblin_queen", "elixir_loong", "battle_machine",
  "echo_sage", "dagger_duchess", "royale_king",
]);

function buildPixelPool(): string[] {
  const cards = getCardKeys();
  const rulers = getRulerKeys()
    .filter((k) => PIXEL_ENABLED_RULER_KEYS.has(k))
    .map((k) => `ruler__${k}`);
  return [...cards, ...rulers];
}

function getPrevDayKey(dayKey: string): string {
  const [y, m, d] = dayKey.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d - 1));
  const py = date.getUTCFullYear();
  const pm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const pd = String(date.getUTCDate()).padStart(2, "0");
  return `${py}-${pm}-${pd}`;
}

function getClientYesterdayKey(gameSlug: string, dayKey: string): string | null {
  try {
    const prevDay = getPrevDayKey(dayKey);
    if (gameSlug === "classic") {
      return getDailySecretFromPool(getClassicCardKeys(), "classic", prevDay) as string;
    }
    if (gameSlug === "pixel") {
      return getDailySecretFromPool(buildPixelPool(), "pixel", prevDay) as string;
    }
    if (gameSlug === "description") {
      return getDailySecretFromPool(getDescriptionGameKeys(), "description", prevDay) as string;
    }
    if (gameSlug === "skin") {
      const entry = getDailySecretFromPool(getValidSkinPool(), "skin", prevDay) as { skinName: string };
      return entry.skinName ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

const outline = "[text-shadow:0_0_1px_rgb(0_0_0),0_1px_2px_rgb(0_0_0),0_2px_10px_rgb(0_0_0/0.9)]";

function getElixirColorClass(gameSlug: string, key: string): string {
  if (gameSlug === "skin") return `text-amber-200 font-bold ${outline}`;
  if (key.startsWith("ruler__")) return `text-amber-200 font-bold ${outline}`;
  const cost = CARD_STATS[key]?.elixirCost;
  switch (cost) {
    case 2: return `text-sky-200 ${outline}`;
    case 3: return `text-orange-200 ${outline}`;
    case 4: return `text-violet-200 ${outline}`;
    default: return `text-amber-100 font-bold ${outline}`;
  }
}

function getDisplayInfo(gameSlug: string, key: string): { imageSrc: string; name: string } | null {
  if (!key) return null;
  if (gameSlug === "skin") {
    const entry = getValidSkinPool().find((s) => s.skinName === key);
    if (!entry) return null;
    return { imageSrc: entry.imagePath, name: entry.skinName };
  }
  if (key.startsWith("ruler__")) {
    const rulerKey = key.replace("ruler__", "");
    const ruler = getRulerByKey(rulerKey);
    if (!ruler) return null;
    return { imageSrc: pixelRulerCardImagePath(rulerKey), name: ruler.name };
  }
  return { imageSrc: cardImagePath(key), name: getCardDisplayName(key) };
}

interface Props {
  gameSlug: string;
  dayKey: string;
}

export function CommunityStatsPanel({ gameSlug, dayKey }: Props) {
  const [stats, setStats] = useState<CommunityStatsResponse | null>(null);
  const [clientYesterdayKey, setClientYesterdayKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCommunityStats(gameSlug, dayKey)
      .then((data) => { if (!cancelled) setStats(data); })
      .catch(() => { if (!cancelled) setStats(null); });
    return () => { cancelled = true; };
  }, [gameSlug, dayKey]);

  useEffect(() => {
    if (!(DAILY_GAME_SLUGS as readonly string[]).includes(gameSlug)) return;
    setClientYesterdayKey(getClientYesterdayKey(gameSlug, dayKey));
  }, [gameSlug, dayKey]);

  const displayKey = stats?.yesterdayCardKey ?? clientYesterdayKey;
  const displayInfo = displayKey ? getDisplayInfo(gameSlug, displayKey) : null;

  return (
    <section className="mt-6 h-[142px] overflow-hidden flex flex-col items-center gap-2 text-center">
      {displayInfo ? (
        <>
          <p className="font-game text-sm text-white/90">{"Yesterday's card was:"}</p>
          <Image
            src={displayInfo.imageSrc}
            alt={displayInfo.name}
            width={56}
            height={56}
            className="rounded object-contain"
          />
          <p className={`font-game text-base ${displayKey ? getElixirColorClass(gameSlug, displayKey) : ""}`}>{displayInfo.name}</p>
        </>
      ) : null}
    </section>
  );
}
