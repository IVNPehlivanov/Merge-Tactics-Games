"use client";
import Link from "next/link";
import { GAME_META } from "@/lib/content";

const BTN_BG = "url('/homepage/buttons.jpg')";

export default function HomeInfographic() {
  return (
    <section className="w-full max-w-sm mx-auto px-4 pb-6 flex flex-col gap-3" aria-label="Game modes">
      <p className="text-center text-white/60 text-xs uppercase tracking-widest font-semibold mb-1">
        Choose a gamemode
      </p>

      {GAME_META.map((game) =>
        game.comingSoon ? (
          <div
            key={game.slug}
            className="relative flex items-center cursor-not-allowed select-none"
            style={{ height: 80 }}
          >
            <div
              className="absolute inset-0 grayscale opacity-40"
              style={{ backgroundImage: BTN_BG, backgroundSize: "100% 100%" }}
            />
            <div className="relative flex items-center w-full px-3">
              {/* circle slot */}
              <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                <span className="text-white/30 text-2xl font-bold">?</span>
              </div>
              {/* text */}
              <div className="ml-3">
                <p className="font-game text-white/30 text-base leading-tight">Coming Soon</p>
                <p className="text-white/25 text-xs mt-0.5">New game mode</p>
              </div>
            </div>
          </div>
        ) : (
          <Link
            key={game.slug}
            href={`/${game.slug}`}
            className="relative flex items-center group"
            style={{ height: 80 }}
          >
            <div
              className="absolute inset-0 transition-brightness duration-150 group-hover:brightness-110"
              style={{ backgroundImage: BTN_BG, backgroundSize: "100% 100%" }}
            />
            <div className="relative flex items-center w-full px-3">
              {/* circle slot — left area of button image */}
              <div className="flex-shrink-0 w-14 h-14" />
              {/* text on the dark panel */}
              <div className="ml-3 min-w-0">
                <p className="font-game text-amber-400 text-lg leading-tight drop-shadow group-hover:text-amber-300 transition-colors">
                  {game.title}
                </p>
                <p className="text-white/70 text-xs mt-0.5 leading-snug">{game.description}</p>
              </div>
            </div>
          </Link>
        )
      )}
    </section>
  );
}
