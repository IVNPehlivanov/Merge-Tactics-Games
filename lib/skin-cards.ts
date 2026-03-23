import { RULERS } from "./ruler-stats";

export interface SkinEntry {
  rulerKey: string;
  skinName: string;
  imagePath: string;
}

export const SKIN_POOL: SkinEntry[] = [
  // Royal King
  { rulerKey: "royale_king",    skinName: "Marble King",       imagePath: "/Rulers/Royale_King/Marble_Royale_King.png" },
  { rulerKey: "royale_king",    skinName: "Velvet King",       imagePath: "/Rulers/Royale_King/Velvet_Royale_King.png" },
  { rulerKey: "royale_king",    skinName: "Ghoul King",        imagePath: "/Rulers/Royale_King/Ghoul_Royale_King.png" },
  { rulerKey: "royale_king",    skinName: "Santa King",        imagePath: "/Rulers/Royale_King/Santa_Royale_King.png" },
  // Spirit Empress
  { rulerKey: "spirit_empress", skinName: "Ivy Empress",       imagePath: "/Rulers/Spirit_Empress/Ivy_Spirit_Empress.png" },
  { rulerKey: "spirit_empress", skinName: "Auric Empress",     imagePath: "/Rulers/Spirit_Empress/Auric_Spirit_Empress.png" },
  { rulerKey: "spirit_empress", skinName: "Wushi Empress",     imagePath: "/Rulers/Spirit_Empress/Wushi_Spirit_Empress.png" },
  { rulerKey: "spirit_empress", skinName: "Astral Empress",    imagePath: "/Rulers/Spirit_Empress/Astral_Spirit_Empress.png" },
  // Goblin Queen
  { rulerKey: "goblin_queen",   skinName: "Jade Queen",        imagePath: "/Rulers/Goblin_Queen/Jade_Goblin_Queen.png" },
  { rulerKey: "goblin_queen",   skinName: "Chaos Queen",       imagePath: "/Rulers/Goblin_Queen/Chaos_Goblin_Queen.png" },
  { rulerKey: "goblin_queen",   skinName: "Malevolent Queen",  imagePath: "/Rulers/Goblin_Queen/Malevolent_Goblin_Queen.png" },
  { rulerKey: "goblin_queen",   skinName: "Serpentine Queen",  imagePath: "/Rulers/Goblin_Queen/Serpentine_Goblin_Queen.png" },
  // Elixir Loong
  { rulerKey: "elixir_loong",   skinName: "Spirit Loong",      imagePath: "/Rulers/Elixir_Loong/Spirit_Elixir_Loong.png" },
  { rulerKey: "elixir_loong",   skinName: "Lava Loong",        imagePath: "/Rulers/Elixir_Loong/Lava_Elixir_Loong.png" },
  { rulerKey: "elixir_loong",   skinName: "Aqua Loong",        imagePath: "/Rulers/Elixir_Loong/Aqua_Elixir_Loong.png" },
  // Battle Machine
  { rulerKey: "battle_machine", skinName: "Zebrawood Machine", imagePath: "/Rulers/Battle_Machine/Zebrawood_Battle_Machine.png" },
  { rulerKey: "battle_machine", skinName: "Scheme Machine",    imagePath: "/Rulers/Battle_Machine/Scheme_Battle_Machine.png" },
  { rulerKey: "battle_machine", skinName: "Forge Machine",     imagePath: "/Rulers/Battle_Machine/Forge_Battle_Machine.png" },
  // Echo Sage
  { rulerKey: "echo_sage",      skinName: "Sunlight Sage",     imagePath: "/Rulers/Echo_Sage/Sunlight_Echo_Sage.png" },
  { rulerKey: "echo_sage",      skinName: "Starborn Sage",     imagePath: "/Rulers/Echo_Sage/Starborn_Echo_Sage.png" },
  { rulerKey: "echo_sage",      skinName: "Spectral Sage",     imagePath: "/Rulers/Echo_Sage/Spectral_Echo_Sage.png" },
];

export function getValidSkinPool(): SkinEntry[] {
  return SKIN_POOL.filter((s) => s.rulerKey in RULERS);
}
