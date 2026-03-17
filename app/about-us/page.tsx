import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Mergedle | Fan-Made Merge Tactics Wordle Games",
  description: "Learn about Mergedle — the fan-made Merge Tactics daily Wordle puzzle site. Not affiliated with Supercell.",
  alternates: { canonical: `${SITE.url}/about-us` },
};

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 text-white">
      <div className="mb-6">
        <Link href="/" className="text-white/50 hover:text-white text-sm transition-colors">← All Games</Link>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-indigo-400 font-game">About Mergedle</h1>
      <div className="space-y-4 text-white/70 leading-relaxed">
        <p>
          Mergedle is a fan-made Merge Tactics daily puzzle site. We are not affiliated with, endorsed by, or connected to Supercell in any way.
        </p>
        <p>
          New puzzles drop every day at midnight UTC across 3 active game modes: Classic Wordle, Pixel Card, and Guess the Skin. Two more modes are coming soon.
        </p>
        <p>
          All game state is stored locally in your browser — we collect no personal data and require no account or login.
        </p>
        <p>
          For questions or feedback, email us at{" "}
          <a href={`mailto:${SITE.contactEmail}`} className="text-indigo-400 hover:text-indigo-300 underline">{SITE.contactEmail}</a>.
        </p>
        <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/30">
          <p>
            Merge Tactics content and materials are trademarks and copyrights of Supercell.
            This site is fan-made content under the{" "}
            <a href="https://supercell.com/en/fan-content-policy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/50">
              Supercell Fan Content Policy
            </a>.
          </p>
        </div>
      </div>
    </main>
  );
}
