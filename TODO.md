# Mergedle TODO

## Critical — won't work without these
- [ ] Add og:image (public/og/defaultogimage.webp — 1200×630px)
- [ ] Add 3 game logos + 1 coming-soon to public/Game-Logos/
- [ ] Add tactician card art to public/Tacticians/ (one WebP per tactician)
- [ ] Add skin images to public/Skins/ (match imagePath in skin-cards.ts)
- [ ] Add MergeTactics.ttf to public/fonts/
- [ ] Add hero background to public/homepage/background.webp

## High Priority — Content Data
- [ ] Fill tactician-stats.ts with all tacticians (fields: name, elixirCost, primaryTrait, secondaryTrait, type, releaseDate, description, hasSkins)
- [ ] Fill traits.ts with all traits (fields: key, name, combatStart, effect2, effect4, traitType, releaseDate, currentlyActive)
- [ ] Fill skin-cards.ts (only tacticians with hasSkins: true, at least one skin each)

## High Priority — SEO
- [ ] Verify GameSchema renders on all 3 game pages
- [ ] Create public/llms.txt listing all active game URLs
- [ ] Add FAQ section (SSR, in page.tsx) to all game pages (4+ questions each)
- [ ] Add "More Games" section to all game pages
- [ ] Verify public/og/defaultogimage.webp exists and is 1200×630px

## Medium Priority
- [ ] DailyProgress dots on all game pages
- [ ] StreakBadge component
- [ ] DailyResetTimer in AlreadyPlayedSummary
- [ ] Mobile responsiveness on HomeInfographic SVG
- [ ] Test seed consistency (same tactician for all users on same UTC date)
- [ ] Verify getValidSkinPool() correctly filters orphan skins

## Future Game Modes (backlog — fill mode-4 and mode-5 slots)
- [ ] Trait Wordle — guess the trait from effect descriptions
- [ ] Decide and implement mode-5

## Completed
- [x] Initial scaffold created
- [x] Full project scaffolded — all files created
