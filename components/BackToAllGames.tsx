import Link from "next/link";

export default function BackToAllGames() {
  return (
    <div className="mb-4">
      <Link href="/" className="text-white/50 hover:text-white text-sm transition-colors">← All Games</Link>
    </div>
  );
}
