import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import DailyGameGuard from "@/components/DailyGameGuard";
import DailyProgress from "@/components/DailyProgress";
import BackToAllGames from "@/components/BackToAllGames";
import GamePageBackground from "@/components/GamePageBackground";
import GameSchema from "@/components/seo/GameSchema";
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
      <BackToAllGames />
      <DailyProgress />
      <h1 className="font-game text-3xl text-indigo-400 text-center mt-6">Pixel Tactician</h1>
      <h2 className="text-center text-white/70 mb-4 text-lg">Guess from the Blurred Card Image</h2>
      <DailyGameGuard slug={SLUG} />

      <section className="mt-16 space-y-8 text-white/70 text-sm leading-relaxed">
        <div>
          <h2 className="text-white font-semibold text-base mb-2">How to Play</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>A tactician card image is shown — heavily pixelated at first.</li>
            <li>Type a tactician name and submit your guess.</li>
            <li>Each wrong guess reduces the blur, revealing a clearer image.</li>
            <li>Guess correctly before the image fully reveals for the best score.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-white font-semibold text-base mb-2">About Pixel Card Mode</h2>
          <p>Pixel Card challenges you to recognise Merge Tactics tacticians from blurred card art. The puzzle resets daily at midnight UTC — a new card awaits every day.</p>
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
            <li><Link href="/classic" className="text-indigo-400 hover:underline">Classic Wordle — guess from stat clues</Link></li>
            <li><Link href="/skin" className="text-indigo-400 hover:underline">Guess the Skin — identify the tactician from a skin</Link></li>
          </ul>
        </div>
      </section>
    </GamePageBackground>
  );
}
