import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import DailyGameGuard from "@/components/DailyGameGuard";
import DailyProgress from "@/components/DailyProgress";
import BackToAllGames from "@/components/BackToAllGames";
import GamePageBackground from "@/components/GamePageBackground";
import GameSchema from "@/components/seo/GameSchema";
import HowToPlayModal from "@/components/HowToPlayModal";
import { StreakBadge } from "@/components/StreakBadge";
import { CommunityStatsPanelWrapper } from "@/components/stats/CommunityStatsPanelWrapper";
import Link from "next/link";

const SLUG = "pixel";

export function generateMetadata(): Metadata {
  return {
    title: "Merge Tactics Pixel Quiz | Guess the Pixelated Card Image",
    description: "Guess today's Merge Tactics card/ruler from a pixelated card image. Each wrong guess reveals more - how many tries will you need?",
    keywords: ["merge tactics pixel", "guess the card or ruler image", "mergedle pixel"],
    alternates: { canonical: `${SITE.url}/${SLUG}` },
    openGraph: { title: "Merge Tactics Pixel Quiz | Mergedle", description: "Identify the daily Merge Tactics card or ruler from its pixelated image. Each wrong guess reveals more detail - free, no login.", images: [{ url: `${SITE.url}/og/ogimage.webp`, width: 1200, height: 630 }] },
  };
}

const FAQS = [
  { question: "How do I play Merge Tactics Pixel Card?", answer: "A card or ruler image is shown heavily pixelated. Each wrong guess reduces the pixelization, revealing more of the image." },
  { question: "When does the game reset?", answer: "Every day at midnight UTC. A new card is selected for all players worldwide." },
];

export default function PixelPage() {
  return (
    <GamePageBackground>
      <GameSchema slug={SLUG} title="Merge Tactics Pixel Quiz" description="Guess the daily Merge Tactics card from a pixelated card image" faqs={FAQS} />

      {/* Nav row */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <BackToAllGames />
        <div className="flex items-end gap-2">
          <div className="-translate-y-1"><StreakBadge inline /></div>
          <HowToPlayModal triggerAriaLabel="How to Play Merge Tactics Pixel Quiz">
          <h2 id="how-to-play-title" className="mb-2 text-base font-semibold text-white">
            How it works
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li><strong className="text-white">Pixelated image</strong> - the card or ruler starts heavily pixelated.</li>
            <li><strong className="text-white">Each wrong guess</strong> reduces the pixelization, revealing more detail.</li>
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
            <li><Link href="/classic" className="text-indigo-400 hover:underline">Classic Wordle</Link></li>
            <li><Link href="/skin" className="text-indigo-400 hover:underline">Skin Quiz</Link></li>
            <li><Link href="/description" className="text-indigo-400 hover:underline">Description Quiz</Link></li>
          </ul>
        </HowToPlayModal>
        </div>
      </div>

      <DailyProgress currentSlug="pixel" />
      <CommunityStatsPanelWrapper gameSlug="pixel" />
      <h1 className="font-game text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-center mt-6">Merge Tactics Pixel Quiz</h1>
      <h2 className="font-game mb-6 text-center text-lg text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">Can you guess the card or ruler from its pixelated version?</h2>
      <DailyGameGuard slug={SLUG} />
    </GamePageBackground>
  );
}
