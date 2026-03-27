import type { MetadataRoute } from "next";
import { SITE, DAILY_ACTIVE_SLUGS } from "@/lib/content";

// Update these dates when static page content changes
const STATIC_DATES = {
  home:           new Date("2026-03-21"),
  aboutUs:        new Date("2026-03-21"),
  privacyPolicy:  new Date("2026-03-21"),
  termsOfService: new Date("2026-03-21"),
};

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();
  return [
    { url: SITE.url,                            lastModified: STATIC_DATES.home },
    ...DAILY_ACTIVE_SLUGS.map((slug) => ({
      url: `${SITE.url}/${slug}`,
      lastModified: today,
    })),
    { url: `${SITE.url}/about-us`,          lastModified: STATIC_DATES.aboutUs },
    { url: `${SITE.url}/privacy-policy`,    lastModified: STATIC_DATES.privacyPolicy },
    { url: `${SITE.url}/terms-of-service`,  lastModified: STATIC_DATES.termsOfService },
  ];
}
