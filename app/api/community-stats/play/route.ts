import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { DAILY_GAME_SLUGS, type PostPlayPayload, type PostPlayResponse } from "@/lib/community-stats";
import { getCardKeys } from "@/lib/card-stats";
import { getValidSkinPool } from "@/lib/skin-cards";
function getUTCDateString(date: Date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getAllCardKeys(): Set<string> {
  return new Set(getCardKeys());
}

function getAllSkinNames(): Set<string> {
  return new Set(getValidSkinPool().map((s) => s.skinName));
}

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function serverUTCToday(): string {
  return getUTCDateString(new Date());
}

function serverUTCNDaysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return getUTCDateString(d);
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: PostPlayPayload;
  try {
    body = (await request.json()) as PostPlayPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { gameSlug, dayKey, cardKey, guessCount, won, wrongGuessKeys } = body;

  if (!(DAILY_GAME_SLUGS as readonly string[]).includes(gameSlug)) {
    return NextResponse.json({ ok: false, error: "Invalid gameSlug" }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) {
    return NextResponse.json({ ok: false, error: "Invalid dayKey format" }, { status: 400 });
  }
  const today = serverUTCToday();
  if (dayKey > today || dayKey < serverUTCNDaysAgo(7)) {
    return NextResponse.json({ ok: false, error: "dayKey out of range" }, { status: 400 });
  }
  if (typeof guessCount !== "number" || guessCount < 1 || guessCount > 50) {
    return NextResponse.json({ ok: false, error: "Invalid guessCount" }, { status: 400 });
  }
  const isSkinGame = gameSlug === "skin";
  const allKeys = isSkinGame ? getAllSkinNames() : getAllCardKeys();
  if (!allKeys.has(cardKey)) {
    return NextResponse.json({ ok: false, error: "Invalid cardKey" }, { status: 400 });
  }
  if (!Array.isArray(wrongGuessKeys) || wrongGuessKeys.length > 50) {
    return NextResponse.json({ ok: false, error: "Invalid wrongGuessKeys" }, { status: 400 });
  }
  const validWrongGuessKeys = wrongGuessKeys.filter((k) => allKeys.has(k));

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ua = request.headers.get("user-agent") ?? "unknown";
  const salt = process.env.ANON_SALT ?? "default-salt";
  const anonId = await sha256(`${ip}|${ua}|${salt}`);

  await sql`
    INSERT INTO daily_plays (game_slug, day_key, anon_id, guesses, won)
    VALUES (${gameSlug}, ${dayKey}, ${anonId}, ${guessCount}, ${won})
    ON CONFLICT (game_slug, day_key, anon_id) DO NOTHING
  `;

  for (const key of validWrongGuessKeys) {
    await sql`
      INSERT INTO wrong_guesses (game_slug, day_key, card_key, guess_count)
      VALUES (${gameSlug}, ${dayKey}, ${key}, 1)
      ON CONFLICT (game_slug, day_key, card_key)
      DO UPDATE SET guess_count = wrong_guesses.guess_count + 1
    `;
  }

  await sql`
    INSERT INTO daily_secrets (game_slug, day_key, card_key)
    VALUES (${gameSlug}, ${dayKey}, ${cardKey})
    ON CONFLICT (game_slug, day_key) DO NOTHING
  `;

  const rows = await sql`
    SELECT COUNT(*) AS cnt
    FROM daily_plays
    WHERE game_slug = ${gameSlug} AND day_key = ${dayKey}
  `;
  const playerCount = Number((rows[0] as { cnt: string | number }).cnt ?? 0);

  const response: PostPlayResponse = { ok: true, playerCount };
  return NextResponse.json(response);
}
