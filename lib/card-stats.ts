// AUTO-GENERATED (partially) by scripts/scrape-merge-tactics.mjs — fill real data after scraping

export type CardRarity = "Common" | "Rare" | "Epic" | "Legendary" | "Champion";
export type CardType = "Troop" | "Building" | "Spawn/Swarm";
// Role only applies to Troops; null for Buildings
export type TroopRole = "Melee" | "Ranged" | "Flying" | "Support" | "Tank" | "Magic";

export interface CardStats {
  name: string;
  rarity: CardRarity;           // Common → Rare → Epic → Legendary → Champion (ordered for compare)
  elixirCost: number;           // 1–10, numeric compare (higher/lower)
  primaryTrait: string;         // trait key, e.g. "noble" — categorical (correct/wrong)
  secondaryTrait: string;       // trait key or "none" — categorical (correct/wrong)
  cardType: CardType;           // categorical: Troop vs Building
  troopRole: TroopRole | null;  // null for Buildings
  releaseDate: string;          // "YYYY-MM-DD"
  description: string;          // in-game description / ability text
}

export const RARITY_ORDER: CardRarity[] = [
  "Common", "Rare", "Epic", "Legendary", "Champion",
];

// Key: lowercase snake_case slug — art in public/Cards/ (see cardImagePath; basename = Title per segment, underscores kept)
export const CARD_STATS: Record<string, CardStats> = {
  // ─── Common Troops ──────────────────────────────────────────────────────────
  archers: {
    name: "Archers",
    rarity: "Common",
    elixirCost: 2,
    primaryTrait: "marksman",
    secondaryTrait: "none",
    cardType: "Troop",
    troopRole: "Ranged",
    releaseDate: "2025-30-06",
    description: "Who needs all that armor when you've got wicked range and hot pink hair?",
  },
  knight: {
    name: "Knight",
    rarity: "Common",
    elixirCost: 2,
    primaryTrait: "noble",
    secondaryTrait: "juggernaut",
    cardType: "Troop",
    troopRole: "Melee",
    releaseDate: "2025-06-30",
    description: "One of the toughest melee fighters in the kingdom",
  },
  spear_goblins: {
    name: "Spear Goblins",
    rarity: "Common",
    elixirCost: 2,
    primaryTrait: "goblin",
    secondaryTrait: "blaster",
    cardType: "Troop",
    troopRole: "Ranged",
    releaseDate: "2025-06-30",
    description:
      "Spears that slice through wind at such a wide range that he doesn't even need armor",
  },
  goblins: {
    name: "Goblins",
    rarity: "Common",
    elixirCost: 2,
    primaryTrait: "goblin",
    secondaryTrait: "assassin",
    cardType: "Troop",
    troopRole: "Melee",
    releaseDate: "2025-06-30",
    description: "Goblin speed and melee skills eliminate the need for that pesky armor",
  },
  bomber: {
    name: "Bomber",
    rarity: "Common",
    elixirCost: 2,
    primaryTrait: "undead",
    secondaryTrait: "blaster",
    cardType: "Troop",
    troopRole: "Ranged",
    releaseDate: "2025-06-30",
    description: "Throws a bomb at the nearest enemy, dealing Damage in a 2-Hex Radius",
  },
  skeletons: {
    name: "Skeletons",
    rarity: "Common",
    elixirCost: 0,
    primaryTrait: "undead",
    secondaryTrait: "none",
    cardType: "Spawn/Swarm",
    troopRole: "Melee",
    releaseDate: "2025-06-30",
    description: "A small melee fighter who won't stop until he's been defeated...again",
  },
  barbarians: {
    name: "Barbarians",
    rarity: "Common",
    elixirCost: 2,
    primaryTrait: "clan",
    secondaryTrait: "brawler",
    cardType: "Troop",
    troopRole: "Melee",
    releaseDate: "2025-06-30",
    description: "An all-around melee attacker with a mean mustache",
  },
  skeleton_dragons: {
    name: "Skeleton Dragons",
    rarity: "Common",
    elixirCost: 2,
    primaryTrait: "undead",
    secondaryTrait: "ranger",
    cardType: "Troop",
    troopRole: "Flying",
    releaseDate: "2025-09-29",
    description: "Splits to create a new Skeleton Dragon after every few attacks",
  },
  royal_giant: {
    name: "Royal Giant",
    rarity: "Common",
    elixirCost: 2,
    primaryTrait: "giant",
    secondaryTrait: "ranger",
    cardType: "Troop",
    troopRole: "Tank",
    releaseDate: "2025-11-24",
    description: "A slow, tanky ranger whose crown is heavier than his cannon",
  },
  // ─── Rare Troops ────────────────────────────────────────────────────────────
  mini_pekka: {
    name: "Mini P.E.K.K.A.",
    rarity: "Rare",
    elixirCost: 2,
    primaryTrait: "pekka",
    secondaryTrait: "brutalist",
    cardType: "Troop",
    troopRole: "Melee",
    releaseDate: "2025-11-24",
    description: "A lightly armored heavy hitter with a soft spot for pancakes",
  },
  musketeer: {
    name: "Musketeer",
    rarity: "Rare",
    elixirCost: 3,
    primaryTrait: "marksman",
    secondaryTrait: "none",
    cardType: "Troop",
    troopRole: "Ranged",
    releaseDate: "2024-01-01",
    description: "A tanky gunner who pushes 3 enemies back every few hits",
  },
  giant: {
    name: "Giant",
    rarity: "Rare",
    elixirCost: 3,
    primaryTrait: "giant",
    secondaryTrait: "titan",
    cardType: "Troop",
    troopRole: "Tank",
    releaseDate: "2024-01-01",
    description: "Throws the nearest enemy every few seconds, dealing damage based on target's max HP.",
  },
  valkyrie: {
    name: "Valkyrie",
    rarity: "Rare",
    elixirCost: 3,
    primaryTrait: "warrior",
    secondaryTrait: "none",
    cardType: "Troop",
    troopRole: "Melee",
    releaseDate: "2024-01-01",
    description: "A melee master who channels her rage into area Damage",
  },
  wizard: {
    name: "Wizard",
    rarity: "Rare",
    elixirCost: 2,
    primaryTrait: "mage",
    secondaryTrait: "fire",
    cardType: "Troop",
    troopRole: "Magic",
    releaseDate: "2024-01-01",
    description: "Throws a fireball at enemies in the area",
  },
  dart_goblin: {
    name: "Dart Goblin",
    rarity: "Rare",
    elixirCost: 2,
    primaryTrait: "goblin",
    secondaryTrait: "marksman",
    cardType: "Troop",
    troopRole: "Ranged",
    releaseDate: "2024-01-01",
    description: "An unarmored ranged attacker who runs fast, shoots far, and chews gum?",
  },
  goblin_demolisher: {
    name: "Goblin Demolisher",
    rarity: "Rare",
    elixirCost: 3,
    primaryTrait: "goblin",
    secondaryTrait: "thrower",
    cardType: "Troop",
    troopRole: "Ranged",
    releaseDate: "2024-03-01",
    description: "Rushes to lowest HP enemy and detonates below 50% HP with AoE damage",
  },
  // ─── Epic Troops ────────────────────────────────────────────────────────────
  baby_dragon: {
    name: "Baby Dragon",
    rarity: "Epic",
    elixirCost: 4,
    primaryTrait: "dragon",
    secondaryTrait: "fire",
    cardType: "Troop",
    troopRole: "Flying",
    releaseDate: "2024-01-01",
    description: "Burps big fireballs that deal damage in a wide area",
  },
  witch: {
    name: "Witch",
    rarity: "Epic",
    elixirCost: 4,
    primaryTrait: "undead",
    secondaryTrait: "mage",
    cardType: "Troop",
    troopRole: "Magic",
    releaseDate: "2024-01-01",
    description: "Every few seconds, she summons Skeletons with 20% of her max HP and Attack Damage",
  },
  pekka: {
    name: "P.E.K.K.A.",
    rarity: "Epic",
    elixirCost: 4,
    primaryTrait: "pekka",
    secondaryTrait: "brawler",
    cardType: "Troop",
    troopRole: "Melee",
    releaseDate: "2025-06-30",
    description: "A slow, but heavily armored melee fighter. Nothing gets past her…",
  },
  prince: {
    name: "Prince",
    rarity: "Epic",
    elixirCost: 4,
    primaryTrait: "noble",
    secondaryTrait: "warrior",
    cardType: "Troop",
    troopRole: "Melee",
    releaseDate: "2024-01-01",
    description: "Combat Start: Charges at the nearest target, dealing double Damage, pushing back enemies and stunning them for 2s",
  },
  giant_skeleton: {
    name: "Giant Skeleton",
    rarity: "Epic",
    elixirCost: 3,
    primaryTrait: "undead",
    secondaryTrait: "titan",
    cardType: "Troop",
    troopRole: "Tank",
    releaseDate: "2024-01-01",
    description: "Upon defeat, he drops a bomb that explodes after 1.5s, dealing Damage and stunning enemies in his Hex Radius for 2s",
  },
  electro_giant: {
    name: "Electro Giant",
    rarity: "Epic",
    elixirCost: 3,
    primaryTrait: "electric",
    secondaryTrait: "giant",
    cardType: "Troop",
    troopRole: "Tank",
    releaseDate: "2024-01-01",
    description:
      "Summons an electric field around himself, dealing damage and stunning nearby enemies every second",
  },
  executioner: {
    name: "Executioner",
    rarity: "Epic",
    elixirCost: 3,
    primaryTrait: "warrior",
    secondaryTrait: "thrower",
    cardType: "Troop",
    troopRole: "Ranged",
    releaseDate: "2024-01-01",
    description: "Throws his boomerang axe at the nearest target across several Hexes",
  },
  // ─── Legendary Troops ───────────────────────────────────────────────────────
  mega_knight: {
    name: "Mega Knight",
    rarity: "Legendary",
    elixirCost: 4,
    primaryTrait: "noble",
    secondaryTrait: "juggernaut",
    cardType: "Troop",
    troopRole: "Tank",
    releaseDate: "2024-01-01",
    description:
      "Jumps and strikes the largest group of enemies every few seconds, dealing damage and stunning enemies in its Hex Radius for 2s",
  },
  electro_wizard: {
    name: "Electro Wizard",
    rarity: "Legendary",
    elixirCost: 4,
    primaryTrait: "electric",
    secondaryTrait: "mage",
    cardType: "Troop",
    troopRole: "Magic",
    releaseDate: "2024-01-01",
    description: "Shoots lightning with his hands, stunning multiple enemies every few seconds",
  },
  princess: {
    name: "Princess",
    rarity: "Legendary",
    elixirCost: 4,
    primaryTrait: "noble",
    secondaryTrait: "marksman",
    cardType: "Troop",
    troopRole: "Ranged",
    releaseDate: "2024-01-01",
    description: "Fires flaming arrows at the farthest enemy, dealing Damage in a 2-Hex Radius",
  },
  royal_ghost: {
    name: "Royal Ghost",
    rarity: "Legendary",
    elixirCost: 4,
    primaryTrait: "noble",
    secondaryTrait: "assassin",
    cardType: "Troop",
    troopRole: "Melee",
    releaseDate: "2024-01-01",
    description: "Becomes invisible for 3s every few seconds",
  },
  bandit: {
    name: "Bandit",
    rarity: "Legendary",
    elixirCost: 4,
    primaryTrait: "assassin",
    secondaryTrait: "none",
    cardType: "Troop",
    troopRole: "Melee",
    releaseDate: "2024-01-01",
    description:
      "Dashes to the farthest enemy in 3 Hexes after certain hits, dealing bonus Damage and stunning all in her path for 1s",
  },
  goblin_machine: {
    name: "Goblin Machine",
    rarity: "Legendary",
    elixirCost: 5,
    primaryTrait: "goblin",
    secondaryTrait: "blaster",
    cardType: "Troop",
    troopRole: "Ranged",
    releaseDate: "2024-03-01",
    description: "Combat Start: Fires a rocket at the farthest enemy after certain hits, dealing 100% bonus Damage",
  },
  // ─── Champion Troops ────────────────────────────────────────────────────────
  golden_knight: {
    name: "Golden Knight",
    rarity: "Champion",
    elixirCost: 5,
    primaryTrait: "noble",
    secondaryTrait: "warrior",
    cardType: "Troop",
    troopRole: "Melee",
    releaseDate: "2024-01-01",
    description: "Dashes to the lowest HP enemy after defeating an enemy and deals bonus Damage",
  },
  skeleton_king: {
    name: "Skeleton King",
    rarity: "Champion",
    elixirCost: 5,
    primaryTrait: "undead",
    secondaryTrait: "noble",
    cardType: "Troop",
    troopRole: "Melee",
    releaseDate: "2024-01-01",
    description: "Deals Damage to enemies in a cone radius and summons a Skeleton for every enemy he defeats",
  },
  archer_queen: {
    name: "Archer Queen",
    rarity: "Champion",
    elixirCost: 5,
    primaryTrait: "marksman",
    secondaryTrait: "assassin",
    cardType: "Troop",
    troopRole: "Ranged",
    releaseDate: "2024-01-01",
    description: "Fires multiple arrows at her closest enemies. When her HP drops below 50%, she'll turn invisible and deal bonus Damage",
  },
  monk: {
    name: "Monk",
    rarity: "Champion",
    elixirCost: 5,
    primaryTrait: "brawler",
    secondaryTrait: "none",
    cardType: "Troop",
    troopRole: "Melee",
    releaseDate: "2024-01-01",
    description: "Creates a Shield that deflects damage onto the offender and heals Monk for a few seconds every few hits",
  },
  // ─── Buildings ──────────────────────────────────────────────────────────────
  mortar: {
    name: "Mortar",
    rarity: "Common",
    elixirCost: 0,
    primaryTrait: "blaster",
    secondaryTrait: "none",
    cardType: "Building",
    troopRole: null,
    releaseDate: "2024-01-01",
    description: "Long-range building that deals damage to the furthest enemy, shooting boulders that go boom!",
  },
  tesla: {
    name: "Tesla",
    rarity: "Common",
    elixirCost: 0,
    primaryTrait: "electric",
    secondaryTrait: "none",
    cardType: "Building",
    troopRole: null,
    releaseDate: "2024-01-01",
    description: "Deals damage to nearby enemies, only popping up when one's in range… or if it needs little stretch",
  },
  inferno_tower: {
    name: "Inferno Tower",
    rarity: "Rare",
    elixirCost: 0,
    primaryTrait: "fire",
    secondaryTrait: "none",
    cardType: "Building",
    troopRole: null,
    releaseDate: "2024-01-01",
    description: "Damage increases over time when attacking the same target. It may only attack one enemy, but it sees them all.",
  },
  elixir_collector: {
    name: "Elixir Collector",
    rarity: "Rare",
    elixirCost: 0,
    primaryTrait: "none",
    secondaryTrait: "none",
    cardType: "Building",
    troopRole: null,
    releaseDate: "2024-01-01",
    description: "Generates Elixir over time, pumped from deep below the Arena",
  },
  x_bow: {
    name: "X-Bow",
    rarity: "Epic",
    elixirCost: 0,
    primaryTrait: "marksman",
    secondaryTrait: "none",
    cardType: "Building",
    troopRole: null,
    releaseDate: "2024-01-01",
    description: "It may take a while to charge, but the rapid-fire payoff on the lowest HP enemy is worth the wait!",
  },
};

