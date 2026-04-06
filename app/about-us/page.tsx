import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import BackToAllGames from "@/components/BackToAllGames";

const TITLE = "About Mergedle | Daily Merge Tactics Puzzle Games";
const DESCRIPTION =
  "Learn about Mergedle, the free daily Merge Tactics puzzle hub with 4 Wordle-style mini-games. Built by fans, for the community. No account required.";

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
      images: [{ url: `${SITE.url}/og/ogimage.webp`, width: 1200, height: 630 }],
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
            Mergedle offers daily browser-based guessing games where you can test your knowledge of
            Clash Royale Merge Tactics. All game state like your streak and your daily progress lives in
            your browser&apos;s local storage.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">The 4 Game Modes</h2>
          <ul className="space-y-3">
            <li>
              <strong className="text-white">Classic Wordle:</strong> Guess the daily card by using stat
              clues - Elixir Cost, Primary Trait, Secondary Trait, Type, Hit Speed, Speed and Release Year.
              Green means it&apos;s an exact match. Arrows point higher or lower to the correct value on some
              of the fields.
            </li>
            <li>
              <strong className="text-white">Pixel Quiz:</strong> Guess the card or ruler from its
              pixelated version. The image starts heavily blurred and gets clearer with each wrong guess.
            </li>
            <li>
              <strong className="text-white">Skin Quiz:</strong> Guess the skin from a zoomed grayscale
              image. The image starts heavily zoomed in and zooms out more with each wrong guess.
            </li>
            <li>
              <strong className="text-white">Description Quiz:</strong> Guess the card or ruler by its
              cut-off description. Each wrong guess reveals another word.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-3">Contact &amp; Feedback</h2>
          <p>
            Mergedle is built and maintained by a small team. We read every message we receive. If you
            have a bug report or a suggestion, you can reach out at{" "}
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="text-[#00B9E7] no-underline transition-colors duration-200 hover:text-[#4ddbff] [text-shadow:0_2px_4px_rgba(0,0,0,0.85),0_1px_2px_rgba(0,0,0,0.95)]"
            >
              {SITE.contactEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
