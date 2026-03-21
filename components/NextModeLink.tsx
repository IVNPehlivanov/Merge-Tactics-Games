import Link from "next/link";
import { getNextGameBySlug, getGameLogoPath } from "@/lib/content";

export default function NextModeLink({ currentSlug }: { currentSlug: string }) {
  const next = getNextGameBySlug(currentSlug);
  if (!next) return null;
  return (
    <div className="mt-6 text-center">
      <p className="text-white/60 text-sm mb-3 font-game">Next up:</p>
      <Link href={`/${next.slug}`} className="group inline-block transition-transform hover:scale-[1.03]">
        <img
          src={getGameLogoPath(next.slug)}
          alt={`Play ${next.title}`}
          className="mx-auto h-14 w-auto object-contain drop-shadow-lg group-hover:brightness-110 transition-all"
        />
      </Link>
    </div>
  );
}
