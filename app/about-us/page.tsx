import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import BackToAllGames from "@/components/BackToAllGames";

const TITLE = "About Mergedle | Daily Merge Tactics Puzzle Games";
const DESCRIPTION =
  "Learn about Mergedle, the free daily Merge Tactics puzzle hub with 3 Wordle-style mini-games. Built by fans, for the community. No account required.";

export function generateMetadata(): Metadata {
  return {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    alternates: { canonical: `${SITE.url}/about-us` },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE.url}/about-us`,
      siteName: SITE.name,
      type: "website",
      images: [{ url: `${SITE.url}/og/ogimage.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
    },
  };
}

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 text-white">
      <div className="mb-6">
        <BackToAllGames />
      </div>
      <h1 className="text-3xl font-bold mb-6 text-indigo-400 font-game">About Mergedle</h1>

      <div className="space-y-6 text-white/80 leading-relaxed text-sm">

        <section className="space-y-4">
          <p>
            Mergedle is a free daily puzzle hub for Merge Tactics fans. We built it because
            we play Merge Tactics and wanted a daily challenge that goes beyond the game itself
            — something that tests your card knowledge, your memory of artwork, and your grasp
            of card stats. The result is 3 different mini-games, each approaching the same idea
            from a different angle, with more modes on the way.
          </p>
          <p>
            The site runs entirely in your browser. No ads, no sponsored content, no account
            required. All game state — your streak, your daily progress, your stats — lives in
            your browser&apos;s local storage. Nothing is sent to a server.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">The 3 Game Modes</h2>
          <ul className="space-y-3">
            <li>
              <strong className="text-white">Classic Wordle:</strong> Guess the daily card
              using stat clues — Elixir Cost, Primary Trait, Secondary Trait, Type, and
              Release Year. Green means an exact match. Arrows point higher or lower for
              numeric fields. Unlimited guesses, one new card per day.
            </li>
            <li>
              <strong className="text-white">Pixel Card:</strong> Identify the card from its
              pixelated artwork. The image starts heavily blurred and gets clearer with each
              wrong guess. The earlier you get it, the better your score.
            </li>
            <li>
              <strong className="text-white">Guess the Skin:</strong> A Merge Tactics skin is
              shown — your job is to name which card owns it. Pure cosmetic knowledge, no stat
              clues, no blur. Either you know it or you don&apos;t.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">How It Works</h2>
          <p>
            Daily puzzles are seeded by UTC date, so every player worldwide sees the same card
            each day. Puzzles reset at midnight UTC. All 3 modes are free and run entirely in
            the browser — there is no backend and no user accounts. Your streak and game history
            are stored in your browser&apos;s localStorage. Clearing browser data will reset
            your progress.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">Contact &amp; Feedback</h2>
          <p>
            Mergedle is built and maintained by a small team of Merge Tactics players. We read
            every message we receive. If you have a bug report, a suggestion, or just want to
            say the Skin puzzle stumped you, reach out at{" "}
            <a href={`mailto:${SITE.contactEmail}`} className="text-indigo-400 hover:text-indigo-300 underline">
              {SITE.contactEmail}
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">Disclaimer</h2>
          <p>
            Mergedle is an independent fan site and is not affiliated with, endorsed, sponsored,
            or approved by Supercell Oy. Merge Tactics and all related trademarks and intellectual
            property remain the property of Supercell Oy. This site operates in accordance with
            the{" "}
            <a
              href="https://supercell.com/en/fan-content-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              Supercell Fan Content Policy
            </a>.
          </p>
        </section>

        <div className="pt-6 border-t border-white/10 text-xs text-white/30">
          <p>Merge Tactics content and materials are trademarks and copyrights of Supercell Oy.</p>
        </div>
      </div>
    </main>
  );
}
