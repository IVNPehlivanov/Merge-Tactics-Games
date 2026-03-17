"use client";
import { useEffect, useState } from "react";
import { getStreakData, type StreakRecord } from "@/lib/streakManager";

export default function StreakBadge() {
  const [record, setRecord] = useState<StreakRecord | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    getStreakData().then(setRecord);
  }, []);

  useEffect(() => {
    const handler = () => {
      getStreakData().then((r) => {
        setRecord(r);
        setFlash(true);
        setTimeout(() => setFlash(false), 600);
      });
    };
    window.addEventListener("mergedle-streak-update", handler);
    return () => window.removeEventListener("mergedle-streak-update", handler);
  }, []);

  if (!record || record.streak === 0) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-40 flex items-center gap-1.5 bg-gray-900/90 border border-indigo-400/40 rounded-full px-3 py-1.5 text-sm font-bold text-indigo-400 shadow-lg backdrop-blur transition-transform ${flash ? "scale-110" : "scale-100"}`}
    >
      🔥 {record.streak}
    </div>
  );
}
