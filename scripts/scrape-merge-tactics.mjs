/**
 * scrape-merge-tactics.mjs
 *
 * Scrapes Merge Tactics data from the Clash Royale fandom wiki using Playwright.
 *
 * Cards   → https://clashroyale.fandom.com/wiki/{CardName}/Merge_Tactics
 * Rulers  → https://clashroyale.fandom.com/wiki/{RulerName}
 * Images  → https://clashroyale.fandom.com/wiki/Special:FilePath/{FileName}  (predictable CDN redirect)
 *
 * Setup (one-time):
 *   npm install -D playwright
 *   npx playwright install chromium --with-deps
 *
 * Usage:
 *   node scripts/scrape-merge-tactics.mjs
 */

import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

// ── Download helper (follows redirects) ──────────────────────────────────────
function downloadFile(url, destPath, _origin) {
  return new Promise((resolve) => {
    if (!url) { resolve(false); return; }
    const mod = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(destPath);
    const req = mod.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303) {
        file.close();
        fs.unlink(destPath, () => {});
        let location = res.headers.location;
        // Handle relative redirect URLs by resolving against the request origin
        if (location && !location.startsWith("http")) {
          try { location = new URL(location, url).href; } catch { resolve(false); return; }
        }
        downloadFile(location, destPath).then(resolve);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(destPath, () => {});
        resolve(false);
        return;
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(true); });
    });
    req.on("error", () => { file.close(); fs.unlink(destPath, () => {}); resolve(false); });
  });
}

// ── Name → Fandom Special:FilePath image URL ─────────────────────────────────
// Pattern observed: "Archers" → "ArchersCardMergeTactics.png"
function cardImageFileUrl(name) {
  const fname = name.replace(/\s+/g, "") + "CardMergeTactics.png";
  return `https://clashroyale.fandom.com/wiki/Special:FilePath/${encodeURIComponent(fname)}`;
}

function rulerImageFileUrl(name) {
  const fname = name.replace(/\s+/g, "") + "RulerCard.png";
  return `https://clashroyale.fandom.com/wiki/Special:FilePath/${encodeURIComponent(fname)}`;
}

// Card image basename — must match lib/card-stats.ts cardImagePath()
const CARD_IMAGE_BASENAME_OVERRIDES = {
  mini_pekka: "MiniPEKKA",
  pekka: "PEKKA",
};
function cardImageBasename(card) {
  if (CARD_IMAGE_BASENAME_OVERRIDES[card.key]) return CARD_IMAGE_BASENAME_OVERRIDES[card.key];
  return card.name.replace(/\s+/g, "");
}

// Ruler portrait: Title-Dash (unchanged)
function keyToFilename(key) {
  return key.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("-");
}

// ── Display-name trait → key ──────────────────────────────────────────────────
// e.g. "P.E.K.K.A" → "pekka",  "Brawler" → "brawler"
function traitDisplayToKey(display) {
  if (!display) return "none";
  return display.toLowerCase().replace(/[^a-z0-9]/g, "") || "none";
}

// ── "30 June 2025" → "2025-06-30" ────────────────────────────────────────────
const MONTH_MAP = {
  january:"01", february:"02", march:"03", april:"04",
  may:"05", june:"06", july:"07", august:"08",
  september:"09", october:"10", november:"11", december:"12",
};
function parseReleaseDate(text) {
  if (!text) return null;
  // ISO
  const iso = text.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
  if (iso) return iso[1];
  // "30 June 2025" or "June 30, 2025"
  const long = text.match(/(\d{1,2})\s+([A-Za-z]+)\s+(20\d{2})/);
  if (long) {
    const m = MONTH_MAP[long[2].toLowerCase()];
    if (m) return `${long[3]}-${m}-${long[1].padStart(2, "0")}`;
  }
  const long2 = text.match(/([A-Za-z]+)\s+(\d{1,2}),?\s+(20\d{2})/);
  if (long2) {
    const m = MONTH_MAP[long2[1].toLowerCase()];
    if (m) return `${long2[3]}-${m}-${long2[2].padStart(2, "0")}`;
  }
  // bare year
  const year = text.match(/\b(20\d{2})\b/);
  if (year) return `${year[1]}-01-01`;
  return null;
}

