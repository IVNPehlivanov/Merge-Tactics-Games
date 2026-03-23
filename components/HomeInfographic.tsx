"use client";
import Link from "next/link";
import { GAME_META } from "@/lib/content";

export default function HomeInfographic() {
  const activeGames = GAME_META.filter((game) => !game.comingSoon);

  return (
    <section className="w-full max-w-sm mx-auto px-4 pb-6 flex flex-col gap-2" aria-label="Game modes">
      {activeGames.map((game) => (
        <Link key={game.slug} href={`/${game.slug}`} className="relative group">
            <img src="/homepage/buttons.jpg" alt="" className="w-full h-auto block group-hover:brightness-110 transition-all" aria-hidden="true" />
            <div className="absolute flex items-center justify-center" style={{ left: "20%", right: "4%", top: 0, bottom: 0 }}>
              <p className="font-supercell text-amber-400 text-lg leading-tight drop-shadow-md group-hover:text-amber-300 transition-colors text-center">
                {game.title}
              </p>
            </div>
        </Link>
      ))}
    </section>
  );
}
