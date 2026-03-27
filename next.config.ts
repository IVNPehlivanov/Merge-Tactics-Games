import type { NextConfig } from "next";
import path from "path";

/**
 * Prefer cwd so tracing matches `npm run build` from this repo (avoids chunk path bugs seen when
 * combining fileURL-based root with multiple parent lockfiles).
 */
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(process.cwd()),
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 1 day
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
      // Only tag hashed dev chunks — avoid a catch-all here (can interact oddly with dev routing).
      return [
        { source: "/_next/static/:path*", headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }] },
      ];
    }
    return [
      // /_next/static IS content-hashed by Next.js — immutable is safe here
      {
        source: "/_next/static/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Game images use stable filenames — no immutable, revalidate after 7 days
      {
        source: "/cards/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, must-revalidate" }],
      },
      {
        source: "/rulers/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, must-revalidate" }],
      },
      {
        source: "/skins/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, must-revalidate" }],
      },
      // Fonts truly never change — immutable is correct
      {
        source: "/fonts/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
