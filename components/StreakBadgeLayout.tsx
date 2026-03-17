"use client";
import dynamic from "next/dynamic";

const StreakBadge = dynamic(() => import("@/components/StreakBadge"), { ssr: false });

export default function StreakBadgeLayout() {
  return <StreakBadge />;
}
