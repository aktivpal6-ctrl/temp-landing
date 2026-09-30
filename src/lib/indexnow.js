import { SITE_URL, canonicalUrl } from "./seo.js";

export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
// Served by app/indexnow-key.txt. It sits at the site root, so the key covers every URL on the host.
export const INDEXNOW_KEY_PATH = "/indexnow-key.txt";
const KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/;

export function indexNowKey(env = process.env) {
  return KEY_PATTERN.test(env.INDEXNOW_KEY || "") ? env.INDEXNOW_KEY : null;
}

export function indexNowPayload(paths, key) {
  return {
    host: new URL(SITE_URL).host,
    key,
    keyLocation: `${SITE_URL}${INDEXNOW_KEY_PATH}`,
    urlList: [...new Set(paths.map((path) => canonicalUrl(path)))],
  };
}

// Tells IndexNow search engines (Bing, Yandex, Naver, Seznam and others) which pages
// changed, so they recrawl them within minutes instead of on their next sitemap visit.
// Google is not part of IndexNow: it schedules recrawls from the sitemap's <lastmod>.
// Without an INDEXNOW_KEY this does nothing, so only the deployment that has one notifies.
export async function notifyIndexNow(paths) {
  const key = indexNowKey();
  if (process.env.INDEXNOW_KEY && !key) console.error("INDEXNOW_KEY must be 8 to 128 letters, digits or hyphens");
  if (!key || !paths.length || process.env.AKTIVPAL_TEST_MODE === "1") return;
  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(indexNowPayload(paths, key)),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) console.error(`IndexNow rejected the update (${response.status}):`, paths.join(", "));
  } catch (error) {
    console.error("IndexNow notification failed:", error.message);
  }
}
