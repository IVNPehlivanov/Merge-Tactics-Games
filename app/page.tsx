import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import HomeInfographic from "@/components/HomeInfographic";

export const metadata: Metadata = {
  title: "Mergedle — Daily Merge Tactics Wordle Games",
  description: "Daily Wordle-style Merge Tactics games. Guess the Tactician, Skin, and more. Free, no login.",
  alternates: { canonical: SITE.url },
  openGraph: { images: [{ url: "/og/defaultogimage.webp" }] },
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-x-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/homepage/March_Season_-_Dagger_Duchess_Skin_Color_v1.webp')" }}
      />
      <div className="fixed inset-0 bg-black/25" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center">
        {/* Logo */}
        <div className="text-center pt-10 pb-7 px-4">
          <h1 className="font-game text-6xl homepage-text-shadow text-indigo-400 leading-none">
            Mergedle
          </h1>
          <p className="text-white/60 text-xs uppercase tracking-widest mt-2">
            A Daily Merge Tactics Wordle
          </p>
          <p className="text-amber-400 font-bold text-sm mt-1.5">
            Try all 3 game modes!
          </p>
        </div>

        {/* Game cards */}
        <HomeInfographic />

      </div>
    </main>
  );
}
