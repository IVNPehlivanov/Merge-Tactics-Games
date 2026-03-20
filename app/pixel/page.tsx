import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import DailyGameGuard from "@/components/DailyGameGuard";
import DailyProgress from "@/components/DailyProgress";
import BackToAllGames from "@/components/BackToAllGames";
import GamePageBackground from "@/components/GamePageBackground";
import GameSchema from "@/components/seo/GameSchema";
import HowToPlayModal from "@/components/HowToPlayModal";
import Link from "next/link";

const SLUG = "pixel";

export function generateMetadata(): Metadata {
  return {
    title: "Pixel Tactician | Guess from the Blurred Card Image",
    description: "Guess today's Merge Tactics tactician from a pixelated card image. Each wrong guess reveals more — how many tries will you need?",
    keywords: ["merge tactics pixel", "guess the tactician image", "mergedle pixel"],
    alternates: { canonical: `${SITE.url}/${SLUG}` },
    openGraph: { title: "Pixel Tactician | Mergedle", images: [{ url: "/og/defaultogimage.webp" }] },
  };
}

const FAQS = [
  { question: "How does the Pixel Card game work?", answer: "A tactician card image is shown heavily blurred. Each wrong guess reduces the blur, revealing more of the image." },
  { question: "How many guesses do I get?", answer: "Unlimited guesses. The image gets clearer with each wrong guess, so try to guess early for the best challenge!" },
  { question: "Does the image fully reveal if I keep guessing wrong?", answer: "Yes — after several wrong guesses the blur is completely removed, showing the full card." },
  { question: "When does the puzzle reset?", answer: "Every day at midnight UTC. A new tactician card is selected for all players worldwide." },
];

export default function PixelPage() {
  return (
    <GamePageBackground>
      <GameSchema slug={SLUG} title="Pixel Tactician" description="Guess the daily Merge Tactics tactician from a pixelated card image" faqs={FAQS} />

      {/* Nav row */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <BackToAllGames />
        <HowToPlayModal triggerAriaLabel="How to Play Pixel Tactician">
          <h2 id="how-to-play-title" className="mb-4 text-xl font-bold text-white">
            How to Play Pixel Tactician
          </h2>
          <p className="text-sm text-slate-300">
            A tactician card is shown blurred. Guess the name before the image fully reveals itself!
          </p>

          <h3 className="mb-2 mt-4 text-base font-semibold text-white">How it works</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li><strong className="text-white">Blurred image</strong> — the card starts heavily pixelated.</li>
            <li><strong className="text-white">Type and guess</strong> — submit any tactician name.</li>
            <li><strong className="text-white">Each wrong guess</strong> reduces the blur, revealing more detail.</li>
            <li><strong className="text-white">Guess early</strong> — fewer guesses means a better score and streak.</li>
            <li><strong className="text-white">Full reveal</strong> — the image completely unblurs after enough wrong guesses.</li>
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
            <li><Link href="/classic" className="text-indigo-400 hover:underline">Classic Wordle — guess from stat clues</Link></li>
            <li><Link href="/skin" className="text-indigo-400 hover:underline">Guess the Skin — identify the tactician from a skin</Link></li>
          </ul>
        </HowToPlayModal>
      </div>

      <DailyProgress currentSlug="pixel" />
      <h1 className="font-game text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-center mt-6">Pixel Tactician</h1>
      <h2 className="text-center text-white/70 mb-6 text-lg">Guess from the Blurred Card Image</h2>
      <DailyGameGuard slug={SLUG} />
    </GamePageBackground>
  );
}
