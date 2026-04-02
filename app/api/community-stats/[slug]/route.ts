import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { DAILY_GAME_SLUGS, type CommunityStatsResponse } from "@/lib/community-stats";
function getUTCDateString(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const revalidate = 60;

function serverUTCToday(): string {
  return getUTCDateString(new Date());
}

function serverUTCYesterday(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return getUTCDateString(d);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;

  if (!(DAILY_GAME_SLUGS as readonly string[]).includes(slug)) {
    return NextResponse.json({ error: "Invalid game slug" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const dayKey = searchParams.get("day") ?? serverUTCToday();
  const yesterday = serverUTCYesterday();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) {
    return NextResponse.json({ error: "Invalid day format" }, { status: 400 });
  }

  const [playsRows, wrongRows, secretRows, bestScoreRows] = await Promise.all([
    sql`
      SELECT COUNT(*) AS cnt
      FROM daily_plays
      WHERE game_slug = ${slug} AND day_key = ${dayKey}
    `,
    sql`
      SELECT card_key, guess_count
      FROM wrong_guesses
      WHERE game_slug = ${slug} AND day_key = ${dayKey}
      ORDER BY guess_count DESC
      LIMIT 100
    `,
    sql`
      SELECT card_key
      FROM daily_secrets
      WHERE game_slug = ${slug} AND day_key = ${yesterday}
      LIMIT 1
    `,
    sql`
      SELECT MIN(guesses) AS best
      FROM daily_plays
      WHERE game_slug = ${slug} AND day_key = ${dayKey} AND won = true
    `,
  ]);

  const response: CommunityStatsResponse = {
    playerCount: Number((playsRows[0] as { cnt: string | number })?.cnt ?? 0),
    topWrongGuesses: (wrongRows as unknown as Array<{ card_key: string; guess_count: number }>).map((r) => ({
      cardKey: r.card_key,
      count: r.guess_count,
    })),
    yesterdayCardKey: (secretRows[0] as { card_key: string } | undefined)?.card_key ?? null,
    bestScore:
      (bestScoreRows[0] as { best: string | number | null })?.best != null
        ? Number((bestScoreRows[0] as { best: string | number }).best)
        : null,
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
