import { PUBLIC_PAGES, canonicalUrl } from "@/lib/seo";

/** @returns {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  return Object.keys(PUBLIC_PAGES).map((path) => ({
    url: canonicalUrl(path),
    // Omit lastModified until a reliable content revision timestamp is available.
    // Build/request time is not a content change.
    changeFrequency: path === "/about" ? "monthly" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
