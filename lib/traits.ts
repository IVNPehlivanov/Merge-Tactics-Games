// AUTO-GENERATED (partially) by scripts/scrape-merge-tactics.mjs — fill real data after scraping

export interface Trait {
  key: string;
  name: string;
  description: string;        // short summary of the trait synergy
  effect2: string;            // 2-unit breakpoint bonus
  effect4: string;            // 4-unit breakpoint bonus
  effect6?: string;           // 6-unit breakpoint bonus (if it exists)
  traitType: "primary" | "secondary" | "either";
  currentlyActive: boolean;   // false = retired/removed from game
}

export const TRAITS: Record<string, Trait> = {
  // ─── Primary Traits ─────────────────────────────────────────────────────────
  ace: {
    key: "ace",
    name: "Ace",
    description: "Ace troops fire with increased precision.",
    effect2: "Ace troops gain +10% attack speed.",
    effect4: "Ace troops gain +25% attack speed and +15% damage.",
    traitType: "primary",
    currentlyActive: true,
  },
  assassin: {
    key: "assassin",
    name: "Assassin",
    description: "Assassins strike from the shadows with burst damage.",
    effect2: "Assassins deal +20% damage on first hit.",
    effect4: "Assassins become briefly invisible before combat and deal +40% damage on first hit.",
    traitType: "primary",
    currentlyActive: true,
  },
  clan: {
    key: "clan",
    name: "Clan",
    description: "Clan troops grow stronger as their numbers swell.",
    effect2: "Clan troops gain +8% HP.",
    effect4: "Clan troops gain +20% HP and +10% damage.",
    traitType: "primary",
    currentlyActive: true,
  },
  dragon: {
    key: "dragon",
    name: "Dragon",
    description: "Dragons breathe fire dealing splash damage.",
    effect2: "Dragon attacks deal +10% splash damage.",
    effect4: "Dragon attacks deal +25% splash damage and set enemies on fire.",
    traitType: "primary",
    currentlyActive: true,
  },
  fire: {
    key: "fire",
    name: "Fire",
    description: "Fire troops burn enemies over time.",
    effect2: "Fire attacks apply a burn dealing 5% max HP over 2 seconds.",
    effect4: "Fire attacks apply a stronger burn dealing 10% max HP over 3 seconds.",
    traitType: "primary",
    currentlyActive: true,
  },
  goblin: {
    key: "goblin",
    name: "Goblin",
    description: "Goblin hordes overwhelm enemies with numbers.",
    effect2: "Spawn 1 extra Goblin at combat start.",
    effect4: "Spawn 2 extra Goblins at combat start and all Goblins move 15% faster.",
    traitType: "primary",
    currentlyActive: true,
  },
  hinder: {
    key: "hinder",
    name: "Hinder",
    description: "Hinder troops slow and disable enemies.",
    effect2: "Hinder attacks reduce enemy attack speed by 10%.",
    effect4: "Hinder attacks reduce enemy attack speed by 25% and movement speed by 15%.",
    traitType: "primary",
    currentlyActive: true,
  },
  marksman: {
    key: "marksman",
    name: "Marksman",
    description: "Marksmen fire from range with deadly accuracy.",
    effect2: "Marksmen gain +1 range tile.",
    effect4: "Marksmen gain +2 range tiles and +15% damage.",
    traitType: "primary",
    currentlyActive: true,
  },
  noble: {
    key: "noble",
    name: "Noble",
    description: "Noble troops rally their allies, boosting resilience.",
    effect2: "Noble troops gain +10% damage reduction.",
    effect4: "Noble troops gain +25% damage reduction and regenerate 2% HP per second.",
    traitType: "primary",
    currentlyActive: true,
  },
  superstar: {
    key: "superstar",
    name: "Superstar",
    description: "Superstar troops dazzle the crowd, stunning enemies.",
    effect2: "Superstar attacks have a 10% chance to stun for 0.5s.",
    effect4: "Superstar attacks have a 25% chance to stun for 1s and deal +15% damage.",
    traitType: "primary",
    currentlyActive: true,
  },
  tank: {
    key: "tank",
    name: "Tank",
    description: "Tank troops soak up punishment for the team.",
    effect2: "Tank troops gain +15% max HP.",
    effect4: "Tank troops gain +30% max HP and reflect 10% of damage taken.",
    traitType: "primary",
    currentlyActive: true,
  },
  titan: {
    key: "titan",
    name: "Titan",
    description: "Titans are massive and terrifying on the battlefield.",
    effect2: "Titan troops deal +10% damage to buildings.",
    effect4: "Titan troops deal +25% damage to buildings and gain a knockback on hit.",
    traitType: "primary",
    currentlyActive: true,
  },
  undead: {
    key: "undead",
    name: "Undead",
    description: "Undead troops rise again after falling in battle.",
    effect2: "Undead troops revive at 25% HP once per round.",
    effect4: "Undead troops revive at 50% HP once per round and deal +15% damage.",
    traitType: "primary",
    currentlyActive: true,
  },
  warrior: {
    key: "warrior",
    name: "Warrior",
    description: "Warriors charge into melee with unmatched ferocity.",
    effect2: "Warrior troops gain +10% attack damage.",
    effect4: "Warrior troops gain +20% attack damage and +10% attack speed.",
    traitType: "primary",
    currentlyActive: true,
  },
  // ─── Secondary / Additional Traits ──────────────────────────────────────────
  avenger: {
    key: "avenger",
    name: "Avenger",
    description: "Avengers grow stronger when allies fall.",
    effect2: "Gain +5% damage for each ally that has died this round.",
    effect4: "Gain +10% damage and +5% attack speed for each ally that has died this round.",
    traitType: "secondary",
    currentlyActive: true,
  },
  blaster: {
    key: "blaster",
    name: "Blaster",
    description: "Blasters deal powerful area-of-effect damage.",
    effect2: "Blaster attacks deal +10% AoE damage.",
    effect4: "Blaster attacks deal +25% AoE damage and reduce enemy armor.",
    traitType: "secondary",
    currentlyActive: true,
  },
  brawler: {
    key: "brawler",
    name: "Brawler",
    description: "Brawlers thrive in chaotic close-quarters combat.",
    effect2: "Brawlers gain +10% damage when surrounded by 2+ enemies.",
    effect4: "Brawlers gain +25% damage and +15% attack speed when surrounded by 2+ enemies.",
    traitType: "secondary",
    currentlyActive: true,
  },
  brutalist: {
    key: "brutalist",
    name: "Brutalist",
    description: "Brutalists smash through defenses with raw power.",
    effect2: "Brutalists deal +15% damage to shielded or armored enemies.",
    effect4: "Brutalists deal +30% damage to shielded enemies and destroy shields faster.",
    traitType: "secondary",
    currentlyActive: true,
  },
  electric: {
    key: "electric",
    name: "Electric",
    description: "Electric troops chain lightning to nearby enemies.",
    effect2: "Electric attacks chain to 1 additional enemy for 50% damage.",
    effect4: "Electric attacks chain to 2 additional enemies for 75% damage.",
    traitType: "secondary",
    currentlyActive: true,
  },
  giant: {
    key: "giant",
    name: "Giant",
    description: "Giant troops have massive health pools.",
    effect2: "Giant troops gain +20% max HP.",
    effect4: "Giant troops gain +40% max HP and generate a shield at combat start.",
    traitType: "secondary",
    currentlyActive: true,
  },
  juggernaut: {
    key: "juggernaut",
    name: "Juggernaut",
    description: "Juggernauts are unstoppable forces that crush everything.",
    effect2: "Juggernauts ignore 10% of enemy armor.",
    effect4: "Juggernauts ignore 25% of enemy armor and deal +10% damage.",
    traitType: "secondary",
    currentlyActive: true,
  },
  mage: {
    key: "mage",
    name: "Mage",
    description: "Mages cast powerful spells from a safe distance.",
    effect2: "Mage attacks ignore 15% of enemy magic resistance.",
    effect4: "Mage attacks ignore 30% of enemy magic resistance and deal +10% damage.",
    traitType: "secondary",
    currentlyActive: true,
  },
  pekka: {
    key: "pekka",
    name: "P.E.K.K.A",
    description: "P.E.K.K.A. troops are heavily armored and devastating.",
    effect2: "P.E.K.K.A. troops gain +15% armor.",
    effect4: "P.E.K.K.A. troops gain +30% armor and deal +20% damage.",
    traitType: "secondary",
    currentlyActive: true,
  },
  ranger: {
    key: "ranger",
    name: "Ranger",
    description: "Rangers scout and strike from extreme range.",
    effect2: "Rangers gain +15% attack speed.",
    effect4: "Rangers gain +25% attack speed and their attacks pierce through one enemy.",
    traitType: "secondary",
    currentlyActive: true,
  },
  thrower: {
    key: "thrower",
    name: "Thrower",
    description: "Throwers lob projectiles in an arc, bypassing frontlines.",
    effect2: "Thrower projectiles deal +10% splash damage.",
    effect4: "Thrower projectiles deal +25% splash damage and have a chance to stun.",
    traitType: "secondary",
    currentlyActive: true,
  },
  // placeholder for cards with no secondary trait
  none: {
    key: "none",
    name: "None",
    description: "No secondary trait.",
    effect2: "",
    effect4: "",
    traitType: "either",
    currentlyActive: true,
  },
};

export function getTraitByKey(key: string): Trait | undefined {
  return TRAITS[key];
}

export function getActiveTraits(): Trait[] {
  return Object.values(TRAITS).filter((t) => t.currentlyActive && t.key !== "none");
}

export function getRetiredTraits(): Trait[] {
  return Object.values(TRAITS).filter((t) => !t.currentlyActive);
}
