"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DAILY_GAME_SLUGS, hasPlayedToday, DAILY_PROGRESS_UPDATE_EVENT } from "@/lib/daily";

export default function DailyProgress() {
  const [played, setPlayed] = useState<string[]>([]);

  useEffect(() => {
    const update = () => setPlayed(DAILY_GAME_SLUGS.filter(hasPlayedToday));
    update();
    window.addEventListener(DAILY_PROGRESS_UPDATE_EVENT, update);
    return () => window.removeEventListener(DAILY_PROGRESS_UPDATE_EVENT, update);
  }, []);

  return (
    <div className="flex gap-2 justify-center my-3">
      {DAILY_GAME_SLUGS.map((slug) => (
        <Link key={slug} href={`/${slug}`}
          className={`w-3 h-3 rounded-full transition-colors ${played.includes(slug) ? "bg-green-400" : "bg-white/20 hover:bg-white/40"}`}
          title={slug}
        />
      ))}
    </div>
  );
}
