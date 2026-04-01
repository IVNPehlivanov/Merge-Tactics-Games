import Link from "next/link";
import { getNextGameBySlug, getGameLogoPath } from "@/lib/content";

export default function NextModeLink({ currentSlug }: { currentSlug: string }) {
  const next = getNextGameBySlug(currentSlug);
  if (!next) return null;

  const title = next.title;
  const displayName = next.progressTitle ?? next.homeTitle ?? title;
  const tagline = next.progressTitle || next.homeTitle ? undefined : next.tagline;

  return (
    <div className="mt-6 text-center">
      <p className="mb-3 font-supercell text-sm text-white">Next mode:</p>
      <Link
        href={`/${next.slug}`}
        aria-label={`Play ${next.title}`}
        className="group inline-flex flex-col items-center transition-transform hover:scale-[1.03]"
      >
        <span className="animate-next-mode-logo-float inline-flex flex-col items-center">
          <img
            src={getGameLogoPath(next.slug)}
            alt=""
            className="mx-auto h-16 w-auto max-w-full object-contain drop-shadow-lg transition-[filter] group-hover:brightness-110"
          />
          <span
            className="mt-2 flex min-w-0 w-full flex-col items-center gap-0.5 break-words text-center font-supercell text-xs font-semibold leading-tight text-white group-hover:text-white/90"
            style={{ overflowWrap: "anywhere" }}
          >
            {next.slug === "classic" ? (
              <span className="flex flex-col items-center leading-tight">
                <span>Classic</span>
                <span>Wordle</span>
              </span>
            ) : (
              <span>{displayName}</span>
            )}
            {tagline ? (
              <span className="block max-w-full font-supercell font-normal text-[0.55rem] leading-tight text-white/85">
                {tagline}
              </span>
            ) : null}
          </span>
        </span>
      </Link>
    </div>
  );
}
