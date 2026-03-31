import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/content";
import DailyGameGuard from "@/components/DailyGameGuard";
import DailyProgress from "@/components/DailyProgress";
import BackToAllGames from "@/components/BackToAllGames";
import GamePageBackground from "@/components/GamePageBackground";
import GameSchema from "@/components/seo/GameSchema";
import HowToPlayModal from "@/components/HowToPlayModal";

const SLUG = "description";

export function generateMetadata(): Metadata {
  return {
    title: "Merge Tactics Description Quiz | Mergedle",
    description: "Read the in-game description and guess which Merge Tactics card it belongs to. Daily Wordle-style game — free, no login.",
    keywords: ["merge tactics wordle", "guess the card", "mergedle description"],
    alternates: { canonical: `${SITE.url}/${SLUG}` },
    openGraph: {
      title: "Merge Tactics Description Quiz | Mergedle",
      description: "Read the in-game description and guess which Merge Tactics card it belongs to. Free, no login.",
      images: [{ url: `${SITE.url}/og/ogimage.webp`, width: 1200, height: 630 }],
    },
  };
}

const FAQS = [
  {
    question: "How do I play Description mode?",
    answer:
      "Part of the in-game description is shown. Type a card or ruler name to guess today's answer.",
  },
  {
    question: "Why isn't the full description visible?",
    answer:
      "Many words start hidden. About a quarter are shown at first; each wrong guess reveals one more word until the full text appears.",
  },
  { question: "How many guesses do I get?", answer: "Unlimited — try to get it in as few as possible!" },
  { question: "When does it reset?", answer: "Every day at midnight UTC." },
];

export default function DescriptionPage() {
  return (
    <GamePageBackground>
      <GameSchema slug={SLUG} title="Merge Tactics Description Quiz" description="Read the card description and guess which Merge Tactics card it is" faqs={FAQS} />

      {/* Nav row */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <BackToAllGames />
        <HowToPlayModal triggerAriaLabel="How to Play Merge Tactics Description Quiz">
          <h2 id="how-to-play-title" className="mb-4 text-xl font-bold text-white">
            How to Play Merge Tactics Description Quiz
          </h2>
          <p className="text-sm text-slate-300">
            You see part of an in-game description — guess which card or ruler it belongs to before the full text appears.
          </p>

          <h3 className="mb-2 mt-4 text-base font-semibold text-white">How it works</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>
              <strong className="text-white">Cut-off text</strong> — many words are hidden at first; you only see a slice of the description.
            </li>
            <li>
              <strong className="text-white">More words over time</strong> — roughly 25% of words are visible to start; each wrong guess reveals one more word (same order for everyone that day).
            </li>
            <li>
              <strong className="text-white">Type and guess</strong> — search any troop, building, or ruler name.
            </li>
            <li>
              <strong className="text-white">Unlimited guesses</strong> — fewer guesses means a better score and streak.
            </li>
          </ul>

          <p className="mt-4 text-sm text-slate-300">
            A new description challenge unlocks every day at midnight UTC. Come back daily to keep your streak!
          </p>

          <h3 className="mb-2 mt-6 text-base font-semibold text-white">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.question}>
                <p className="text-sm font-medium text-white">{f.question}</p>
                <p className="text-sm text-slate-300">{f.answer}</p>
              </div>
            ))}
          </div>

          <h3 className="mb-2 mt-6 text-base font-semibold text-white">More Games</h3>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>
              <Link href="/classic" className="text-indigo-400 hover:underline">
                Classic Wordle — guess from stat clues
              </Link>
            </li>
            <li>
              <Link href="/pixel" className="text-indigo-400 hover:underline">
                Merge Tactics Pixel Quiz — guess from a blurred image
              </Link>
            </li>
            <li>
              <Link href="/skin" className="text-indigo-400 hover:underline">
                Skin Quiz — identify the card from a skin
              </Link>
            </li>
          </ul>
        </HowToPlayModal>
      </div>

      <DailyProgress currentSlug="description" />
      <h1 className="font-game text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-center mt-6">Merge Tactics Description Quiz</h1>
      <h2 className="font-game mb-6 text-center text-lg text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">Can you guess the card or ruler by its cut-off description?</h2>
      <DailyGameGuard slug={SLUG} />
    </GamePageBackground>
  );
}
