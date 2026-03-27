"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DAILY_GAME_SLUGS, hasPlayedToday, DAILY_PROGRESS_UPDATE_EVENT } from "@/lib/daily";
import { getGameLogoPath, getGameMetaBySlug } from "@/lib/content";

export default function DailyProgress({ currentSlug }: { currentSlug?: string }) {
  const [played, setPlayed] = useState<string[]>([]);

  useEffect(() => {
    const update = () => setPlayed(DAILY_GAME_SLUGS.filter(hasPlayedToday));
    update();
    window.addEventListener(DAILY_PROGRESS_UPDATE_EVENT, update);
    return () => window.removeEventListener(DAILY_PROGRESS_UPDATE_EVENT, update);
  }, []);

  const total = DAILY_GAME_SLUGS.length;
  const doneCount = played.length;
  const progressPct = Math.round((doneCount / total) * 100);

  return (
    <div
      className="rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 px-5 py-4 my-3 w-full max-w-md mx-auto"
      style={{
        maxWidth: "28rem",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "0.75rem",
        marginBottom: "0.75rem",
        padding: "1rem 1.25rem",
        borderRadius: "0.75rem",
        border: "1px solid rgba(255,255,255,0.12)",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <h3
        className="font-supercell text-white text-center text-base mb-4"
        style={{ textAlign: "center", color: "#fff", marginBottom: "1rem", fontSize: "1rem" }}
      >
        Daily Progress
      </h3>

      <div
        className="grid grid-cols-4 gap-2 justify-items-center"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "0.5rem",
          alignItems: "start",
          justifyItems: "center",
        }}
      >
        {DAILY_GAME_SLUGS.map((slug) => {
          const isDone = played.includes(slug);
          const isCurrent = slug === currentSlug;
          const title = getGameMetaBySlug(slug)?.title ?? slug;
          return (
            <Link
              key={slug}
              href={`/${slug}`}
              className={`flex min-w-0 w-full max-w-full flex-col items-center gap-1.5 transition-transform hover:scale-105 ${isDone || isCurrent ? "opacity-100" : "opacity-75 hover:opacity-95"}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.375rem",
                minWidth: 0,
                width: "100%",
                maxWidth: "100%",
              }}
            >
              <div className={`relative rounded-lg p-0.5 transition-all ${isCurrent ? "drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]" : ""}`}>
                <img
                  src={getGameLogoPath(slug)}
                  alt={title}
                  className="h-16 w-auto object-contain"
                  style={{ maxHeight: 64, width: "auto", maxWidth: "100%", objectFit: "contain", display: "block" }}
                />
                {isDone && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-400 text-[0.55rem] font-bold text-white shadow">
                    ✓
                  </span>
                )}
              </div>
              <span
                className={`break-words text-center text-xs font-semibold leading-tight text-white ${isCurrent ? "drop-shadow-[0_0_8px_rgba(251,191,36,0.65)]" : ""}`}
                style={{ textAlign: "center", fontSize: "0.75rem", color: "#fff", lineHeight: 1.25, overflowWrap: "anywhere" }}
              >
                {title.replace(" Wordle", "")}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-4 space-y-1.5">
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #3b82f6, #10b981)",
            }}
          />
        </div>
        <p className="text-center text-xs font-semibold text-white">
          {doneCount} / {total} completed
        </p>
      </div>
    </div>
  );
}
