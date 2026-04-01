import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import DailyGameGuard from "@/components/DailyGameGuard";
import DailyProgress from "@/components/DailyProgress";
import BackToAllGames from "@/components/BackToAllGames";
import GamePageBackground from "@/components/GamePageBackground";
import GameSchema from "@/components/seo/GameSchema";
import HowToPlayModal from "@/components/HowToPlayModal";
import Link from "next/link";

const SLUG = "skin";

export function generateMetadata(): Metadata {
  return {
    title: "Merge Tactics Skin Quiz | Which Card Owns This Skin?",
    description: "A Merge Tactics skin is shown - can you name which card it belongs to? Daily Wordle-style game, free, no login.",
    keywords: ["merge tactics skin wordle", "guess the skin", "mergedle skin"],
    alternates: { canonical: `${SITE.url}/${SLUG}` },
    openGraph: { title: "Merge Tactics Skin Quiz | Mergedle", description: "A ruler's skin is shown zoomed in and grayscale. Guess which skin it is - each wrong answer zooms out further. Free, no login.", images: [{ url: `${SITE.url}/og/ogimage.webp`, width: 1200, height: 630 }] },
  };
}

const FAQS = [
  { question: "How do I play Merge Tactics Skin Quiz?", answer: "A Merge Tactics skin image is displayed. Each wrong guess zooms out more, revealing more of the image." },
  { question: "When does the game reset?", answer: "Every day at midnight UTC. A new skin is selected from the pool for all players worldwide." },
];

export default function SkinPage() {
  return (
    <GamePageBackground>
      <GameSchema slug={SLUG} title="Merge Tactics Skin Quiz" description="Guess which Merge Tactics card owns the daily skin" faqs={FAQS} />

      {/* Nav row */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <BackToAllGames />
        <HowToPlayModal triggerAriaLabel="How to Play Merge Tactics Skin Quiz">
          <h2 id="how-to-play-title" className="mb-2 text-base font-semibold text-white">
            How it works
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li><strong className="text-white">Zoomed image</strong> - the skin&apos;s image starts heavily zoomed in.</li>
            <li><strong className="text-white">Each wrong guess</strong> zooms out more, revealing more detail.</li>
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
            <li><Link href="/pixel" className="text-indigo-400 hover:underline">Pixel Quiz</Link></li>
            <li><Link href="/description" className="text-indigo-400 hover:underline">Description Quiz</Link></li>
          </ul>
        </HowToPlayModal>
      </div>

      <DailyProgress currentSlug="skin" />
      <h1 className="font-game text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-center mt-6">Merge Tactics Skin Quiz</h1>
      <h2 className="font-game mb-6 text-center text-lg text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">Can you guess the skin from a zoomed grayscale image?</h2>
      <DailyGameGuard slug={SLUG} />
    </GamePageBackground>
  );
}
