import { indexNowKey } from "@/lib/indexnow";

// IndexNow fetches this file to confirm that change notifications come from the site owner.
export const dynamic = "force-dynamic";

export function GET() {
  const key = indexNowKey();
  if (!key) return new Response("Not found", { status: 404 });
  return new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" } });
}
