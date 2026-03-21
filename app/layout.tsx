import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/content";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { template: "%s | Mergedle", default: "Mergedle — Daily Merge Tactics Wordle Games" },
  description: "Play daily Wordle-style Merge Tactics mini-games. Guess the Card, Skin, and more — free, no login required.",
  openGraph: {
    siteName: SITE.name,
    images: [{ url: "/og/ogimage.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  logo: {
    "@type": "ImageObject",
    url: `${SITE.url}/game_logos/mergedlelogo.webp`,
    width: 240,
    height: 90,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/Supercell-Magic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white min-h-screen`}>
        {children}
        <div className="relative z-20">
          <Footer />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
