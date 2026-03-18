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
  description: "Play daily Wordle-style Merge Tactics mini-games. Guess the Tactician, Skin, and more — free, no login required.",
  openGraph: {
    siteName: SITE.name,
    images: [{ url: "/og/defaultogimage.webp", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/MergeTactics.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/homepage/March_Season_-_Dagger_Duchess_Skin_Color_v1.webp" as="image" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white min-h-screen`}>
        {children}
        <div className="relative z-10">
          <Footer />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
