import { nameMatchesSearch } from "./card-stats";
import { getRulerByKey, RULERS } from "./ruler-stats";

export interface SkinEntry {
  rulerKey: string;
  skinName: string;
  imagePath: string;
}

/** Match skin cosmetic name or parent ruler name (same prefix rules as card search). */
export function skinEntryMatchesSearch(s: SkinEntry, query: string): boolean {
  if (nameMatchesSearch(s.skinName, query)) return true;
  const ruler = getRulerByKey(s.rulerKey);
  return ruler ? nameMatchesSearch(ruler.name, query) : false;
}

/** Migrate old persisted paths after Rulers/*.png → *.webp. */
export function normalizeSkinImagePath(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.endsWith(".png") && path.includes("/Rulers/")) {
    return `${path.slice(0, -4)}.webp`;
  }
  return path;
}

export const SKIN_POOL: SkinEntry[] = [
  // Royal King
  { rulerKey: "royale_king",    skinName: "Marble King",       imagePath: "/Rulers/Royale_King/Marble_Royale_King.webp" },
  { rulerKey: "royale_king",    skinName: "Velvet King",       imagePath: "/Rulers/Royale_King/Velvet_Royale_King.webp" },
  { rulerKey: "royale_king",    skinName: "Ghoul King",        imagePath: "/Rulers/Royale_King/Ghoul_Royale_King.webp" },
  { rulerKey: "royale_king",    skinName: "Santa King",        imagePath: "/Rulers/Royale_King/Santa_Royale_King.webp" },
  // Spirit Empress
  { rulerKey: "spirit_empress", skinName: "Ivy Empress",       imagePath: "/Rulers/Spirit_Empress/Ivy_Spirit_Empress.webp" },
  { rulerKey: "spirit_empress", skinName: "Auric Empress",     imagePath: "/Rulers/Spirit_Empress/Auric_Spirit_Empress.webp" },
  { rulerKey: "spirit_empress", skinName: "Wushi Empress",     imagePath: "/Rulers/Spirit_Empress/Wushi_Spirit_Empress.webp" },
  { rulerKey: "spirit_empress", skinName: "Astral Empress",    imagePath: "/Rulers/Spirit_Empress/Astral_Spirit_Empress.webp" },
  // Goblin Queen
  { rulerKey: "goblin_queen",   skinName: "Jade Queen",        imagePath: "/Rulers/Goblin_Queen/Jade_Goblin_Queen.webp" },
  { rulerKey: "goblin_queen",   skinName: "Chaos Queen",       imagePath: "/Rulers/Goblin_Queen/Chaos_Goblin_Queen.webp" },
  { rulerKey: "goblin_queen",   skinName: "Malevolent Queen",  imagePath: "/Rulers/Goblin_Queen/Malevolent_Goblin_Queen.webp" },
  { rulerKey: "goblin_queen",   skinName: "Serpentine Queen",  imagePath: "/Rulers/Goblin_Queen/Serpentine_Goblin_Queen.webp" },
  // Elixir Loong
  { rulerKey: "elixir_loong",   skinName: "Spirit Loong",      imagePath: "/Rulers/Elixir_Loong/Spirit_Elixir_Loong.webp" },
  { rulerKey: "elixir_loong",   skinName: "Lava Loong",        imagePath: "/Rulers/Elixir_Loong/Lava_Elixir_Loong.webp" },
  { rulerKey: "elixir_loong",   skinName: "Aqua Loong",        imagePath: "/Rulers/Elixir_Loong/Aqua_Elixir_Loong.webp" },
  // Battle Machine
  { rulerKey: "battle_machine", skinName: "Zebrawood Machine", imagePath: "/Rulers/Battle_Machine/Zebrawood_Battle_Machine.webp" },
  { rulerKey: "battle_machine", skinName: "Scheme Machine",    imagePath: "/Rulers/Battle_Machine/Scheme_Battle_Machine.webp" },
  { rulerKey: "battle_machine", skinName: "Forge Machine",     imagePath: "/Rulers/Battle_Machine/Forge_Battle_Machine.webp" },
  // Echo Sage
  { rulerKey: "echo_sage",      skinName: "Sunlight Sage",     imagePath: "/Rulers/Echo_Sage/Sunlight_Echo_Sage.webp" },
  { rulerKey: "echo_sage",      skinName: "Starborn Sage",     imagePath: "/Rulers/Echo_Sage/Starborn_Echo_Sage.webp" },
  { rulerKey: "echo_sage",      skinName: "Spectral Sage",     imagePath: "/Rulers/Echo_Sage/Spectral_Echo_Sage.webp" },
  // Dagger Duchess
  { rulerKey: "dagger_duchess", skinName: "Disguised Duchess",   imagePath: "/Rulers/Dagger_Duchess/Disguised_Duchess.webp" },
  { rulerKey: "dagger_duchess", skinName: "Duchess of Hearts",   imagePath: "/Rulers/Dagger_Duchess/Duchess_of_Hearts.webp" },
  { rulerKey: "dagger_duchess", skinName: "Crystalline Duchess", imagePath: "/Rulers/Dagger_Duchess/Crystalline_Duchess.webp" },
];

export function getValidSkinPool(): SkinEntry[] {
  return SKIN_POOL.filter((s) => s.rulerKey in RULERS);
}
