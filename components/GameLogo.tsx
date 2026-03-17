import Image from "next/image";
import { getGameLogoPath } from "@/lib/content";

interface Props {
  slug: string;
  size?: number;
  className?: string;
}

export default function GameLogo({ slug, size = 48, className = "" }: Props) {
  return (
    <Image
      src={getGameLogoPath(slug)}
      alt={`${slug} logo`}
      width={size}
      height={size}
      className={className}
    />
  );
}
