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
    description: "Read the in-game description and guess which Merge Tactics card it belongs to. Daily Wordle-style game - free, no login.",
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
    question: "How do I play Merge Tactics Description Quiz?",
    answer:
      "Part of the in-game description is shown. Each wrong guess reveals one more random word from the description of the card or ruler.",
  },
  { question: "When does the game reset?", answer: "Every day at midnight UTC. A new description is selected for all players worldwide." },
];

export default function DescriptionPage() {
  return (
    <GamePageBackground>
      <GameSchema slug={SLUG} title="Merge Tactics Description Quiz" description="Read the card description and guess which Merge Tactics card it is" faqs={FAQS} />

      {/* Nav row */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <BackToAllGames />
        <HowToPlayModal triggerAriaLabel="How to Play Merge Tactics Description Quiz">
          <h2 id="how-to-play-title" className="mb-2 text-base font-semibold text-white">
            How it works
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>
              <strong className="text-white">Cut-off text</strong> - many words are hidden at first; you only see a slice of the description.
            </li>
            <li>
              <strong className="text-white">More words over time</strong> - roughly 25% of words are visible to start; each wrong guess reveals one more word.
            </li>
            <li>
              <strong className="text-white">Unlimited guesses</strong> - you have an unlimited amount of wrong guesses until you get it right.
            </li>
          </ul>

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
            <li><Link href="/classic" className="text-indigo-400 hover:underline">Classic Wordle</Link></li>
            <li><Link href="/pixel" className="text-indigo-400 hover:underline">Pixel Quiz</Link></li>
            <li><Link href="/skin" className="text-indigo-400 hover:underline">Skin Quiz</Link></li>
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
