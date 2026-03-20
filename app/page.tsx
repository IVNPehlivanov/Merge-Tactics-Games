import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import HomeInfographic from "@/components/HomeInfographic";
import Image from "next/image";

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
      <div className="fixed inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center">
        {/* Logo */}
        <div className="text-center pt-10 pb-7 px-4">
          <h1 className="sr-only">Mergedle</h1>
          <Image
            src="/game_logos/mergedlelogo.webp"
            alt="Mergedle"
            width={240}
            height={90}
            className="mx-auto w-52 h-auto drop-shadow-xl"
            priority
          />
        </div>

        {/* Game cards */}
        <HomeInfographic />

      </div>
    </main>
  );
}
