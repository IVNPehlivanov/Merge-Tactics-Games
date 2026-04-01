"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  getStreakData,
  isTodayCompletedForUI,
  getEffectiveDisplayStreak,
  type StreakRecord,
} from "@/lib/streakManager";

const STREAK_UPDATED_EVENT = "mergedle-streak-updated";

export function dispatchStreakUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(STREAK_UPDATED_EVENT));
  }
}

/** Inner streak UI (fire + number) - shared by fixed and inline modes */
function StreakBadgeContent({
  todayCompleted,
  displayStreak,
  grayed,
}: {
  todayCompleted: boolean;
  displayStreak: number;
  grayed: boolean;
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${
        todayCompleted ? "streak-fire-animate" : ""
      }`}
    >
      <span
        className={`text-5xl select-none leading-none ${
          grayed ? "grayscale opacity-80" : ""
        } ${todayCompleted ? "drop-shadow-[0_0_8px_rgba(0,0,0,0.4)]" : ""}`}
        aria-hidden
      >
        🔥
      </span>
      <span
        className={`pointer-events-none absolute inset-0 flex items-center justify-center pt-[18%] text-base font-bold leading-none tabular-nums ${
          grayed ? "text-gray-800" : "text-white"
        }`}
        style={{
          textShadow:
            "0 0 4px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.5)",
        }}
        aria-hidden
      >
        {displayStreak}
      </span>
    </div>
  );
}

export function StreakBadge({
  inline = false,
  usePortal = true,
}: { inline?: boolean; usePortal?: boolean } = {}) {
  const [record, setRecord] = useState<StreakRecord | null>(null);
  const [mounted, setMounted] = useState(false);

  const refresh = () => {
    getStreakData().then(setRecord);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener(STREAK_UPDATED_EVENT, onUpdate);
    window.addEventListener("focus", onUpdate);
    return () => {
      window.removeEventListener(STREAK_UPDATED_EVENT, onUpdate);
      window.removeEventListener("focus", onUpdate);
    };
  }, [mounted]);

  const todayCompleted = record !== null && isTodayCompletedForUI(record);
  const displayStreak = record !== null ? getEffectiveDisplayStreak(record) : 0;
  const grayed = !todayCompleted;

  const content = (
    <StreakBadgeContent
      todayCompleted={todayCompleted}
      displayStreak={displayStreak}
      grayed={grayed}
    />
  );

  if (inline) {
    return (
      <div
        className="flex items-center justify-center"
        title={
          record === null
            ? undefined
            : todayCompleted
              ? `${displayStreak} day streak – today completed`
              : displayStreak > 0
                ? `Complete today's puzzle to keep your ${displayStreak} day streak`
                : "Complete a daily puzzle to start your streak"
        }
        aria-label={
          record === null
            ? undefined
            : `Streak: ${displayStreak} day${displayStreak !== 1 ? "s" : ""}${grayed ? ", today not completed" : ", today completed"}`
        }
      >
        {content}
      </div>
    );
  }

  const badge = (
    <div
      className={
        usePortal
          ? "fixed left-2 top-4 z-[9999] flex items-center justify-center sm:left-4 pointer-events-auto"
          : "flex items-center justify-center"
      }
      title={
        record === null
          ? undefined
          : todayCompleted
            ? `${displayStreak} day streak – today completed`
            : displayStreak > 0
              ? `Complete today's puzzle to keep your ${displayStreak} day streak`
              : "Complete a daily puzzle to start your streak"
      }
      aria-label={
        record === null
          ? undefined
          : `Streak: ${displayStreak} day${displayStreak !== 1 ? "s" : ""}${grayed ? ", today not completed" : ", today completed"}`
      }
    >
      {content}
    </div>
  );

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  if (!usePortal) return badge;
  return createPortal(badge, document.body);
}

export default StreakBadge;
