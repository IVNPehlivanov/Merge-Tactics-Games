import Link from "next/link";
import { getNextGameBySlug, getGameLogoPath } from "@/lib/content";

export default function NextModeLink({ currentSlug }: { currentSlug: string }) {
  const next = getNextGameBySlug(currentSlug);
  if (!next) return null;
  return (
    <div className="mt-6 text-center">
      <p className="text-white text-sm mb-3 font-game">Next mode:</p>
      <Link
        href={`/${next.slug}`}
        aria-label={`Play ${next.title}`}
        className="group inline-flex flex-col items-center transition-transform hover:scale-[1.03]"
      >
        <span className="animate-next-mode-logo-float inline-flex flex-col items-center">
          <img
            src={getGameLogoPath(next.slug)}
            alt=""
            className="mx-auto h-14 w-auto object-contain drop-shadow-lg transition-[filter] group-hover:brightness-110"
          />
          <span className="mt-2 text-center text-sm font-game text-white group-hover:text-white/90">
            {next.title}
          </span>
        </span>
      </Link>
    </div>
  );
}
