"use client";

import { getDayKey } from "@/lib/daily";
import { CommunityStatsPanel } from "./CommunityStatsPanel";

export function CommunityStatsPanelWrapper({ gameSlug }: { gameSlug: string }) {
  return <CommunityStatsPanel gameSlug={gameSlug} dayKey={getDayKey()} />;
}
