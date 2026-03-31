"use client";
import Link from "next/link";
import { GAME_META } from "@/lib/content";

export default function HomeInfographic() {
  const activeGames = GAME_META.filter((game) => !game.comingSoon);

  return (
    <section className="w-full max-w-sm mx-auto px-4 pb-6 flex flex-col gap-2" aria-label="Game modes">
      {activeGames.map((game) => (
        <Link
          key={game.slug}
          href={`/${game.slug}`}
          className="group relative block overflow-visible"
        >
            <img src="/homepage/buttons.webp" alt="" className="w-full h-auto block group-hover:brightness-110 transition-all" aria-hidden="true" />
            <div
              className="absolute flex flex-col items-center justify-center px-1"
              style={{ left: "18%", right: "4%", top: "6%", bottom: "10%" }}
            >
              <p className="font-supercell text-center text-lg leading-tight text-amber-400 drop-shadow-md transition-colors group-hover:text-amber-300">
                {game.homeTitle ?? game.title}
              </p>
            </div>
        </Link>
      ))}
    </section>
  );
}
