import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import DailyGameGuard from "@/components/DailyGameGuard";
import DailyProgress from "@/components/DailyProgress";
import BackToAllGames from "@/components/BackToAllGames";
import GamePageBackground from "@/components/GamePageBackground";
import GameSchema from "@/components/seo/GameSchema";

const SLUG = "description";

export function generateMetadata(): Metadata {
  return {
    title: "Guess the Card by Description | Mergedle",
    description: "Read the in-game description and guess which Merge Tactics card it belongs to. Daily Wordle-style game — free, no login.",
    keywords: ["merge tactics wordle", "guess the card", "mergedle description"],
    alternates: { canonical: `${SITE.url}/${SLUG}` },
    robots: { index: false, follow: false },
    openGraph: { title: "Guess the Card by Description", images: [{ url: "/og/ogimage.png" }] },
  };
}

const FAQS = [
  { question: "How do I play Description mode?", answer: "Read the card's in-game description and type a card name to guess which card it is." },
  { question: "How many guesses do I get?", answer: "Unlimited — try to get it in as few as possible!" },
  { question: "When does it reset?", answer: "Every day at midnight UTC." },
];

export default function DescriptionPage() {
  return (
    <GamePageBackground>
      <GameSchema slug={SLUG} title="Guess the Card by Description" description="Read the card description and guess which Merge Tactics card it is" faqs={FAQS} />
      <BackToAllGames />
      <DailyProgress currentSlug="description" />
      <h1 className="font-game text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-center mt-6">Description</h1>
      <h2 className="font-game text-center text-white/70 mb-4 text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">Guess the Card</h2>
      <DailyGameGuard slug={SLUG} />
    </GamePageBackground>
  );
}
