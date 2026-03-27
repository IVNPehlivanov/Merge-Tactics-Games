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
    title: "Guess the Skin | Which Card Owns This Skin?",
    description: "A Merge Tactics skin is shown — can you name which card it belongs to? Daily Wordle-style game, free, no login.",
    keywords: ["merge tactics skin wordle", "guess the skin", "mergedle skin"],
    alternates: { canonical: `${SITE.url}/${SLUG}` },
    openGraph: { title: "Guess the Skin | Mergedle", description: "A ruler's skin is shown zoomed in and grayscale. Guess which skin it is - each wrong answer zooms out further. Free, no login.", images: [{ url: `${SITE.url}/og/ogimage.webp`, width: 1200, height: 630 }] },
  };
}

const FAQS = [
  { question: "How does Guess the Skin work?", answer: "A Merge Tactics skin image is displayed. Your job is to guess which card that skin belongs to." },
  { question: "Are there any stat clues?", answer: "No — the skin is always fully visible. The challenge is knowing your Merge Tactics skins by heart." },
  { question: "What if I don't recognise the skin?", answer: "Try guessing cards that seem most likely. Each wrong guess is tracked so you can see your attempts." },
  { question: "When does the puzzle reset?", answer: "Every day at midnight UTC. A new skin is selected from the pool for all players worldwide." },
];

export default function SkinPage() {
  return (
    <GamePageBackground>
      <GameSchema slug={SLUG} title="Guess the Skin" description="Guess which Merge Tactics card owns the daily skin" faqs={FAQS} />

      {/* Nav row */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <BackToAllGames />
        <HowToPlayModal triggerAriaLabel="How to Play Guess the Skin">
          <h2 id="how-to-play-title" className="mb-4 text-xl font-bold text-white">
            How to Play Guess the Skin
          </h2>
          <p className="text-sm text-slate-300">
            A Merge Tactics skin is shown in full — can you name which card it belongs to?
          </p>

          <h3 className="mb-2 mt-4 text-base font-semibold text-white">How it works</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li><strong className="text-white">Skin shown in full</strong> — no blur, no clues. Pure cosmetic knowledge.</li>
            <li><strong className="text-white">Type and guess</strong> — submit the card you think owns the skin.</li>
            <li><strong className="text-white">Wrong guesses</strong> are tracked so you can see your attempts.</li>
            <li><strong className="text-white">No stat clues</strong> — the challenge is recognising skins by appearance.</li>
          </ul>

          <p className="mt-4 text-sm text-slate-300">
            A new skin challenge unlocks every day at midnight UTC. Come back daily to keep your streak!
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
            <li><Link href="/classic" className="text-indigo-400 hover:underline">Classic Wordle — guess from stat clues</Link></li>
            <li><Link href="/pixel" className="text-indigo-400 hover:underline">Pixel Card — guess from a blurred image</Link></li>
            <li><Link href="/description" className="text-indigo-400 hover:underline">Description — guess from the card text</Link></li>
          </ul>
        </HowToPlayModal>
      </div>

      <DailyProgress currentSlug="skin" />
      <h1 className="font-game text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-center mt-6">Guess the Skin</h1>
      <h2 className="font-game mb-6 text-center text-lg text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">Identify the skin from a zoomed grayscale image</h2>
      <DailyGameGuard slug={SLUG} />
    </GamePageBackground>
  );
}
