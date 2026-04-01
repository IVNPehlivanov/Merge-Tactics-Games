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
    images: [{ url: `${SITE.url}/og/ogimage.webp`, width: 1200, height: 630 }],
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
    <main className="relative min-h-screen flex flex-col items-center overflow-x-clip">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      {/* Background */}
      <link rel="preload" href="/homepage/March_Season_-_Dagger_Duchess_Skin_Color_v1.webp" as="image" />
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/homepage/March_Season_-_Dagger_Duchess_Skin_Color_v1.webp')" }}
      />
      <div className="fixed inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center">
        {/* Title + logo */}
        <div className="w-full px-4 pt-8 text-center sm:pt-10">
          <h1 className="font-game text-center text-2xl leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-3xl">
            Merge Tactics Wordle
          </h1>
          <h2 className="font-game mx-auto mt-2 max-w-lg text-center text-pretty text-sm leading-snug text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-base">
            Guess the Clash Royale Merge Tactics card mini-game
          </h2>
          <div className="pb-6 pt-6">
            <Image
              src="/game_logos/mergedlelogo.webp"
              alt="Mergedle"
              width={240}
              height={90}
              className="mx-auto h-auto w-52 drop-shadow-xl"
              priority
            />
          </div>
        </div>

        {/* Game cards */}
        <HomeInfographic />

        {/* More Games */}
        <div className="mt-8 mb-6 w-full px-4 text-center">
          <div className="w-full rounded-2xl border-2 border-yellow-500/60 bg-black/70 px-5 py-4">
            <div className="flex flex-col items-center gap-0">
              <div className="relative z-0 w-full text-center">
                <p className="mb-0 text-green-400 font-game text-base leading-tight">Want more?</p>
                <p className="mb-0 mt-0.5 text-white font-game text-sm leading-tight">
                  Play our other games:
                </p>
              </div>
              <div className="relative z-10 -mt-5 flex w-full justify-center">
                <a
                  href="https://royaledly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-0 transition-transform hover:scale-110"
                >
                  <Image
                    src="/homepage/royaledlyLogo.webp"
                    alt="Royaledly"
                    width={168}
                    height={168}
                    className="relative z-10 block h-[168px] w-[168px] shrink-0 rounded-full object-contain drop-shadow-lg"
                  />
                  <span className="relative z-0 -mt-4 text-white/80 font-game text-xs">
                    Royaledly
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
