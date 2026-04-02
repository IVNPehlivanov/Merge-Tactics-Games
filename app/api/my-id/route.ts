import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const day = searchParams.get("day");

  if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    return NextResponse.json({ id: null }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ua = request.headers.get("user-agent") ?? "unknown";
  const salt = process.env.ANON_SALT ?? "default-salt";
  const anonId = await sha256(`${ip}|${ua}|${salt}`);

  // Skip DB check in local dev so the UI can be tested without issues
  if (process.env.NODE_ENV === "development") {
    return NextResponse.json({ id: anonId });
  }

  try {
    const rows = await sql`
      SELECT anon_id FROM daily_plays
      WHERE game_slug = 'description'
        AND day_key = ${day}
        AND anon_id = ${anonId}
      LIMIT 1
    `;
    if (rows.length === 0) return NextResponse.json({ id: null });
  } catch {
    return NextResponse.json({ id: null });
  }

  return NextResponse.json({ id: anonId });
}
