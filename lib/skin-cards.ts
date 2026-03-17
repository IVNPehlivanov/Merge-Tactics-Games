import { RULERS } from "./ruler-stats";

export interface SkinEntry {
  rulerKey: string;   // must match a key in RULERS
  skinName: string;   // display name
  imagePath: string;  // /Skins/*.webp
}

export const SKIN_POOL: SkinEntry[] = [
  // Royale King
  { rulerKey: "royale_king",    skinName: "Marble King",         imagePath: "/Skins/Marble-King.webp" },
  { rulerKey: "royale_king",    skinName: "Velvet King",         imagePath: "/Skins/Velvet-King.webp" },
  { rulerKey: "royale_king",    skinName: "Ghoul King",          imagePath: "/Skins/Ghoul-King.webp" },
  { rulerKey: "royale_king",    skinName: "Santa King",          imagePath: "/Skins/Santa-King.webp" },
  // Spirit Empress
  { rulerKey: "spirit_empress", skinName: "Ivy Empress",         imagePath: "/Skins/Ivy-Empress.webp" },
  { rulerKey: "spirit_empress", skinName: "Auric Empress",       imagePath: "/Skins/Auric-Empress.webp" },
  { rulerKey: "spirit_empress", skinName: "Wushi Empress",       imagePath: "/Skins/Wushi-Empress.webp" },
  { rulerKey: "spirit_empress", skinName: "Astral Empress",      imagePath: "/Skins/Astral-Empress.webp" },
  // Goblin Queen
  { rulerKey: "goblin_queen",   skinName: "Jade Queen",          imagePath: "/Skins/Jade-Queen.webp" },
  { rulerKey: "goblin_queen",   skinName: "Chaos Queen",         imagePath: "/Skins/Chaos-Queen.webp" },
  { rulerKey: "goblin_queen",   skinName: "Malevolent Queen",    imagePath: "/Skins/Malevolent-Queen.webp" },
  { rulerKey: "goblin_queen",   skinName: "Serpentine Queen",    imagePath: "/Skins/Serpentine-Queen.webp" },
  // Elixir Loong
  { rulerKey: "elixir_loong",   skinName: "Spirit Loong",        imagePath: "/Skins/Spirit-Loong.webp" },
  { rulerKey: "elixir_loong",   skinName: "Lava Loong",          imagePath: "/Skins/Lava-Loong.webp" },
  { rulerKey: "elixir_loong",   skinName: "Aqua Loong",          imagePath: "/Skins/Aqua-Loong.webp" },
  // Battle Machine
  { rulerKey: "battle_machine", skinName: "Zebrawood Machine",   imagePath: "/Skins/Zebrawood-Machine.webp" },
  { rulerKey: "battle_machine", skinName: "Scheme Machine",      imagePath: "/Skins/Scheme-Machine.webp" },
  { rulerKey: "battle_machine", skinName: "Forge Machine",       imagePath: "/Skins/Forge-Machine.webp" },
  // Echo Sage
  { rulerKey: "echo_sage",      skinName: "Echo Sage",           imagePath: "/Skins/Echo-Sage.webp" },
  { rulerKey: "echo_sage",      skinName: "Sunlight Sage",       imagePath: "/Skins/Sunlight-Sage.webp" },
  { rulerKey: "echo_sage",      skinName: "Starborn Sage",       imagePath: "/Skins/Starborn-Sage.webp" },
  { rulerKey: "echo_sage",      skinName: "Spectral Sage",       imagePath: "/Skins/Spectral-Sage.webp" },
  // Dagger Duchess
  { rulerKey: "dagger_duchess", skinName: "Disguised Duchess",   imagePath: "/Skins/Disguised-Duchess.webp" },
  { rulerKey: "dagger_duchess", skinName: "Duchess of Hearts",   imagePath: "/Skins/Duchess-of-Hearts.webp" },
  { rulerKey: "dagger_duchess", skinName: "Crystalline Duchess", imagePath: "/Skins/Crystalline-Duchess.webp" },
];

export function getValidSkinPool(): SkinEntry[] {
  return SKIN_POOL.filter((s) => s.rulerKey in RULERS);
}
