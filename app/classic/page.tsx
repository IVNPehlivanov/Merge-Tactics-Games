import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import DailyGameGuard from "@/components/DailyGameGuard";
import DailyProgress from "@/components/DailyProgress";
import BackToAllGames from "@/components/BackToAllGames";
import GamePageBackground from "@/components/GamePageBackground";
import GameSchema from "@/components/seo/GameSchema";
import HowToPlayModal from "@/components/HowToPlayModal";
import Link from "next/link";

const SLUG = "classic";

export function generateMetadata(): Metadata {
  return {
    title: "Merge Tactics Wordle | Guess the Daily Card",
    description: "Guess today's mystery Merge Tactics Card from stat clues. Daily Wordle-style game — free, no login.",
    keywords: ["merge tactics wordle", "guess the card", "mergedle"],
    alternates: { canonical: `${SITE.url}/${SLUG}` },
    openGraph: { title: "Merge Tactics Wordle", description: "Guess the daily Merge Tactics card from stat clues. Rarity, Elixir Cost, Traits, Type, and Release Year - free, no login.", images: [{ url: `${SITE.url}/og/ogimage.png`, width: 1200, height: 630 }] },
  };
}

const FAQS = [
  { question: "How do I play Merge Tactics Wordle?", answer: "Type any card name to guess. Each guess reveals whether the mystery card matches on 6 attributes: Rarity, Elixir Cost, Primary Trait, Secondary Trait, Type, and Release Year." },
  { question: "How many guesses do I get?", answer: "Unlimited guesses — but try to solve it in as few as possible to build your streak!" },
  { question: "What clues does it give?", answer: "6 attributes: Rarity, Elixir Cost (with higher/lower arrows), Primary Trait, Secondary Trait, Type, and Release Year. Green = correct match, arrows = higher or lower for numeric fields." },
  { question: "When does the puzzle reset?", answer: "Every day at midnight UTC. A new card is selected for all players worldwide." },
];

export default function ClassicPage() {
  return (
    <GamePageBackground>
      <GameSchema slug={SLUG} title="Merge Tactics Wordle" description="Guess the daily Merge Tactics card from stat clues" faqs={FAQS} />

      {/* Nav row */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <BackToAllGames />
        <HowToPlayModal triggerAriaLabel="How to Play Merge Tactics Wordle">
          <h2 id="how-to-play-title" className="mb-4 text-xl font-bold text-white">
            How to Play Classic Wordle
          </h2>
          <p className="text-sm text-slate-300">
            Guess the secret Merge Tactics card. You have unlimited tries — type a name to begin.
          </p>

          <h3 className="mb-2 mt-4 text-base font-semibold text-white">How it works</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li><strong className="text-white">Start anywhere</strong> — type any card name to make your first guess.</li>
            <li><strong className="text-white">Green boxes</strong> — an exact match on that attribute.</li>
            <li><strong className="text-white">Arrows (↑ / ↓)</strong> — the secret value is higher or lower than your guess for numeric fields (Rarity, Elixir, Year).</li>
            <li><strong className="text-white">Attributes:</strong> Rarity, Elixir Cost, Primary Trait, Secondary Trait, Type, and Release Year.</li>
            <li><strong className="text-white">Unlimited guesses</strong> — guessing in fewer attempts builds a better streak.</li>
          </ul>

          <p className="mt-4 text-sm text-slate-300">
            A new card is chosen every day at midnight UTC. Come back daily to keep your streak alive!
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
            <li><Link href="/pixel" className="text-indigo-400 hover:underline">Pixel Card — guess from a blurred image</Link></li>
            <li><Link href="/skin" className="text-indigo-400 hover:underline">Guess the Skin — identify the card from a skin</Link></li>
          </ul>
        </HowToPlayModal>
      </div>

      <DailyProgress currentSlug="classic" />
      <h1 className="font-game text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-center mt-6">Merge Tactics Wordle</h1>
      <h2 className="font-game text-center text-white/70 mb-6 text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">Guess the Daily Card</h2>
      <DailyGameGuard slug={SLUG} />
    </GamePageBackground>
  );
}
