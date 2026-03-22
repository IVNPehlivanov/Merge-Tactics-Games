import Link from "next/link";
import { GAME_META, SITE } from "@/lib/content";

const footerAccentLinkClass =
  "text-sky-400 no-underline transition-colors hover:text-sky-300 [text-shadow:0_1px_4px_rgba(0,0,0,0.95),0_2px_10px_rgba(0,0,0,0.85),0_0_12px_rgba(56,189,248,0.35)]";

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

function BrandBlurb() {
  return (
    <>
      <p className="mx-auto max-w-md text-pretty text-xs leading-relaxed text-white md:mx-0 md:max-w-none">
        Mergedle offers daily browser-based guessing games where you can test your knowledge of Clash Royale
        Merge Tactics.
      </p>
      <a
        href={`mailto:${SITE.contactEmail}`}
        className={`mt-3 inline-flex items-center gap-1.5 text-xs ${footerAccentLinkClass}`}
      >
        <MailIcon className="h-3.5 w-3.5 shrink-0" />
        {SITE.contactEmail}
      </a>
    </>
  );
}

const colHeadingClass =
  "mb-3 text-center text-xs font-semibold uppercase tracking-widest text-white md:text-left";

const footerLinkClass = "text-sm text-white transition-opacity hover:opacity-90";

export default function Footer() {
  const activeGames = GAME_META.filter((g) => !g.comingSoon);

  return (
    <footer className="font-game mt-16 w-full border-t border-white/10 px-4 py-12 text-sm text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.95),0_2px_10px_rgba(0,0,0,0.85)] sm:px-6">
      {/* Centered column block — matches reference: one row, three equal columns, text left in each */}
      <div className="mx-auto w-full max-w-5xl">
        {/* Phone: title + blurb + email, all centered */}
        <div className="mb-10 text-center md:hidden">
          <p className="mb-2 text-xl text-white">Mergedle</p>
          <BrandBlurb />
        </div>

        {/* Phone: two columns (Games | Info), each column’s text centered; desktop: 3-col, left-aligned */}
        <div className="mx-auto grid w-full max-w-sm grid-cols-2 gap-x-6 gap-y-10 sm:max-w-md md:max-w-none md:grid-cols-[minmax(0,1.65fr)_minmax(0,0.85fr)_minmax(0,0.85fr)] md:gap-x-10 md:gap-y-0 lg:gap-x-14">
          <div className="hidden min-w-0 pr-2 text-left md:block lg:pr-4">
            <p className="mb-2 text-xl text-white">Mergedle</p>
            <BrandBlurb />
          </div>
          <div className="min-w-0 text-center md:text-left">
            <p className={colHeadingClass}>Games</p>
            <ul className="flex flex-col items-center space-y-2 md:items-start">
              {activeGames.map((g) => (
                <li key={g.slug}>
                  <Link href={`/${g.slug}`} className={footerLinkClass}>
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 text-center md:text-left">
            <p className={colHeadingClass}>Info</p>
            <ul className="flex flex-col items-center space-y-2 md:items-start">
              <li>
                <Link href="/about-us" className={footerLinkClass}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className={footerLinkClass}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className={footerLinkClass}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* REQUIRED: Supercell fan content disclaimer — DO NOT REMOVE */}
      <div className="mx-auto mt-10 max-w-5xl border-t border-white/10 px-2 pt-6 text-center text-xs font-sans md:px-0">
        <p>© {new Date().getFullYear()} Mergedle. All rights reserved.</p>
        <p className="mx-auto mt-2 max-w-sm text-pretty md:max-w-none">
          This material is unofficial and is not endorsed by Supercell. For more information see{" "}
          <a
            href="https://supercell.com/en/fan-content-policy/"
            target="_blank"
            rel="noopener noreferrer"
            className={footerAccentLinkClass}
          >
            Supercell&apos;s Fan Content Policy
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
