"use client";

import { useCallback } from "react";
import {
  getUTCDateString,
  addUtcDaysToDayKey,
  getDailySecretFromPool,
} from "@/lib/daily";
import { getCardKeys, getClassicCardKeys, getCardDisplayName } from "@/lib/card-stats";
import { getValidSkinPool } from "@/lib/skin-cards";
import { getDescriptionGameKeys, getDescriptionDisplayName } from "@/lib/description-game";
import { getRulerKeys, getRulerByKey } from "@/lib/ruler-stats";

// Must stay in sync with PIXEL_ENABLED_RULER_KEYS in PixelGame.tsx
const PIXEL_ENABLED_RULER_KEYS = new Set<string>([
  "spirit_empress",
  "goblin_queen",
  "elixir_loong",
  "battle_machine",
  "echo_sage",
  "dagger_duchess",
  "royale_king",
]);

function buildPixelPoolKeys(): string[] {
  const cards = getCardKeys();
  const rulers = getRulerKeys()
    .filter((k) => PIXEL_ENABLED_RULER_KEYS.has(k))
    .map((k) => `ruler__${k}`);
  return [...cards, ...rulers];
}

function getPixelDisplayName(key: string): string {
  if (key.startsWith("ruler__")) {
    const rulerKey = key.slice(7);
    return getRulerByKey(rulerKey)?.name ?? rulerKey;
  }
  return getCardDisplayName(key);
}

function getYesterdayAnswers() {
  const yesterday = addUtcDaysToDayKey(getUTCDateString(), -1);
  const classicKey = getDailySecretFromPool(getClassicCardKeys(), "classic", yesterday) as string;
  const pixelKey = getDailySecretFromPool(buildPixelPoolKeys(), "pixel", yesterday) as string;
  const skinEntry = getDailySecretFromPool(getValidSkinPool(), "skin", yesterday);
  const descKey = getDailySecretFromPool(getDescriptionGameKeys(), "description", yesterday) as string;
  return {
    dayKey: yesterday,
    classic: getCardDisplayName(classicKey),
    pixel: getPixelDisplayName(pixelKey),
    skin: (skinEntry as { skinName: string }).skinName,
    description: getDescriptionDisplayName(descKey),
  };
}

function TweetYesterdayButton() {
  const handleClick = useCallback(() => {
    const { dayKey, classic, pixel, skin, description } = getYesterdayAnswers();
    const lines = [
      `#Mergedle card answers for ${dayKey}:`,
      ``,
      `⚔️ Classic Wordle: ${classic}`,
      `🔲 Pixel Quiz: ${pixel}`,
      `🎨 Skin Quiz: ${skin}`,
      `📖 Description Quiz: ${description}`,
      ``,
      `Play today - https://mergedle.com/`,
      ``,
      `#mergedle #mergetactics #clashroyale #guessthecard`,
    ];
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-2 w-full rounded bg-sky-500 px-2 py-1 text-xs font-bold text-white hover:bg-sky-400"
    >
      Post yesterday&apos;s cards on X
    </button>
  );
}

/**
 * Shows the correct answer only in development (NODE_ENV === 'development').
 * Use for debugging during development.
 */
export function DevAnswer({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <div
      className="fixed bottom-4 right-4 z-[200] max-w-[280px] rounded-lg border-2 border-amber-500 bg-amber-50 px-3 py-2 shadow-lg"
      title="Development only — not shown in production"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
        Dev: {label}
      </p>
      {value != null && <p className="mt-0.5 text-sm font-medium text-gray-900">{value}</p>}
      {children}
      <TweetYesterdayButton />
    </div>
  );
}
