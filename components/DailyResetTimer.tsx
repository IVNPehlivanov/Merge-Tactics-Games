"use client";
import { useEffect, useState } from "react";
import { getNextMidnightUTC } from "@/lib/daily";

export default function DailyResetTimer() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const tick = () => {
      const diff = getNextMidnightUTC().getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Resetting…");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-1 text-center font-supercell text-white">
      <span className="text-base leading-tight sm:text-lg">Next puzzle in</span>
      <span className="text-xl font-bold tabular-nums leading-tight tracking-wide sm:text-2xl">
        {timeLeft}
      </span>
    </div>
  );
}
