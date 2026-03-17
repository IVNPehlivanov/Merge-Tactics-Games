import type { MetadataRoute } from "next";
import { SITE, GAME_META } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const activeGames = GAME_META.filter((g) => !g.comingSoon);
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    ...activeGames.map((g) => ({
      url: `${SITE.url}/${g.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
    { url: `${SITE.url}/about-us`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
}
