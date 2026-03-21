export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mergedle.com",
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Mergedle",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@mergedle.com",
};

export type GameMetaItem = {
  slug: string;
  title: string;
  description: string;
  shortDesc: string;
  mode: "daily" | "endless";
  comingSoon?: boolean;
  seoHowItWorks: string;
};

export const GAME_META: GameMetaItem[] = [
  {
    slug: "classic",
    title: "Classic Wordle",
    description: "Guess the daily Merge Tactics card from stat clues",
    shortDesc: "Guess from stats",
    mode: "daily",
    seoHowItWorks: "Each guess reveals whether the mystery card matches on elixir cost, traits, type, and release year.",
  },
  {
    slug: "pixel",
    title: "Pixel Card",
    description: "Identify the card from a pixelated card image",
    shortDesc: "Pixelated image",
    mode: "daily",
    seoHowItWorks: "The card image starts heavily pixelated. Each wrong guess reveals a clearer version.",
  },
  {
    slug: "skin",
    title: "Guess the Skin",
    description: "Which card does this skin belong to?",
    shortDesc: "Skin clue",
    mode: "daily",
    seoHowItWorks: "A skin image is shown — guess which card it belongs to.",
  },
  {
    slug: "description",
    title: "Description",
    description: "Read the card description and guess which card it is",
    shortDesc: "Description clue",
    mode: "daily",
    comingSoon: true,
    seoHowItWorks: "A card's in-game description is shown. Guess which Merge Tactics card matches it.",
  },
  {
    slug: "mode-5",
    title: "Coming Soon",
    description: "New game mode — coming soon",
    shortDesc: "Coming soon",
    mode: "daily",
    comingSoon: true,
    seoHowItWorks: "",
  },
];

// Only real game slugs (no coming-soon) — used for daily progress tracking
export const DAILY_ACTIVE_SLUGS = ["classic", "pixel", "skin"] as const;

// Flow order for NextModeLink
export const GAME_FLOW_SLUGS = ["classic", "pixel", "skin"];

export function getGameMetaBySlug(slug: string): GameMetaItem | undefined {
  return GAME_META.find((g) => g.slug === slug);
}

export function getNextGameBySlug(currentSlug: string): GameMetaItem | null {
  const idx = GAME_FLOW_SLUGS.indexOf(currentSlug);
  if (idx === -1 || idx === GAME_FLOW_SLUGS.length - 1) return null;
  return getGameMetaBySlug(GAME_FLOW_SLUGS[idx + 1]) ?? null;
}

export function getGameLogoPath(slug: string): string {
  const map: Record<string, string> = {
    classic:     "/game_logos/classicmergedle.webp",
    pixel:       "/game_logos/pixelmergedle.webp",
    skin:        "/game_logos/skinmergedle.webp",
    description: "/game_logos/descriptionmergedle.webp",
  };
  return map[slug] ?? "/game_logos/mergedlelogo.webp";
}