export function getCardKeys(): string[] {
  return Object.keys(CARD_STATS);
}

export function getCardDisplayName(key: string): string {
  return CARD_STATS[key]?.name ?? key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
    .replace("Pekka", "P.E.K.K.A.");
}

/** Lowercase alphanumerics only — so "pekka" matches "P.E.K.K.A." and "Mini P.E.K.K.A." */
function normalizeCardSearchText(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Prefix match on normalized text (case/punctuation-insensitive).
 * Matches if the full name or any whitespace-separated word starts with the query
 * (e.g. "a" → Archers, not Spear Goblins; "pekka" → P.E.K.K.A. and Mini P.E.K.K.A.).
 */
export function nameMatchesSearch(displayName: string, query: string): boolean {
  const q = normalizeCardSearchText(query);
  if (!q) return false;
  const full = normalizeCardSearchText(displayName);
  if (full.startsWith(q)) return true;
  return displayName
    .split(/\s+/)
    .map((w) => normalizeCardSearchText(w))
    .some((w) => w.length > 0 && w.startsWith(q));
}

export function cardMatchesSearch(key: string, query: string): boolean {
  return nameMatchesSearch(getCardDisplayName(key), query);
}

export function findExactMatchKey(query: string): string | null {
  const qNorm = normalizeCardSearchText(query);
  if (!qNorm) return null;
  return (
    getCardKeys().find(
      (k) => normalizeCardSearchText(getCardDisplayName(k)) === qNorm
    ) ?? null
  );
}

// Numeric compare — returns "correct" | "higher" | "lower"
export function compareNumeric(
  guessVal: number,
  secretVal: number
): "correct" | "higher" | "lower" {
  if (guessVal === secretVal) return "correct";
  return guessVal > secretVal ? "higher" : "lower";
}

// Ordered compare (for rarity)
export function compareRarity(
  guess: CardRarity,
  secret: CardRarity
): "correct" | "higher" | "lower" {
  const gi = RARITY_ORDER.indexOf(guess);
  const si = RARITY_ORDER.indexOf(secret);
  if (gi === si) return "correct";
  return gi > si ? "higher" : "lower";
}

// Release year compare
export function compareReleaseYear(
  guessDate: string,
  secretDate: string
): "correct" | "higher" | "lower" {
  const gy = new Date(guessDate).getUTCFullYear();
  const sy = new Date(secretDate).getUTCFullYear();
  if (gy === sy) return "correct";
  return gy > sy ? "higher" : "lower";
}

/** Must match files in public/Cards/ exactly (Linux/Vercel is case-sensitive). */
const CARD_IMAGE_STEM_OVERRIDES: Partial<Record<string, string>> = {
  mini_pekka: "Mini_Pekka",
  x_bow: "X_Bow",
};

/** Default: snake_case key → Title_Snake (underscores preserved). */
function cardImageStemFromKey(key: string): string {
  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("_");
}

export function cardImagePath(key: string): string {
  const stem = CARD_IMAGE_STEM_OVERRIDES[key] ?? cardImageStemFromKey(key);
  return `/Cards/${stem}.webp`;
}
