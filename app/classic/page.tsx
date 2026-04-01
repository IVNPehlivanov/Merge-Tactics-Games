import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import DailyGameGuard from "@/components/DailyGameGuard";
import DailyProgress from "@/components/DailyProgress";
import BackToAllGames from "@/components/BackToAllGames";
import GamePageBackground from "@/components/GamePageBackground";
import GameSchema from "@/components/seo/GameSchema";
import HowToPlayModal from "@/components/HowToPlayModal";
import { StreakBadge } from "@/components/StreakBadge";
import Link from "next/link";

const SLUG = "classic";

export function generateMetadata(): Metadata {
  return {
    title: "Merge Tactics Wordle | Guess the Daily Card",
    description: "Guess today's mystery Merge Tactics Card from stat clues. Daily Wordle-style game - free, no login.",
    keywords: ["merge tactics wordle", "guess the card", "mergedle"],
    alternates: { canonical: `${SITE.url}/${SLUG}` },
    openGraph: { title: "Merge Tactics Wordle", description: "Guess the daily Merge Tactics card from stat clues. Rarity, Elixir Cost, Traits, Type, and Release Year - free, no login.", images: [{ url: `${SITE.url}/og/ogimage.webp`, width: 1200, height: 630 }] },
  };
}

const FAQS = [
  { question: "How do I play Merge Tactics Wordle?", answer: "Type any card name to guess. Each guess reveals whether the mystery card matches on 8 attributes: Rarity, Elixir Cost, Primary Trait, Secondary Trait, Type, Hit Speed, Speed, and Release Year." },
  { question: "When does the game reset?", answer: "Every day at midnight UTC. A new card is selected for all players worldwide." },
];

export default function ClassicPage() {
  return (
    <GamePageBackground>
      <GameSchema slug={SLUG} title="Merge Tactics Wordle" description="Guess the daily Merge Tactics card from stat clues" faqs={FAQS} />

      {/* Nav row */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <BackToAllGames />
        <div className="flex items-end gap-2">
          <div className="-translate-y-1"><StreakBadge inline /></div>
          <HowToPlayModal triggerAriaLabel="How to Play Merge Tactics Wordle">
          <h2 id="how-to-play-title" className="mb-2 text-base font-semibold text-white">
            How it works
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li><strong className="text-white">Green boxes</strong> - an exact match on that attribute.</li>
            <li><strong className="text-white">Red boxes</strong> - not a match on that attribute.</li>
            <li><strong className="text-white">Arrows (↑ / ↓)</strong> - the correct value is higher or lower than your guess for numeric fields (Rarity, Elixir, Year, Hit Speed, Speed).</li>
            <li><strong className="text-white">Attributes:</strong> Rarity, Elixir Cost, Primary Trait, Secondary Trait, Type, Hit Speed, Speed, and Release Year.</li>
            <li><strong className="text-white">Unlimited guesses</strong> - you have an unlimited amount of wrong guesses until you get it right.</li>
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
            <li><Link href="/pixel" className="text-indigo-400 hover:underline">Pixel Quiz</Link></li>
            <li><Link href="/skin" className="text-indigo-400 hover:underline">Skin Quiz</Link></li>
            <li><Link href="/description" className="text-indigo-400 hover:underline">Description Quiz</Link></li>
          </ul>
        </HowToPlayModal>
        </div>
      </div>

      <DailyProgress currentSlug="classic" />
      <h1 className="font-game text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-center mt-6">Merge Tactics Wordle</h1>
      <h2 className="font-game mb-6 text-center text-lg text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">Guess the Daily Card</h2>
      <p className="font-game -mt-4 mb-6 text-center text-sm text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">Current Season Cards and Stats</p>
      <DailyGameGuard slug={SLUG} />
    </GamePageBackground>
  );
}
