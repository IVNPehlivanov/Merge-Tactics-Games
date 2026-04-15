import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import HomeInfographic from "@/components/HomeInfographic";
import { StreakBadge } from "@/components/StreakBadge";
import HowToPlayModal from "@/components/HowToPlayModal";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Merge Tactics Wordle | Card Guessing Games | Mergedle",
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
          <div className="relative flex w-full items-center justify-center">
            <div className="absolute -left-4 top-0"><StreakBadge inline /></div>
            <h1 className="font-game text-center text-2xl leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] sm:text-3xl">
              Merge Tactics Wordle
            </h1>
            <div className="absolute -right-4 top-2">
              <HowToPlayModal triggerAriaLabel="How to play Mergedle">
                <div className="text-left">
                  <h2 id="how-to-play-title" className="mb-2 text-base font-semibold text-white">
                    What is Mergedle?
                  </h2>
                  <p className="text-sm text-slate-300">
                    Mergedle is a collection of free daily Wordle-style mini-games based on Merge Tactics cards. A new puzzle is available every day at midnight UTC - no login required.
                  </p>

                  <h3 className="mb-2 mt-6 text-base font-semibold text-white">Game Modes</h3>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
                    <li><Link href="/classic" className="font-medium text-indigo-400 hover:underline">Classic Wordle</Link> - guess the mystery card from stat clues. Green = match, red = no match, arrows = higher/lower.</li>
                    <li><Link href="/pixel" className="font-medium text-indigo-400 hover:underline">Pixel Quiz</Link> - identify the card from a pixelated image that gets clearer with each wrong guess.</li>
                    <li><Link href="/skin" className="font-medium text-indigo-400 hover:underline">Skin Quiz</Link> - guess which ruler the skin belongs to from its cosmetic image.</li>
                    <li><Link href="/description" className="font-medium text-indigo-400 hover:underline">Description Quiz</Link> - guess the card from its in-game description text, revealed word by word.</li>
                  </ul>

                  <h3 className="mb-2 mt-6 text-base font-semibold text-white">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-white">When does the daily puzzle reset?</p>
                      <p className="text-sm text-slate-300">Every day at midnight UTC. Everyone worldwide gets the same card.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Do I need an account?</p>
                      <p className="text-sm text-slate-300">No - all progress is saved locally in your browser. No sign-up required.</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">How many guesses do I get?</p>
                      <p className="text-sm text-slate-300">Unlimited. Keep guessing until you find the right card.</p>
                    </div>
                  </div>
                </div>
              </HowToPlayModal>
            </div>
          </div>
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