// ── Card definitions ──────────────────────────────────────────────────────────
const CARDS = [
  // Common Troops
  { key: "archers",          name: "Archers",           rarity: "Common",    cardType: "Troop" },
  { key: "knight",           name: "Knight",             rarity: "Common",    cardType: "Troop" },
  { key: "spear_goblins",    name: "Spear Goblins",      rarity: "Common",    cardType: "Troop" },
  { key: "goblins",          name: "Goblins",            rarity: "Common",    cardType: "Troop" },
  { key: "bomber",           name: "Bomber",             rarity: "Common",    cardType: "Troop" },
  { key: "skeletons",        name: "Skeletons",          rarity: "Common",    cardType: "Troop" },
  { key: "barbarians",       name: "Barbarians",         rarity: "Common",    cardType: "Troop" },
  { key: "skeleton_dragons", name: "Skeleton Dragons",   rarity: "Common",    cardType: "Troop" },
  { key: "royal_giant",      name: "Royal Giant",        rarity: "Common",    cardType: "Troop" },
  // Rare Troops
  { key: "mini_pekka",       name: "Mini P.E.K.K.A.",    rarity: "Rare",      cardType: "Troop" },
  { key: "musketeer",        name: "Musketeer",          rarity: "Rare",      cardType: "Troop" },
  { key: "giant",            name: "Giant",              rarity: "Rare",      cardType: "Troop" },
  { key: "valkyrie",         name: "Valkyrie",           rarity: "Rare",      cardType: "Troop" },
  { key: "wizard",           name: "Wizard",             rarity: "Rare",      cardType: "Troop" },
  { key: "dart_goblin",      name: "Dart Goblin",        rarity: "Rare",      cardType: "Troop" },
  { key: "goblin_demolisher",name: "Goblin Demolisher",  rarity: "Rare",      cardType: "Troop" },
  // Epic Troops
  { key: "baby_dragon",      name: "Baby Dragon",        rarity: "Epic",      cardType: "Troop" },
  { key: "witch",            name: "Witch",              rarity: "Epic",      cardType: "Troop" },
  { key: "pekka",            name: "P.E.K.K.A.",         rarity: "Epic",      cardType: "Troop", wikiSlug: "P.E.K.K.A." },
  { key: "prince",           name: "Prince",             rarity: "Epic",      cardType: "Troop" },
  { key: "giant_skeleton",   name: "Giant Skeleton",     rarity: "Epic",      cardType: "Troop" },
  { key: "electro_giant",    name: "Electro Giant",      rarity: "Epic",      cardType: "Troop" },
  { key: "executioner",      name: "Executioner",        rarity: "Epic",      cardType: "Troop" },
  // Legendary Troops
  { key: "mega_knight",      name: "Mega Knight",        rarity: "Legendary", cardType: "Troop" },
  { key: "electro_wizard",   name: "Electro Wizard",     rarity: "Legendary", cardType: "Troop" },
  { key: "princess",         name: "Princess",           rarity: "Legendary", cardType: "Troop" },
  { key: "royal_ghost",      name: "Royal Ghost",        rarity: "Legendary", cardType: "Troop" },
  { key: "bandit",           name: "Bandit",             rarity: "Legendary", cardType: "Troop" },
  { key: "goblin_machine",   name: "Goblin Machine",     rarity: "Legendary", cardType: "Troop" },
  // Champion Troops
  { key: "golden_knight",    name: "Golden Knight",      rarity: "Champion",  cardType: "Troop" },
  { key: "skeleton_king",    name: "Skeleton King",      rarity: "Champion",  cardType: "Troop" },
  { key: "archer_queen",     name: "Archer Queen",       rarity: "Champion",  cardType: "Troop" },
  { key: "monk",             name: "Monk",               rarity: "Champion",  cardType: "Troop" },
  // Buildings
  { key: "mortar",           name: "Mortar",             rarity: "Common",    cardType: "Building" },
  { key: "tesla",            name: "Tesla",              rarity: "Common",    cardType: "Building" },
  { key: "inferno_tower",    name: "Inferno Tower",      rarity: "Rare",      cardType: "Building" },
  { key: "elixir_collector", name: "Elixir Collector",   rarity: "Rare",      cardType: "Building" },
  { key: "x_bow",            name: "X-Bow",              rarity: "Epic",      cardType: "Building", wikiSlug: "X-Bow" },
];

