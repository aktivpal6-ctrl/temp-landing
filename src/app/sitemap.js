import { PUBLIC_PAGES, canonicalUrl } from "@/lib/seo";

/** @returns {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  // No fabricated lastModified: add dates only when backed by content revisions.
  return Object.keys(PUBLIC_PAGES).map((path) => ({
    url: canonicalUrl(path),
    changeFrequency: path === "/about" ? "monthly" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
