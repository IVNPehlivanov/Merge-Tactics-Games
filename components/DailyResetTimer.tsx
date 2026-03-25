"use client";
import { useEffect, useState } from "react";
import { getNextMidnightUTC } from "@/lib/daily";

export default function DailyResetTimer() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const tick = () => {
      const diff = getNextMidnightUTC().getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("Resetting…"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="text-white text-sm font-game">Next puzzle in {timeLeft}</span>;
}
