import { PUBLIC_PAGES, canonicalUrl } from "@/lib/seo";

const LAST_MODIFIED = {
  "/": "2026-09-10",
  "/about": "2026-09-10",
  "/movement": "2026-09-10",
  "/waitlist": "2026-09-10",
};

/** @returns {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  return Object.keys(PUBLIC_PAGES).map((path) => ({
    url: canonicalUrl(path),
    lastModified: new Date(LAST_MODIFIED[path]),
    changeFrequency: path === "/about" ? "monthly" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
