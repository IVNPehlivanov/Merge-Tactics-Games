import { RULERS } from "./ruler-stats";

export interface SkinEntry {
  rulerKey: string;
  skinName: string;
  imagePath: string;
}

export const SKIN_POOL: SkinEntry[] = [
  // Royal King
  { rulerKey: "royale_king",    skinName: "Marble King",       imagePath: "/rulers/Royal_King/Marble_Royal_King.png" },
  { rulerKey: "royale_king",    skinName: "Velvet King",       imagePath: "/rulers/Royal_King/Velvet_Royal_King.png" },
  { rulerKey: "royale_king",    skinName: "Ghoul King",        imagePath: "/rulers/Royal_King/Ghoul_Royal_King.png" },
  { rulerKey: "royale_king",    skinName: "Santa King",        imagePath: "/rulers/Royal_King/Santa_Royal_King.png" },
  // Spirit Empress
  { rulerKey: "spirit_empress", skinName: "Ivy Empress",       imagePath: "/rulers/Spirit_Empress/Ivy_Spirit_Empress.png" },
  { rulerKey: "spirit_empress", skinName: "Auric Empress",     imagePath: "/rulers/Spirit_Empress/Auric_Spirit_Empress.png" },
  { rulerKey: "spirit_empress", skinName: "Wushi Empress",     imagePath: "/rulers/Spirit_Empress/Wushi_Spirit_Empress.png" },
  { rulerKey: "spirit_empress", skinName: "Astral Empress",    imagePath: "/rulers/Spirit_Empress/Astral_Spirit_Empress.png" },
  // Goblin Queen
  { rulerKey: "goblin_queen",   skinName: "Jade Queen",        imagePath: "/rulers/Goblin_Queen/Jade_Goblin_Queen.png" },
  { rulerKey: "goblin_queen",   skinName: "Chaos Queen",       imagePath: "/rulers/Goblin_Queen/Chaos_Goblin_Queen.png" },
  { rulerKey: "goblin_queen",   skinName: "Malevolent Queen",  imagePath: "/rulers/Goblin_Queen/Malevolent_Goblin_Queen.png" },
  { rulerKey: "goblin_queen",   skinName: "Serpentine Queen",  imagePath: "/rulers/Goblin_Queen/Serpentine_Goblin_Queen.png" },
  // Elixir Loong
  { rulerKey: "elixir_loong",   skinName: "Spirit Loong",      imagePath: "/rulers/Elixir_Loong/Spirit_Elixir_Loong.png" },
  { rulerKey: "elixir_loong",   skinName: "Lava Loong",        imagePath: "/rulers/Elixir_Loong/Lava_Elixir_Loong.png" },
  { rulerKey: "elixir_loong",   skinName: "Aqua Loong",        imagePath: "/rulers/Elixir_Loong/Aqua_Elixir_Loong.png" },
  // Battle Machine
  { rulerKey: "battle_machine", skinName: "Zebrawood Machine", imagePath: "/rulers/Battle_Machine/Zebrawood_Battle_Machine.png" },
  { rulerKey: "battle_machine", skinName: "Scheme Machine",    imagePath: "/rulers/Battle_Machine/Scheme_Battle_Machine.png" },
  { rulerKey: "battle_machine", skinName: "Forge Machine",     imagePath: "/rulers/Battle_Machine/Forge_Battle_Machine.png" },
  // Echo Sage
  { rulerKey: "echo_sage",      skinName: "Sunlight Sage",     imagePath: "/rulers/Echo_Sage/Sunlight_Echo_Sage.png" },
  { rulerKey: "echo_sage",      skinName: "Starborn Sage",     imagePath: "/rulers/Echo_Sage/Starborn_Echo_Sage.png" },
  { rulerKey: "echo_sage",      skinName: "Spectral Sage",     imagePath: "/rulers/Echo_Sage/Spectral_Echo_Sage.png" },
];

export function getValidSkinPool(): SkinEntry[] {
  return SKIN_POOL.filter((s) => s.rulerKey in RULERS);
}
