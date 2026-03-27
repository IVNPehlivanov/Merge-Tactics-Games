# Mergedle SEO Audit Report
**Date:** 2026-03-21 (Audit #2)
**Previous audit:** 2026-03-21 (Audit #1)
**Site type:** Gaming fan site (Merge Tactics daily puzzle games)

---

## WRITING RULE: NEVER USE EMDASH
All content on this site and in this document must use hyphens (-) or colons (:) instead of em dashes.

---

## Score Comparison

| Category | Weight | Audit #1 | Audit #2 | Change |
|---|---|---|---|---|
| Technical SEO | 22% | 68 | 72 | +4 |
| Content Quality | 23% | 58 | 58 | 0 |
| On-Page SEO | 20% | 55 | 62 | +7 |
| Schema / Structured Data | 10% | 62 | 61 | -1 |
| Performance (CWV) | 10% | 70 | 65 | -5 |
| AI Search Readiness | 10% | 52 | 61 | +9 |
| Images | 5% | 40 | 45 | +5 |
| **TOTAL** | | **59.7 / 100** | **62.5 / 100** | **+3** |

**Subagent raw scores:** Technical: 72 | Content: 58 | Sitemap: 75 | Schema: 61 | GEO: 61

**What moved the needle:** On-Page SEO (+7) from fixing H1/H2 placeholders, og:description, WebSite + Organization schema, FAQPage schema added. AI Search Readiness (+9) from adding ClaudeBot/PerplexityBot/GoogleOther to robots.ts and llms.txt.

**What dragged the score:** Performance (-5) because new audit identified background images bypassing next/image (LCP risk) and HomeInfographic using raw `<img>` tags - these were not caught in Audit #1. Schema (-1) because new audit found missing WebPage nodes and cross-reference gaps.

---

## What Was Fixed Since Audit #1

| ID | Issue | File | Resolution |
|---|---|---|---|
| C2 | Placeholder H1/H2 on pixel and skin pages | pixel/page.tsx, skin/page.tsx | FIXED |
| H1 | og:description missing all pages | all page.tsx | FIXED |
| H2 | No WebSite schema on homepage | app/page.tsx | FIXED |
| H3 | No Organization schema globally | app/layout.tsx | FIXED |
| H4 | No @id on schema entities | GameSchema.tsx | FIXED |
| H5 | /description indexable despite comingSoon | app/description/page.tsx | FIXED |
| H7 | Classic FAQ attribute list inconsistency | app/classic/page.tsx | FIXED |
| M1 | changeFrequency/priority in sitemap | app/sitemap.ts | FIXED |
| M2 | lastModified always new Date() for static pages | app/sitemap.ts | FIXED |
| M3 | privacy-policy and terms missing from sitemap | app/sitemap.ts | FIXED |
| M4 | Background preload in root layout (not homepage) | app/layout.tsx | FIXED |
| L1 | WebApplication missing inLanguage | GameSchema.tsx | FIXED |
| L2 | OG image URLs relative not absolute | all page.tsx | FIXED |
| L3 | robots.ts missing GoogleOther | app/robots.ts | FIXED |
| C1 | OG image missing | public/og/ | PARTIAL - file added as ogimage.webp (was defaultogimage.webp in docs) |

---

## Open Issues - Prioritized TODO

### CRITICAL

| # | Issue | File | Notes |
|---|---|---|---|
| C1 | Homepage has ~30 words of visible body text - zero crawlable prose | app/page.tsx | Add 150-200 word static section below HomeInfographic. Every AI crawler + quality rater finds nothing. |
| C2 | FAQ content locked inside HowToPlayModal - not visible in page HTML | classic/page.tsx, pixel/page.tsx, skin/page.tsx | Render FAQS array as visible HTML below the game area. JSON-LD schema exists but needs visible counterpart. |
| C3 | No security headers on HTML pages (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS, Permissions-Policy) | next.config.ts | Add source: "/(.*)" header block. Only cache headers exist now. |

### HIGH

| # | Issue | File | Notes |
|---|---|---|---|
| H1 | Pixel and Skin H1 tags missing "Merge Tactics" brand keyword | pixel/page.tsx:78, skin/page.tsx:77 | Classic H1 says "Merge Tactics Wordle" - Pixel and Skin should follow same pattern |
| H2 | About Us page is ~95 words - below E-E-A-T minimum | app/about-us/page.tsx | Expand to 300+ words: who built it, how long playing Merge Tactics, game descriptions, what coming-soon modes will be |
| H3 | Expand llms.txt with prose blocks + create llms-full.txt | public/llms.txt | Current file is 23 lines with no quotable prose. Add About Mergedle block (150 words), About Merge Tactics block, per-game descriptions, Contact/License footer |
| H4 | All game pages share one OG image | classic/page.tsx, pixel/page.tsx, skin/page.tsx | Create game-specific OG images at public/og/classic.png, pixel.png, skin.png. Improves social shares and AI crawl previews. |
| H5 | Root layout OG image uses relative path /og/ogimage.webp | app/layout.tsx:18 | Change to `${SITE.url}/og/ogimage.webp` - inconsistent with per-page which use absolute URL |
| H6 | og:title missing from homepage openGraph block | app/page.tsx | Add title: "Mergedle - Daily Merge Tactics Wordle Games" to openGraph object |
| H7 | Twitter card has no description or title fallback | app/layout.tsx:20 | Add description and title to twitter object. Add site/creator once handle exists. |
| H8 | Background images bypass next/image - direct LCP risk on mobile | app/page.tsx:34, GamePageBackground.tsx | Convert to <Image fill priority /> component so Next.js serves AVIF at correct viewport size |
| H9 | HomeInfographic uses raw <img> tags - no optimization | components/HomeInfographic.tsx | Switch to next/image with priority on first button |
| H10 | WebPage schema missing on all game pages | components/seo/GameSchema.tsx | Add WebPage node linking BreadcrumbList + WebApplication into a coherent graph |
| H11 | WebSite schema missing publisher link to Organization | app/page.tsx | Add `publisher: { "@id": orgId }` to websiteSchema |
| H12 | Organization schema missing description and email | app/layout.tsx | Add description and email: SITE.contactEmail to orgSchema |
| H13 | WebApplication missing offers.availability, offers.url, screenshot, featureList | components/seo/GameSchema.tsx | Add all four to gameSchema object |
| H14 | AboutPage schema missing on /about-us | app/about-us/page.tsx | Add AboutPage JSON-LD with Organization reference and OG block |
| H15 | OAI-SearchBot (ChatGPT real-time citations) not in robots.ts | app/robots.ts | Add { userAgent: "OAI-SearchBot", allow: "/" } |
| H16 | Organization sameAs array missing | app/layout.tsx | Add sameAs array - even linking to Supercell game page creates entity relationship |
| H17 | Description page coming-soon UI is broken | app/description/page.tsx | Remove GameSchema (noindexed), fix DailyGameGuard falling through to "Unknown game mode" |

### MEDIUM

| # | Issue | File | Notes |
|---|---|---|---|
| M1 | sitemap game pages still use new Date() for lastModified | app/sitemap.ts | Hardcode a real date per game - same pattern as STATIC_DATES for static pages |
| M2 | No image sitemap entries | app/sitemap.ts | Add images: [game logo URL] to each active game entry |
| M3 | Canonical tag on noindexed /description page | app/description/page.tsx | Remove alternates.canonical - contradictory on noindex pages |
| M4 | Privacy policy says "Last updated: March 2025" | app/privacy-policy/page.tsx:19 | Update to March 2026 |
| M5 | Remove keywords meta tag from all game pages | classic/page.tsx:17, pixel/page.tsx:17, skin/page.tsx:17 | Google has ignored keywords since 2009 - dead weight in head |
| M6 | DailyGameGuard spinner has no min-height - causes CLS | components/DailyGameGuard.tsx | Add min-h-[400px] to spinner container |
| M7 | About page has no H2/H3 structure | app/about-us/page.tsx | Four bare <p> tags under H1 - add heading structure for AI extractability |
| M8 | About Us page missing OG block entirely | app/about-us/page.tsx | Add openGraph with title, description, images |
| M9 | FAQ answers too short for GEO citation (under 30 words each) | all game page.tsx FAQS arrays | Expand to 3-5 sentences per answer with game-specific terminology |
| M10 | WebSite schema inside <body> - should be in <head> | app/page.tsx | Move to layout.tsx head block or use Next.js Script strategy="beforeInteractive" |
| M11 | ItemList schema missing on homepage | app/page.tsx | Add ItemList linking to 3 WebApplication @ids - helps AI crawlers map site structure |
| M12 | Skin page H2 says "zoomed grayscale image" but FAQ says "fully visible" | app/skin/page.tsx:78 + line 25 | Content contradiction - align H2 and FAQ to match actual game behavior |
| M13 | Applebot-Extended not listed in robots.ts | app/robots.ts | Apple Intelligence crawler - add explicit allow rule |

### LOW

| # | Issue | File | Notes |
|---|---|---|---|
| L1 | IndexNow not implemented | new file + api route | Instant URL submission to Bing/Yandex on deploy - useful for daily puzzle freshness |
| L2 | Redundant named-bot allow rules (wildcard already covers them) | app/robots.ts | Cleanup only - no SEO impact |
| L3 | HomeInfographic could be a Server Component | components/HomeInfographic.tsx | No stateful hooks - removing "use client" improves hydration time |
| L4 | CLAUDE.md font reference says MergeTactics.ttf but code uses Supercell-Magic.woff2 | CLAUDE.md | Docs discrepancy only |
| L5 | twitter:site and twitter:creator empty until handle exists | app/layout.tsx | Add when social accounts created |
| L6 | BreadcrumbList not linked to WebPage via breadcrumb property | GameSchema.tsx | Nice-to-have once WebPage schema added (H10) |
| L7 | No CollectionPage type on homepage | app/page.tsx | Semantic improvement once ItemList added (M11) |
| L8 | Organization logo missing @id for cross-referencing | app/layout.tsx | Prevents linking logo from other schema nodes |

---

## Top 5 Highest-ROI Fixes

These five changes would have the largest measurable impact on rankings and AI citation:

1. **Add visible prose to homepage** (C1) - zero-cost copy addition, fixes the most glaring thin-content signal
2. **Render FAQ as visible HTML on game pages** (C2) - the FAQ content already exists in FAQS arrays, just needs a second render target below the game UI
3. **Expand llms.txt** (H3) - 30 minutes of writing, directly improves ChatGPT/Perplexity/Claude citations
4. **Add "Merge Tactics" to Pixel + Skin H1** (H1) - two single-line edits, improves keyword targeting for both pages
5. **Add security headers** (C3) - one block added to next.config.ts, fixes all 5 missing headers at once

---

## Schema Entity Map (current state)

```
Organization  @id: /#organization         (layout.tsx)
WebSite       @id: /#website              (page.tsx) - MISSING publisher link
WebApplication @id: /{slug}#game          (GameSchema.tsx per page)
BreadcrumbList @id: /{slug}#breadcrumb    (GameSchema.tsx per page)
FAQPage        @id: /{slug}#faq           (GameSchema.tsx per page)

MISSING: WebPage node on each game page
MISSING: WebPage -> Organization link
MISSING: WebSite -> Organization publisher link
```

---

## AI Crawler Access (current state)

| Crawler | Status |
|---|---|
| GPTBot (OpenAI training) | Explicitly allowed |
| OAI-SearchBot (ChatGPT citations) | NOT LISTED - falls to wildcard only |
| ClaudeBot | Explicitly allowed |
| PerplexityBot | Explicitly allowed |
| GoogleOther | Explicitly allowed |
| Applebot-Extended | NOT LISTED |
| CCBot (Common Crawl) | Wildcard (allowed) |

---

## llms.txt Status

| Check | Status |
|---|---|
| File present at /llms.txt | PASS |
| Site description block | PASS (minimal - 1 sentence) |
| Per-game descriptions with prose | FAIL - under 20 words each |
| About Merge Tactics context block | FAIL - absent |
| Contact / License block | FAIL - absent |
| /llms-full.txt companion | FAIL - absent |

---

## Sitemap Coverage (current state)

| Route | In sitemap | lastModified | Notes |
|---|---|---|---|
| / | YES | static 2026-03-21 | correct |
| /classic | YES | new Date() | NEEDS FIX - always today |
| /pixel | YES | new Date() | NEEDS FIX - always today |
| /skin | YES | new Date() | NEEDS FIX - always today |
| /about-us | YES | static 2026-03-21 | correct |
| /privacy-policy | YES | static 2026-03-21 | correct |
| /terms-of-service | YES | static 2026-03-21 | correct |
| /description | NO | - | correctly excluded |
| Images | NO | - | MISSING - add game logos |
