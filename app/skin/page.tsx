import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import DailyGameGuard from "@/components/DailyGameGuard";
import DailyProgress from "@/components/DailyProgress";
import BackToAllGames from "@/components/BackToAllGames";
import GamePageBackground from "@/components/GamePageBackground";
import GameSchema from "@/components/seo/GameSchema";
import Link from "next/link";

const SLUG = "skin";

export function generateMetadata(): Metadata {
  return {
    title: "Guess the Skin | Which Tactician Owns This Skin?",
    description: "A Merge Tactics skin is shown — can you name which tactician it belongs to? Daily Wordle-style game, free, no login.",
    keywords: ["merge tactics skin wordle", "guess the skin", "mergedle skin"],
    alternates: { canonical: `${SITE.url}/${SLUG}` },
    openGraph: { title: "Guess the Skin | Mergedle", images: [{ url: "/og/defaultogimage.webp" }] },
  };
}

const FAQS = [
  { question: "How does Guess the Skin work?", answer: "A Merge Tactics skin image is displayed. Your job is to guess which tactician that skin belongs to." },
  { question: "Are there any stat clues?", answer: "No — the skin is always fully visible. The challenge is knowing your Merge Tactics skins by heart." },
  { question: "What if I don't recognise the skin?", answer: "Try guessing tacticians that seem most likely. Each wrong guess is tracked so you can see your attempts." },
  { question: "When does the puzzle reset?", answer: "Every day at midnight UTC. A new skin is selected from the pool for all players worldwide." },
];

export default function SkinPage() {
  return (
    <GamePageBackground>
      <GameSchema slug={SLUG} title="Guess the Skin" description="Guess which Merge Tactics tactician owns the daily skin" faqs={FAQS} />
      <BackToAllGames />
      <DailyProgress />
      <h1 className="font-game text-3xl text-indigo-400 text-center mt-6">Guess the Skin</h1>
      <h2 className="text-center text-white/70 mb-4 text-lg">Which Tactician Owns This Skin?</h2>
      <DailyGameGuard slug={SLUG} />

      <section className="mt-16 space-y-8 text-white/70 text-sm leading-relaxed">
        <div>
          <h2 className="text-white font-semibold text-base mb-2">How to Play</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>A skin image and name are shown in full.</li>
            <li>Type the name of the tactician you think owns that skin.</li>
            <li>Submit your guess — correct or wrong, your attempts are tracked.</li>
            <li>No progressive reveal — the challenge is pure skin knowledge.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-white font-semibold text-base mb-2">About Skin Mode</h2>
          <p>Guess the Skin is a unique Mergedle mode that tests your Merge Tactics cosmetic knowledge. A new skin challenge unlocks every day at midnight UTC.</p>
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
            <li><Link href="/pixel" className="text-indigo-400 hover:underline">Pixel Card — guess from a blurred image</Link></li>
          </ul>
        </div>
      </section>
    </GamePageBackground>
  );
}
