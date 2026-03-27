import { NextResponse } from "next/server";
import { SITE } from "@/lib/content";

const BING_INDEXNOW_URL = "https://www.bing.com/indexnow";

function getUrlsFromSitemapXml(xml: string): string[] {
  const urls: string[] = [];
  const re = /<loc>([^<]+)<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) urls.push(m[1].trim());
  return urls;
}

/**
 * Same IndexNow flow as Royaledly `app/api/indexnow/route.ts`, but urlList comes from the live sitemap.
 * GET /api/indexnow?secret=YOUR_INDEXNOW_SECRET
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret =
    process.env.INDEXNOW_SECRET ?? process.env.REVALIDATION_SECRET;
  if (secret && searchParams.get("secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key)) {
    return NextResponse.json(
      { error: "INDEXNOW_KEY not configured or invalid" },
      { status: 500 },
    );
  }

  const base = SITE.url.replace(/\/$/, "");
  const HOST = base.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const keyLocation = `https://${HOST}/${key}.txt`;

  const sitemapRes = await fetch(`${base}/sitemap.xml`);
  if (!sitemapRes.ok) {
    return NextResponse.json(
      {
        error: "Failed to fetch sitemap",
        status: sitemapRes.status,
      },
      { status: 502 },
    );
  }
  const xml = await sitemapRes.text();
  const urlList = getUrlsFromSitemapXml(xml);
  if (urlList.length === 0) {
    return NextResponse.json({ error: "No URLs in sitemap" }, { status: 502 });
  }

  const body = JSON.stringify({
    host: HOST,
    key,
    keyLocation,
    urlList,
  });

  try {
    const res = await fetch(BING_INDEXNOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body,
    });
    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        {
          error: "Bing IndexNow request failed",
          status: res.status,
          body: text,
          urlCount: urlList.length,
        },
        { status: res.status >= 400 && res.status < 500 ? res.status : 502 },
      );
    }

    return NextResponse.json({
      success: true,
      status: res.status,
      urlCount: urlList.length,
      urls: urlList,
      message:
        res.status === 202
          ? "Accepted; key validation pending."
          : "URLs submitted successfully.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "IndexNow request failed", details: message },
      { status: 500 },
    );
  }
}
