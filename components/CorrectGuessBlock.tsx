import Image from "next/image";
import { getCardDisplayName, cardImagePath } from "@/lib/card-stats";

interface Props {
  cardKey: string;
  guessCount: number;
}

export default function CorrectGuessBlock({ cardKey, guessCount }: Props) {
  return (
    <div className="mt-6 p-4 border border-green-500/30 rounded-xl bg-green-500/10 text-center animate-fade-up">
      <Image
        src={cardImagePath(cardKey)}
        alt={getCardDisplayName(cardKey)}
        width={120}
        height={120}
        className="mx-auto mb-3 rounded-lg"
        unoptimized
      />
      <p className="text-green-400 font-bold text-xl">{getCardDisplayName(cardKey)}!</p>
      <p className="mt-1 text-sm text-white">Number of tries: {guessCount}</p>
    </div>
  );
}