// ── Ruler definitions ─────────────────────────────────────────────────────────
const RULERS = [
  { key: "royale_king",    name: "Royale King",    wikiSlug: "Royale_King_(Merge_Tactics)" },
  { key: "spirit_empress", name: "Spirit Empress", wikiSlug: "Spirit_Empress_(Merge_Tactics)" },
  { key: "goblin_queen",   name: "Goblin Queen",   wikiSlug: "Goblin_Queen_(Merge_Tactics)" },
  { key: "elixir_loong",   name: "Elixir Loong",   wikiSlug: "Elixir_Loong_(Merge_Tactics)" },
  { key: "battle_machine", name: "Battle Machine", wikiSlug: "Battle_Machine_(Merge_Tactics)" },
  { key: "echo_sage",      name: "Echo Sage",      wikiSlug: "Echo_Sage_(Merge_Tactics)" },
  { key: "dagger_duchess", name: "Dagger Duchess", wikiSlug: "Dagger_Duchess_(Merge_Tactics)" },
];

// ── Scrape a card's /Merge_Tactics wiki page ──────────────────────────────────
async function scrapeCardPage(page, card) {
  const slug = card.wikiSlug ?? card.name.replace(/\s+/g, "_");
  const url = `https://clashroyale.fandom.com/wiki/${slug}/Merge_Tactics`;

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    const data = await page.evaluate(() => {
      const result = {};

      // ── Helper: get pi-data-value by label text ──────────────────────────────
      function getLabelValue(...labels) {
        const labelEls = document.querySelectorAll(".pi-data-label");
        for (const el of labelEls) {
          const txt = el.textContent.trim().toLowerCase();
          for (const lbl of labels) {
            if (txt === lbl.toLowerCase()) {
              const val = el.closest(".pi-data")?.querySelector(".pi-data-value");
              if (val) return val.textContent.trim();
            }
          }
        }
        // Fallback: check table rows
        const tds = document.querySelectorAll("td, th");
        for (const td of tds) {
          const txt = td.textContent.trim().toLowerCase();
          for (const lbl of labels) {
            if (txt === lbl.toLowerCase()) {
              const next = td.nextElementSibling;
              if (next) return next.textContent.trim();
            }
          }
        }
        return null;
      }

      // ── Description: first try blockquote, then first real paragraph ─────────
      result.description = (() => {
        const bq = document.querySelector(".mw-parser-output blockquote");
        if (bq) {
          const t = bq.textContent.trim().replace(/\s+/g, " ");
          if (t.length > 5) return t;
        }
        // fallback: first non-empty paragraph
        const paras = document.querySelectorAll(".mw-parser-output > p");
        for (const p of paras) {
          const t = p.textContent.trim();
          if (t.length > 10) return t;
        }
        return null;
      })();

      // ── Golden Elixir Cost ───────────────────────────────────────────────────
      result.elixirCost = getLabelValue("Golden Elixir Cost", "Elixir Cost", "Cost", "Elixir");

      // ── Primary / Secondary Trait ────────────────────────────────────────────
      result.primaryTrait   = getLabelValue("Primary Trait", "Trait");
      result.secondaryTrait = getLabelValue("Secondary Trait");

      // ── Card Type ────────────────────────────────────────────────────────────
      result.type = getLabelValue("Type", "Card Type", "Unit Type");

      // ── Release Date ─────────────────────────────────────────────────────────
      result.releaseDate = getLabelValue("Release Date", "Released", "Added");
      if (!result.releaseDate) {
        // Scan history section for first date-like text
        const headings = document.querySelectorAll("h2, h3");
        for (const h of headings) {
          if (h.textContent.trim().toLowerCase().includes("histor")) {
            let el = h.nextElementSibling;
            for (let i = 0; i < 15 && el; i++) {
              const txt = el.textContent;
              const m = txt.match(/\b(\d{1,2}\s+[A-Za-z]+\s+20\d{2}|20\d{2}-\d{2}-\d{2})\b/);
              if (m) { result.releaseDate = m[1]; break; }
              el = el.nextElementSibling;
            }
          }
        }
      }

      // ── Infobox image (fallback if Special:FilePath misses) ─────────────────
      result.imageUrl = (() => {
        const imgs = document.querySelectorAll(".pi-image img, .portable-infobox img, .infobox img");
        for (const img of imgs) {
          const src = img.getAttribute("data-src") || img.getAttribute("src") || "";
          if (src && !src.includes("data:image") && !src.includes("placeholder")) {
            return src
              .replace(/\/scale-to-width-down\/\d+/, "")
              .replace(/\/revision\/latest\/[^?]*/, "/revision/latest");
          }
        }
        return null;
      })();

      return result;
    });

    return { ...data, url, success: true };
  } catch (e) {
    return { url, success: false, error: e.message };
  }
}

