import Link from "next/link";

export default function BackToAllGames() {
  return (
    <div className="mb-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-white/60 bg-black/50 px-3 py-1.5 text-sm font-bold text-white shadow-lg backdrop-blur-sm transition-all hover:border-white hover:bg-black/70"
      >
        ← All Games
      </Link>
    </div>
  );
}
