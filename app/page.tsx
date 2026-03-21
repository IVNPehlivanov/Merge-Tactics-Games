import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import HomeInfographic from "@/components/HomeInfographic";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Mergedle — Daily Merge Tactics Wordle Games",
  description: "Daily Wordle-style Merge Tactics games. Guess the Card, Skin, and more. Free, no login.",
  alternates: { canonical: SITE.url },
  openGraph: {
    description: "Daily Wordle-style Merge Tactics games. Guess the Card, Skin, and more. Free, no login.",
    images: [{ url: `${SITE.url}/og/ogimage.png`, width: 1200, height: 630 }],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  name: "Mergedle",
  url: SITE.url,
  description: "Daily Wordle-style Merge Tactics games. Free, no login required.",
  inLanguage: "en",
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      {/* Background */}
      <link rel="preload" href="/homepage/March_Season_-_Dagger_Duchess_Skin_Color_v1.webp" as="image" />
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

        {/* More Games */}
        <div className="mt-8 mb-6 w-full px-4 text-center">
          <div className="w-full rounded-2xl border-2 border-yellow-500/60 bg-black/70 p-5">
            <p className="text-green-400 font-game text-base mb-1">Want more?</p>
            <p className="text-white font-game text-sm mb-5">Play our other games:</p>
            <div className="flex justify-start gap-6">
              <a
                href="https://royaledly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 transition-transform hover:scale-110"
              >
                <Image
                  src="/homepage/royaledlyLogo.webp"
                  alt="Royaledly"
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] rounded-full object-contain drop-shadow-lg"
                />
                <span className="text-white/80 font-game text-[11px]">Royaledly</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