// ── Scrape a ruler's wiki page ────────────────────────────────────────────────
async function scrapeRulerPage(page, ruler) {
  // Try Merge_Tactics subpage first, fall back to main page
  const slugsToTry = [
    `https://clashroyale.fandom.com/wiki/${ruler.wikiSlug}`,
    `https://clashroyale.fandom.com/wiki/${ruler.name.replace(/\s+/g, "_")}`,
  ];

  for (const url of slugsToTry) {
    try {
      const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      if (!res || res.status() === 404) continue;

      const data = await page.evaluate(() => {
        const result = {};

        function getLabelValue(...labels) {
          const labelEls = document.querySelectorAll(".pi-data-label");
          for (const el of labelEls) {
            const txt = el.textContent.trim().toLowerCase();
            for (const lbl of labels) {
              if (txt === lbl.toLowerCase()) {
                const val = el.closest(".pi-data")?.querySelector(".pi-data-value");
                if (val) return val.textContent.trim();
              }
            }
          }
          return null;
        }

        result.description = (() => {
          const bq = document.querySelector(".mw-parser-output blockquote");
          if (bq) {
            const t = bq.textContent.trim().replace(/\s+/g, " ");
            if (t.length > 5) return t;
          }
          const paras = document.querySelectorAll(".mw-parser-output > p");
          for (const p of paras) {
            const t = p.textContent.trim();
            if (t.length > 10) return t;
          }
          return null;
        })();

        result.modifierName = getLabelValue("Modifier", "Modifier Name", "Ability", "Passive");
        result.modifierDescription = getLabelValue("Modifier Description", "Ability Description", "Passive Description");

        result.skins = (() => {
          const names = [];
          const headings = document.querySelectorAll("h2, h3");
          for (const h of headings) {
            if (h.textContent.trim().toLowerCase().includes("skin")) {
              let el = h.nextElementSibling;
              for (let i = 0; i < 20 && el; i++) {
                el.querySelectorAll(".lightbox-caption, .gallery-box-title, .wikia-gallery-item figcaption").forEach((item) => {
                  const t = item.textContent.trim();
                  if (t && t.length > 1 && t.length < 60) names.push(t);
                });
                if (names.length > 0) break;
                el = el.nextElementSibling;
              }
            }
          }
          return names.length > 0 ? names : ["Default"];
        })();

        result.imageUrl = (() => {
          const imgs = document.querySelectorAll(".pi-image img, .portable-infobox img");
          for (const img of imgs) {
            const src = img.getAttribute("data-src") || img.getAttribute("src") || "";
            if (src && !src.includes("data:image") && !src.includes("placeholder")) {
              return src
                .replace(/\/scale-to-width-down\/\d+/, "")
                .replace(/\/revision\/latest\/[^?]*/, "/revision/latest");
            }
          }
          return null;
        })();

        return result;
      });

      return { ...data, url, success: true };
    } catch (e) {
      continue;
    }
  }
  return { success: false, error: "Page not found" };
}

