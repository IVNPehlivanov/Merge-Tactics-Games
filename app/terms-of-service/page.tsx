import type { Metadata } from "next";
import { SITE } from "@/lib/content";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Mergedle",
  description: "Mergedle terms of service — fan content terms and Supercell disclaimer.",
  alternates: { canonical: `${SITE.url}/terms-of-service` },
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12 text-white">
      <div className="mb-6">
        <Link href="/" className="text-white/50 hover:text-white text-sm transition-colors">← All Games</Link>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-indigo-400 font-game">Terms of Service</h1>
      <div className="space-y-6 text-white/70 leading-relaxed text-sm">
        <p>Last updated: March 2025</p>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">Use of Service</h2>
          <p>
            Mergedle is a free, browser-based fan project. By using this site you agree to these terms. The service is provided as-is with no warranty. We reserve the right to change or discontinue the service at any time.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">Fan Content</h2>
          <p>
            Mergedle is an unofficial fan site for Merge Tactics. It is not affiliated with, endorsed, sponsored, or specifically approved by Supercell. All Merge Tactics game assets, trademarks, and copyrights belong to Supercell.
          </p>
          <p className="mt-2">
            This project operates under the{" "}
            <a href="https://supercell.com/en/fan-content-policy/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
              Supercell Fan Content Policy
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">Intellectual Property</h2>
          <p>
            Game data, tactician names, trait names, and artwork used on this site are the property of Supercell. The website code and design are original work by the Mergedle team.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">Limitation of Liability</h2>
          <p>
            Mergedle is provided free of charge for entertainment purposes. We are not liable for any loss of data or game progress. All game state is local to your browser.
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-base mb-2">Contact</h2>
          <p>
            Questions?{" "}
            <a href={`mailto:${SITE.contactEmail}`} className="text-indigo-400 hover:text-indigo-300 underline">{SITE.contactEmail}</a>
          </p>
        </section>

        <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/30">
          <p>
            Mergedle is not affiliated with, endorsed, sponsored, or specifically approved by Supercell.
            Merge Tactics content and materials are trademarks and copyrights of Supercell.
            This site is a fan-made project.
          </p>
        </div>
      </div>
    </main>
  );
}
