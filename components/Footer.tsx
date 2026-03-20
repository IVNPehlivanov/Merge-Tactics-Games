import Link from "next/link";
import { GAME_META, SITE } from "@/lib/content";

export default function Footer() {
  const activeGames = GAME_META.filter((g) => !g.comingSoon);

  return (
    <footer className="w-full border-t border-white/10 mt-16 py-8 px-4 text-sm text-white/70 [text-shadow:0_1px_6px_rgba(0,0,0,0.9),0_2px_12px_rgba(0,0,0,0.7)]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top row: Mergedle brand — full width on mobile, 1/3 on desktop */}
        <div className="md:hidden">
          <p className="font-game text-white text-lg mb-1">Mergedle</p>
          <p className="text-xs">Daily Merge Tactics Wordle games</p>
        </div>

        {/* Bottom section: Info + Games side by side on mobile, 3-col on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {/* Desktop-only brand column */}
          <div className="hidden md:block">
            <p className="font-game text-white text-lg mb-2">Mergedle</p>
            <p className="text-xs">Daily Merge Tactics Wordle games</p>
          </div>
          <div>
            <p className="font-semibold text-white/70 mb-2">Games</p>
            <ul className="space-y-1">
              {activeGames.map((g) => (
                <li key={g.slug}>
                  <Link href={`/${g.slug}`} className="hover:text-white transition-colors">{g.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white/70 mb-2">Info</p>
            <ul className="space-y-1">
              <li><Link href="/about-us" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* REQUIRED: Supercell fan content disclaimer — DO NOT REMOVE */}
      <div className="max-w-4xl mx-auto mt-6 pt-4 border-t border-white/10 text-xs text-center text-white/30">
        <p>
          Mergedle is not affiliated with, endorsed, sponsored, or specifically approved by Supercell.
          Merge Tactics content and materials are trademarks and copyrights of Supercell.
          This site is a fan-made project.{" "}
          <a href="https://supercell.com/en/fan-content-policy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/60">
            Supercell Fan Content Policy
          </a>
        </p>
        <p className="mt-2">© {new Date().getFullYear()} Mergedle · <a href={`mailto:${SITE.contactEmail}`} className="underline">{SITE.contactEmail}</a></p>
      </div>
    </footer>
  );
}
