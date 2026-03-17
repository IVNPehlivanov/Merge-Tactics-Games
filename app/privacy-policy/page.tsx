import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Mergedle",
  description: "Mergedle privacy policy — no personal data collected, Vercel Analytics only.",
  alternates: { canonical: `${SITE.url}/privacy-policy` },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 text-white">
      <div className="mb-6">
        <Link href="/" className="text-white/50 hover:text-white text-sm transition-colors">← All Games</Link>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-indigo-400 font-game">Privacy Policy</h1>
      <div className="space-y-6 text-white/70 leading-relaxed text-sm">
        <p>Last updated: March 2025</p>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">Data We Collect</h2>
          <p>
            Mergedle does not collect any personal information. All game state (guesses, streaks, daily progress) is stored entirely in your browser&apos;s localStorage and IndexedDB. No data is sent to our servers.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">Analytics</h2>
          <p>
            We use <strong className="text-white/90">Vercel Analytics</strong> and <strong className="text-white/90">Vercel Speed Insights</strong> to understand aggregate site traffic and performance. These tools collect anonymous, aggregated data (page views, device types, country-level location) and do not track individual users or use cookies for advertising.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">Cookies</h2>
          <p>
            Mergedle uses browser localStorage and cookies only to persist your streak data between sessions. No third-party advertising cookies are used.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">Contact</h2>
          <p>
            Questions about privacy? Email{" "}
            <a href={`mailto:${SITE.contactEmail}`} className="text-indigo-400 hover:text-indigo-300 underline">{SITE.contactEmail}</a>.
          </p>
        </section>

        <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/30">
          <p>
            Mergedle is not affiliated with, endorsed, sponsored, or specifically approved by Supercell.
            Merge Tactics content and materials are trademarks and copyrights of Supercell.
            This site is a fan-made project under the{" "}
            <a href="https://supercell.com/en/fan-content-policy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/50">
              Supercell Fan Content Policy
            </a>.
          </p>
        </div>
      </div>
    </main>
  );
}
