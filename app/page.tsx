import type { Metadata } from "next";
import { SITE, GAME_META } from "@/lib/content";
import HomeInfographic from "@/components/HomeInfographic";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Mergedle — Daily Merge Tactics Wordle Games",
  description: "Daily Wordle-style Merge Tactics games. Guess the Tactician, Skin, and more. Free, no login.",
  alternates: { canonical: SITE.url },
  openGraph: { images: [{ url: "/og/defaultogimage.webp" }] },
};

export default function HomePage() {
  const activeDailyCount = GAME_META.filter((g) => !g.comingSoon && g.mode === "daily").length;
  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-x-hidden">
      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/homepage/background.webp')" }} />
      <div className="fixed inset-0 bg-black/60" />
      <div className="relative z-10 w-full">
        <Header isHome />
        <section className="flex flex-col items-center justify-center pt-20 pb-10 px-4 text-center">
          <h1 className="font-game text-5xl md:text-7xl homepage-text-shadow text-indigo-400 mb-3">
            Mergedle
          </h1>
          <p className="text-lg md:text-2xl text-white/90 homepage-text-shadow max-w-xl">
            Daily Merge Tactics Wordle Games
          </p>
          <p className="mt-2 text-sm text-white/60">
            {activeDailyCount} daily games · resets at midnight UTC
          </p>
        </section>
        <HomeInfographic />
      </div>
    </main>
  );
}
