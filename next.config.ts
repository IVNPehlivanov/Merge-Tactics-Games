import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

/** Force app root when another lockfile exists higher on disk (e.g. C:\\Users\\…\\package-lock.json). */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  turbopack: { root: projectRoot },
  webpack: (config, { dev }) => {
    if (dev) config.cache = false;
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 1 day
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
      return [{ source: "/(.*)", headers: [{ key: "Cache-Control", value: "no-store" }] }];
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
