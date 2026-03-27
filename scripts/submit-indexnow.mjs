/**
 * IndexNow submission — fetches URLs from the sitemap and notifies Bing.
 * Same logic as Clash-Royale-Games / Royaledly (scripts/submit-indexnow.mjs): one POST, full urlList.
 *
 * Run: INDEXNOW_KEY=yourkey SITE_ORIGIN=https://mergedle.com node scripts/submit-indexnow.mjs
 *   or: npm run indexnow  (with env set)
 *
 * Optional: SITE_ORIGIN (default https://mergedle.com or NEXT_PUBLIC_SITE_URL)
 */

import process from "node:process";

let SITE_ORIGIN = (
  process.env.SITE_ORIGIN ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://mergedle.com"
).trim();
if (!/^https?:\/\//i.test(SITE_ORIGIN)) SITE_ORIGIN = `https://${SITE_ORIGIN}`;
SITE_ORIGIN = SITE_ORIGIN.replace(/\/+$/, "");

const SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`;
const HOST = SITE_ORIGIN.replace(/^https?:\/\//, "").replace(/\/$/, "");

const KEY_RE = /^[a-zA-Z0-9-]{8,128}$/;
const KEY = process.env.INDEXNOW_KEY?.trim();
if (!KEY || !KEY_RE.test(KEY)) {
  console.error(
    "Set INDEXNOW_KEY (8–128 chars: a-z A-Z 0-9 and dashes only).",
  );
  process.exit(1);
}

const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

/** Extract <loc> URLs from sitemap XML. */
function getUrlsFromSitemapXml(xml) {
  const urls = [];
  const re = /<loc>([^<]+)<\/loc>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) urls.push(m[1].trim());
  return urls;
}

console.log("Fetching sitemap from", SITEMAP_URL);
const sitemapRes = await fetch(SITEMAP_URL);
if (!sitemapRes.ok) {
  console.error(
    `Failed to fetch sitemap: ${sitemapRes.status} ${sitemapRes.statusText}`,
  );
  process.exit(1);
}
const xml = await sitemapRes.text();
const URLS = getUrlsFromSitemapXml(xml);
if (URLS.length === 0) {
  console.error("No URLs found in sitemap.");
  process.exit(1);
}

console.log(`Found ${URLS.length} URL(s) in sitemap.`);

console.log("Verifying key file at", KEY_LOCATION);
const keyRes = await fetch(KEY_LOCATION);
if (!keyRes.ok) {
  console.error(
    `Key file not reachable: ${keyRes.status}. Bing will reject the submission.`,
  );
  process.exit(1);
}
const keyContent = (await keyRes.text()).trim();
if (keyContent !== KEY) {
  console.error(
    `Key file must contain exactly "${KEY}" but got "${keyContent.slice(0, 50)}...".`,
  );
  process.exit(1);
}
console.log("Key file OK.");

console.log("Submitting to Bing IndexNow...");
const body = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: URLS,
});

const res = await fetch("https://www.bing.com/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body,
});

console.log(`Bing response: ${res.status} ${res.statusText}`);
if (res.status === 200) {
  console.log("Success — Bing has been notified.");
  URLS.forEach((u) => console.log(`  ${u}`));
} else if (res.status === 202) {
  console.log("Accepted — Bing will process shortly.");
  console.log(
    "Note: 202 means Bing received the URLs. Key validation and indexing are async; Webmaster Tools may take hours to reflect.",
  );
  URLS.forEach((u) => console.log(`  ${u}`));
} else {
  console.log("Unexpected response:", await res.text());
  process.exit(1);
}
