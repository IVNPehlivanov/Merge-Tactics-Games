import Link from "next/link";
import { getNextGameBySlug } from "@/lib/content";

export default function NextModeLink({ currentSlug }: { currentSlug: string }) {
  const next = getNextGameBySlug(currentSlug);
  if (!next) return null;
  return (
    <div className="mt-6 text-center">
      <p className="text-white/60 text-sm mb-2">Next up:</p>
      <Link href={`/${next.slug}`}
        className="inline-block px-6 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-400 transition-colors">
        Play {next.title} →
      </Link>
    </div>
  );
}
