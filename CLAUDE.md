# Mergedle — Claude Context

## What This Project Is
Mergedle (mergedle.com) is an unofficial Merge Tactics fan site with 3 active + 2 coming-soon Wordle-style daily puzzle games. No accounts, no server — all game state lives in localStorage. Daily cards are seeded deterministically by UTC date + game slug.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15+ (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Language | TypeScript |
| Fonts | Geist, Geist Mono (via `next/font/google`) + Merge Tactics (TTF, self-hosted in `/public/fonts/`) |
| Analytics | @vercel/analytics + @vercel/speed-insights |
| Deployment | Vercel |
| State | localStorage only — no DB, no auth, no API routes |
| Images | WebP |

## Folder Structure
```
mergedle/
├── app/
│   ├── layout.tsx          ← root layout: fonts, metadata, Footer, Analytics
│   ├── page.tsx            ← homepage: HomeInfographic + hero
│   ├── classic/            ← daily: guess card from stat clues
│   ├── pixel/              ← daily: guess card from pixelated card image
│   ├── skin/               ← daily: guess card from skin image
│   ├── about-us/
│   ├── privacy-policy/
│   └── terms-of-service/
├── components/
│   ├── seo/
│   │   └── GameSchema.tsx  ← JSON-LD schema (must be used in every game page)
│   ├── HomeInfographic.tsx ← 5-node SVG orbit (3 active, 2 coming-soon greyed)
│   ├── DailyGameGuard.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/
│   ├── content.ts              ← SITE config, GAME_META, getGameLogoPath
│   ├── daily.ts                ← daily seed logic, localStorage
│   ├── card-stats.ts           ← Classic + Pixel game card pool + stats
│   ├── traits.ts               ← trait data (display clues + future modes)
│   ├── skin-cards.ts           ← Skin game pool
│   └── streakManager.ts
└── public/
    ├── Tacticians/    ← card art WebP
    ├── Skins/         ← skin WebP images
    ├── Game-Logos/    ← 3 active + 1 coming-soon logo
    ├── fonts/         ← MergeTactics.ttf
    ├── homepage/      ← background.webp
    └── og/            ← defaultogimage.webp (1200×630)
```

## Working Rules
- **Always update `TODO.md`** after completing any task — mark items `[x]` as soon as done
- **Always update "Completed Tasks"** at the bottom of this file when a task is finished
- **Always update "What's Being Worked On"** if focus shifts
- At the start of any SEO-related session, read `.claude/skills/SEO_SKILL.md` first

---

## Key Rules & Constraints
- **Unofficial fan content** — footer must always include Supercell disclaimer. Never remove it.
- **No accounts / no backend** — all state in `localStorage`. No server-side state or auth.
- **Daily seed = `dayKey + "_" + gameSlug`** — changing this string changes every user's daily card. Be careful.
- **localStorage prefix is `mergedle_`** — never use any other prefix.
- **`GameSchema` must be used on every active game page** — import from `components/seo/GameSchema.tsx`.
- **Single H1 per page** — the mechanic subtitle is `<h2>`, never a second `<h1>`.
- **Card image paths**: `/Tacticians/{Title-Case-Dashes}.webp` (e.g. `archer_queen` → `Archer-Queen.webp`).
- **`comingSoon` game slots have no routes** — greyed out in HomeInfographic only, excluded from sitemap.
- **`getValidSkinPool()`** — always use this, not raw `SKIN_POOL`, in DailyGameGuard.

## Two Core Data Types
1. **Card** — `lib/card-stats.ts` — the guessable object in all modes
   - Fields: name, elixirCost, primaryTrait, secondaryTrait, type, releaseDate, description, hasSkins
2. **Trait** — `lib/traits.ts` — displayed as clue labels in ClassicGame; used for future modes
   - Fields: key, name, combatStart, effect2, effect4, traitType, releaseDate, currentlyActive

## Environment Variables
| Var | Default | Purpose |
|-----|---------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://mergedle.com` | Canonical URL |
| `NEXT_PUBLIC_SITE_NAME` | `Mergedle` | Site name in OG tags |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `contact@mergedle.com` | Footer/privacy |

## SEO Status
- See `.claude/skills/SEO_SKILL.md` for all SEO rules
- No competitor analysis done yet — run a full audit before creating a competitor-gap.md
- Top 3 open SEO tasks: add `og:image`, use `GameSchema` on all game pages, add `llms.txt`

## What's Being Worked On
**Primary goal: launch Mergedle with 3 working daily game modes.**

**Active focus areas:**
1. Initial project setup — all 3 game pages rendering with real data
2. Fill card data in `lib/card-stats.ts` (all fields required)
3. Fill trait data in `lib/traits.ts`
4. Fill skin pool in `lib/skin-cards.ts` (only cards where hasSkins: true)
5. Critical SEO: og:image, GameSchema on all pages, llms.txt

## Completed Tasks
- [x] Initial scaffold created (mergdle_scaffold.md)
- [x] Full project scaffolded — all files created
- [x] Removed "Coming Soon" slots from homepage game list (HomeInfographic now shows active games only)
- [x] Removed Pixel helper text line under the image/search area
- [x] Removed Skin helper text line under the image/search area
- [x] Fixed Pixel blank-image days by restricting rulers to keys with shipped local ruler art
- [x] Restyled game-page question-mark help button to match requested icon design
- [x] Fixed Royale King skin asset paths for Marble/Santa/Velvet/Ghoul in skin pool
- [x] Fixed Pixel mode persistence so wrong-guess progress restores after leaving and returning
- [x] Added the "Want more?" Royaledly box to all game pages via shared GamePageBackground
