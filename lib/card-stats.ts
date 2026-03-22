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

// Key: lowercase snake_case slug — art in public/Cards/{Title-Dash}.webp (see cardImagePath)
// e.g. "inferno_tower" → "/Cards/Inferno-Tower.webp"
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
    description: "A pair of lightly clad elven archers. They may be small, but their bows pack a punch!",
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
    description: "The Knight was a card that belonged to the Noble and Juggernaut traits. It spawned a single-target melee troop with high hitpoints, very low damage, and moderate attack speed. The Knight took the appearance of a man who has brown eyes, a blond-colored mustache and eyebrows, and wears chain mail and a chestplate, a blue strap and belt, and brown shoes with metal plates on them, while wielding a saber as his weapon. A Knight card costed 2  to deploy.",
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
    description: "The Spear Goblin is a card that belongs in the Goblin and Blaster traits. It spawns a single-target ranged troop with very low hitpoints, very high damage, and moderate attack speed. The Spear Goblin takes the appearance of a Goblin, but is taller and thinner, has sharper elven ears and side hair, wears a blue bandana and belt, has a blue spear case tied to his back with a rope, and has a wooden spear in his hand with a blue rope tied on top. A Spear Goblin card costs 2  to deploy.",
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
    description: "The Goblin is a card that belongs in the Goblin and Assassin traits. It spawns a single-target melee troop with very low hitpoints, moderate damage, and very high attack speed. The Goblin takes the appearance of a small, green creature with pointy ears, green eyes, dark green eyebrows, amber sclerae, and a large peach nose, while carrying a dagger and wearing red suspenders and wristbands, brown pants, and shoes. A Goblin card costs 2  to deploy.",
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
    description: "The Bomber was a card that belonged to the Undead and Blaster traits. It spawned an area-damage ranged troop with very low hitpoints, low damage, and moderate attack speed. The Bomber took the appearance of a Wall Breaker that carried a black bomb and wore a brown aviator hat with gold-rimmed aviation goggles and gloves. A Bomber card costed 2  to deploy.",
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
    description: "The Skeleton is a troop able to be spawned by Witch and Skeleton King, belonging to the Undead trait. It is a single-target melee troop with very low or low hitpoints, very low damage, and moderate attack speed. The Skeleton takes the appearance of a small undead creature with a skull that lacks a lower jaw and wields a short sword.",
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
    description: "The Barbarian is a card that belongs in the Clan and Brawler traits. It spawns a single-target melee troop with moderate hitpoints, moderate damage, and very high attack speed. The Barbarian takes the appearance of a bare-chested man who wields a sword, has blue eyes, blond eyebrows, close-cropped hair and a horseshoe moustache, while wearing a brown kilt, a brown belt with a shield buckle, and spiked wristbands. A Barbarian card costs 2  to deploy.",
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
    description: "The Skeleton Dragon is a card that belongs in the Undead and Ranger traits. It spawns a single-target ranged troop with very low hitpoints, moderate damage, and high attack speed. Every few attacks, the Skeleton Dragon creates a clone of himself with the same hitpoints and damage. His clones also have that ability, meaning that they can also generate clones of themselves with the same hitpoints and damage. The cloner Skeleton Dragon loses 30% of his hitpoints when he clones himself. The Skeleton Dragon takes the appearance of a smaller, skeletal version of the Baby Dragon with brown wings, horns, and back spikes. The cloned Skeleton Dragon has a color palette similar to that of a troop created by Clone. A Skeleton Dragon card costs 2  to deploy.",
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
    description: "The Royal Giant is a card that belongs in the Giant and Ranger traits. It spawns a single-target ranged troop with high hitpoints, moderate damage, and moderate attack speed. The Royal Giant takes the appearance of a Giant, except that he sports a dark navy coat with red cuffs, has a mustache and bigger mutton chops, wears a crown and a chainmail, wields a Cannon with two gold ridges in the middle in one hand, and carries a cannonball in the other. A Royal Giant card costs 2  to deploy.",
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
    description: "The Mini P.E.K.K.A. is a card that belongs in the P.E.K.K.A and Brutalist traits. It spawns a single-target melee troop with low hitpoints, very high damage, and moderate attack speed. The Mini P.E.K.K.A. takes the appearance of a robot-looking troop smaller than the P.E.K.K.A. who wears a dark steel blue armor with two sky blue horns, spikes on his arms, and a single eye, while wielding a smaller version of the P.E.K.K.A.'s metal sword as his weapon. A Mini P.E.K.K.A. card costs 2  to deploy.",
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
    description: "Don't be fooled by her delicate appearance; the Musketeer's rifle packs a powerful shot!",
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
    description: "Massive in size and strength, the Giant crushes all in his path.",
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
    description: "Fierce and wild, she hates Goblins. Carries a huge axe.",
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
    description: "The most awesome Wizard ever! Shoots a powerful fireball.",
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
    description: "Runs fast, shoots far, gets killed dead. Undergoes extensive cardboard target practice daily.",
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
    description: "Launches a massive barrel of goblins to a targeted area.",
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
    description: "Hatch a Baby Dragon! Breathes fire dealing splash damage.",
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
    description: "Summons Skeletons, shoots destructive bolts of energy.",
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
    description: "A slow, but heavily armored melee fighter. Nothing gets past her.",
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
    description: "Don't let his fancy armour fool you; this Prince is no pushover!",
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
    description: "The Giant Skeleton's massive bomb is not a welcomed addition to any battle.",
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
    description: "He zaps nearby enemies with bolts of electricity whenever he takes damage.",
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
    description: "He throws his axe like a boomerang, striking multiple enemies at once.",
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
    description: "He lands with the force of 1,000 mustaches, then jumps from one foe to the next.",
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
    description: "He lands with a mighty Zap! Shoots lightning bolts at two targets.",
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
    description: "This stunning Princess shoots flaming arrows. Don't miss!",
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
    description: "Dances invisibly until attacking or targeted. Who's next?",
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
    description: "The Bandit dashes to her target, becoming temporarily unstoppable.",
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
    description: "A mechanical contraption piloted by a Goblin. Fires a powerful laser beam.",
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
    description: "The Golden Knight dashes to enemies, chaining a lightning bolt to nearby foes.",
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
    description: "The Skeleton King summons Skeletons and wields a mighty sword.",
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
    description: "The Archer Queen turns invisible to dodge damage and gain attack speed.",
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
    description: "The Monk deflects projectiles with a powerful push and deals area damage.",
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
    description: "Lobs massive boulders that deal significant area damage.",
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
    description: "Pops out of the ground, shocks nearby enemies with lightning.",
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
    description: "Shoots a focused beam of fire that increases in damage over time.",
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
    description: "Steadily pumps out Elixir throughout the match.",
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
    description: "Locks on to and shoot bolts at nearby enemies.",
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

export function cardMatchesSearch(key: string, query: string): boolean {
  return getCardDisplayName(key).toLowerCase().includes(query.toLowerCase());
}

export function findExactMatchKey(query: string): string | null {
  const q = query.toLowerCase().trim();
  return getCardKeys().find(
    (k) => getCardDisplayName(k).toLowerCase() === q
  ) ?? null;
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

// Card art: public/Cards/{Title-Dash}.webp (capital C — required on Linux/Vercel)
export function cardImagePath(key: string): string {
  const fileStem = key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
  return `/Cards/${fileStem}.webp`;
}
