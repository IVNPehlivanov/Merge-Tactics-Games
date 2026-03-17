import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import DailyGameGuard from "@/components/DailyGameGuard";
import DailyProgress from "@/components/DailyProgress";
import BackToAllGames from "@/components/BackToAllGames";
import GamePageBackground from "@/components/GamePageBackground";
import GameSchema from "@/components/seo/GameSchema";
import Link from "next/link";

const SLUG = "classic";

export function generateMetadata(): Metadata {
  return {
    title: "Merge Tactics Wordle | Guess the Daily Tactician",
    description: "Guess today's mystery Merge Tactics tactician from stat clues. Daily Wordle-style game — free, no login.",
    keywords: ["merge tactics wordle", "guess the tactician", "mergedle"],
    alternates: { canonical: `${SITE.url}/${SLUG}` },
    openGraph: { title: "Merge Tactics Wordle", images: [{ url: "/og/defaultogimage.webp" }] },
  };
}

const FAQS = [
  { question: "How do I play Merge Tactics Wordle?", answer: "Type any tactician name to guess. Each guess reveals whether the mystery tactician matches on elixir cost, primary trait, secondary trait, type, and release year." },
  { question: "How many guesses do I get?", answer: "Unlimited guesses — but try to solve it in as few as possible to build your streak!" },
  { question: "What clues does it give?", answer: "5 attributes: Elixir Cost (with higher/lower arrows), Primary Trait, Secondary Trait, Type, and Release Year. Green = correct match, arrows = higher or lower for numeric fields." },
  { question: "When does the puzzle reset?", answer: "Every day at midnight UTC. A new tactician is selected for all players worldwide." },
];

export default function ClassicPage() {
  return (
    <GamePageBackground>
      <GameSchema slug={SLUG} title="Merge Tactics Wordle" description="Guess the daily Merge Tactics tactician from stat clues" faqs={FAQS} />
      <BackToAllGames />
      <DailyProgress />
      <h1 className="font-game text-3xl text-indigo-400 text-center mt-6">Merge Tactics Wordle</h1>
      <h2 className="text-center text-white/70 mb-4 text-lg">Guess the Daily Tactician</h2>
      <DailyGameGuard slug={SLUG} />

      {/* SSR content for SEO */}
      <section className="mt-16 space-y-8 text-white/70 text-sm leading-relaxed">
        <div>
          <h2 className="text-white font-semibold text-base mb-2">How to Play</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Type a Merge Tactics tactician name into the search box.</li>
            <li>Each guess reveals 5 attributes compared to the mystery tactician.</li>
            <li>Green means an exact match. Arrows (↑↓) mean the real value is higher or lower.</li>
            <li>Use the clues to narrow down your guess — no limit on attempts.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-white font-semibold text-base mb-2">About Classic Mode</h2>
          <p>Classic Wordle is the original Mergedle game mode. Every day a new Merge Tactics tactician is selected from the pool. Your guesses reveal stat clues — elixir cost, primary trait, secondary trait, type, and release year — helping you zero in on the answer.</p>
        </div>
        <div>
          <h2 className="text-white font-semibold text-base mb-3">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.question}>
                <h3 className="text-white/90 font-medium">{f.question}</h3>
                <p>{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-white font-semibold text-base mb-2">More Games</h2>
          <ul className="space-y-1">
            <li><Link href="/pixel" className="text-indigo-400 hover:underline">Pixel Card — guess from a blurred image</Link></li>
            <li><Link href="/skin" className="text-indigo-400 hover:underline">Guess the Skin — identify the tactician from a skin</Link></li>
          </ul>
        </div>
      </section>
    </GamePageBackground>
  );
}