// ── Generate TypeScript output ────────────────────────────────────────────────
function generateCardStatsTs(scrapedCards) {
  const existingPath = path.join(ROOT, "lib", "card-stats.ts");
  let src = fs.existsSync(existingPath) ? fs.readFileSync(existingPath, "utf8") : "";

  for (const card of CARDS) {
    const scraped = scrapedCards[card.key];
    if (!scraped?.success) continue;

    if (scraped.elixirCost) {
      const cost = parseInt(scraped.elixirCost);
      if (!isNaN(cost)) {
        src = src.replace(
          new RegExp(`(  ${card.key}:[\\s\\S]*?elixirCost:\\s*)\\d+`),
          `$1${cost}`
        );
      }
    }

    const date = parseReleaseDate(scraped.releaseDate);
    if (date) {
      src = src.replace(
        new RegExp(`(  ${card.key}:[\\s\\S]*?releaseDate:\\s*")([^"]+)"`),
        `$1${date}"`
      );
    }

    if (scraped.description && scraped.description.length > 10) {
      const escaped = scraped.description.replace(/"/g, '\\"').replace(/\n/g, " ").trim();
      src = src.replace(
        new RegExp(`(  ${card.key}:[\\s\\S]*?description:\\s*")([^"]+)"`),
        `$1${escaped}"`
      );
    }

    if (scraped.primaryTrait) {
      const key = traitDisplayToKey(scraped.primaryTrait);
      src = src.replace(
        new RegExp(`(  ${card.key}:[\\s\\S]*?primaryTrait:\\s*")([^"]+)"`),
        `$1${key}"`
      );
    }

    if (scraped.secondaryTrait) {
      const key = traitDisplayToKey(scraped.secondaryTrait);
      src = src.replace(
        new RegExp(`(  ${card.key}:[\\s\\S]*?secondaryTrait:\\s*")([^"]+)"`),
        `$1${key}"`
      );
    }
  }

  fs.writeFileSync(existingPath, src);
  console.log("✓ lib/card-stats.ts updated");
}

function generateRulerStatsTs(scrapedRulers) {
  // PATCH existing file — never overwrite manually-entered values
  const rulerPath = path.join(ROOT, "lib", "ruler-stats.ts");
  let src = fs.existsSync(rulerPath) ? fs.readFileSync(rulerPath, "utf8") : "";

  for (const ruler of RULERS) {
    const scraped = scrapedRulers[ruler.key];
    if (!scraped?.success) continue;

    // Only patch a field if the scraped value is non-trivial AND the existing value looks like a placeholder
    if (scraped.description && scraped.description.length > 10) {
      const escaped = scraped.description.replace(/"/g, '\\"').replace(/\n/g, " ").trim();
      // Only replace if current value looks like auto-generated placeholder
      src = src.replace(
        new RegExp(`(  ${ruler.key}:[\\s\\S]*?description:\\s*")(The ${ruler.name}\\.|TBD[^"]*)`),
        `$1${escaped}`
      );
    }

    if (scraped.modifierName && scraped.modifierName !== "Unknown") {
      const escaped = scraped.modifierName.replace(/"/g, '\\"');
      src = src.replace(
        new RegExp(`(  ${ruler.key}:[\\s\\S]*?modifierName:\\s*")(Unknown)`),
        `$1${escaped}`
      );
    }

    if (scraped.modifierDescription && scraped.modifierDescription !== "TBD") {
      const escaped = scraped.modifierDescription.replace(/"/g, '\\"').replace(/\n/g, " ").trim();
      src = src.replace(
        new RegExp(`(  ${ruler.key}:[\\s\\S]*?modifierDescription:\\s*")(TBD[^"]*)`),
        `$1${escaped}`
      );
    }
  }

  if (src) {
    fs.writeFileSync(rulerPath, src);
    console.log("✓ lib/ruler-stats.ts patched (manual values preserved)");
  } else {
    console.log("⚠ lib/ruler-stats.ts not found — skipped");
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  let chromium;
  try {
    const pw = await import("playwright");
    chromium = pw.chromium;
  } catch {
    console.error("Playwright not installed. Run:");
    console.error("  npm install -D playwright && npx playwright install chromium --with-deps");
    process.exit(1);
  }

  fs.mkdirSync(path.join(ROOT, "public", "Cards"),  { recursive: true });
  fs.mkdirSync(path.join(ROOT, "public", "Rulers"), { recursive: true });

  const cardsCachePath  = path.join(__dirname, "scraped-cards.json");
  const rulersCachePath = path.join(__dirname, "scraped-rulers.json");

  // Load caches — drop entries that have no imageUrl so images are re-attempted
  let scrapedCards  = fs.existsSync(cardsCachePath)
    ? JSON.parse(fs.readFileSync(cardsCachePath, "utf8")) : {};
  let scrapedRulers = fs.existsSync(rulersCachePath)
    ? JSON.parse(fs.readFileSync(rulersCachePath, "utf8")) : {};

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  // ── Cards ──────────────────────────────────────────────────────────────────
  console.log(`\n${"─".repeat(60)}`);
  console.log(`Cards (${CARDS.length})`);
  console.log("─".repeat(60));

  let cardCount = 0;
  for (const card of CARDS) {
    const cached = scrapedCards[card.key];
    const imgDest = path.join(ROOT, "public", "Cards", cardImageBasename(card) + ".webp");
    const imgExists = fs.existsSync(imgDest);

    // Re-scrape if not cached or if data fields are all null
    const needsScrape = !cached?.success ||
      (cached.elixirCost == null && cached.primaryTrait == null && cached.description == null);

    if (!needsScrape) {
      process.stdout.write(imgExists ? `  [cached+img] ${card.key}\n` : `  [cached, no img] ${card.key}\n`);
    } else {
      const result = await scrapeCardPage(page, card);
      scrapedCards[card.key] = result;
      cardCount++;

      const icon = result.success ? "✓" : "✗";
      const info = result.success
        ? `elixir=${result.elixirCost ?? "?"} primary="${result.primaryTrait ?? "?"}" date=${result.releaseDate ?? "?"}`
        : result.error;
      console.log(`  ${icon} ${card.key.padEnd(22)} ${info}`);

      if (cardCount % 5 === 0) fs.writeFileSync(cardsCachePath, JSON.stringify(scrapedCards, null, 2));
      await new Promise((r) => setTimeout(r, 500));
    }

    // Download image — try Special:FilePath first, fall back to scraped imageUrl
    if (!imgExists) {
      const urls = [
        cardImageFileUrl(card.name),
        scrapedCards[card.key]?.imageUrl,
      ].filter(Boolean);

      let downloaded = false;
      for (const url of urls) {
        const ok = await downloadFile(url, imgDest);
        if (ok) {
          console.log(`    [img: ${cardImageBasename(card)}.webp ✓ from ${url.includes("Special") ? "Special:FilePath" : "infobox"}]`);
          downloaded = true;
          break;
        }
      }
      if (!downloaded) console.log(`    [img: ${cardImageBasename(card)}.webp ✗ — not found on wiki yet]`);
    }
  }

  fs.writeFileSync(cardsCachePath, JSON.stringify(scrapedCards, null, 2));
  console.log(`\n✓ scraped-cards.json saved`);

  // ── Rulers ─────────────────────────────────────────────────────────────────
  console.log(`\n${"─".repeat(60)}`);
  console.log(`Rulers (${RULERS.length})`);
  console.log("─".repeat(60));

  for (const ruler of RULERS) {
    const cached   = scrapedRulers[ruler.key];
    const imgDest  = path.join(ROOT, "public", "Rulers", keyToFilename(ruler.key) + ".webp");
    const imgExists = fs.existsSync(imgDest);

    const needsScrape = !cached?.success;

    if (!needsScrape) {
      process.stdout.write(imgExists ? `  [cached+img] ${ruler.key}\n` : `  [cached, no img] ${ruler.key}\n`);
    } else {
      const result = await scrapeRulerPage(page, ruler);
      scrapedRulers[ruler.key] = result;

      const icon = result.success ? "✓" : "✗";
      const info = result.success
        ? `modifier="${result.modifierName ?? "?"}" skins=${result.skins?.length ?? 0}`
        : result.error;
      console.log(`  ${icon} ${ruler.key.padEnd(22)} ${info}`);

      await new Promise((r) => setTimeout(r, 500));
    }

    if (!imgExists) {
      const urls = [
        rulerImageFileUrl(ruler.name),
        scrapedRulers[ruler.key]?.imageUrl,
      ].filter(Boolean);

      let downloaded = false;
      for (const url of urls) {
        console.log(`    trying img: ${url}`);
        const ok = await downloadFile(url, imgDest);
        if (ok) {
          console.log(`    [img: ${keyToFilename(ruler.key)}.webp ✓]`);
          downloaded = true;
          break;
        } else {
          console.log(`    → failed`);
        }
      }
      if (!downloaded) console.log(`    [img: ${keyToFilename(ruler.key)}.webp ✗ — not found on wiki yet]`);
    }
  }

  fs.writeFileSync(rulersCachePath, JSON.stringify(scrapedRulers, null, 2));
  console.log(`\n✓ scraped-rulers.json saved`);

  await browser.close();

  // ── Write TS files ────────────────────────────────────────────────────────
  console.log(`\n${"─".repeat(60)}`);
  console.log("Writing TS data files…");
  console.log("─".repeat(60));

  generateCardStatsTs(scrapedCards);
  generateRulerStatsTs(scrapedRulers);

  console.log("\nDone!");
  console.log("  Card images  → public/Cards/");
  console.log("  Ruler images → public/Rulers/");
  console.log("  Re-run to pick up any missing images as the wiki fills out.");
}

main().catch((e) => { console.error(e); process.exit(1); });
