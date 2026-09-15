import { SITE_URL } from "@/lib/seo";

/** @returns {import('next').MetadataRoute.Robots} */
export default function robots() {
  return {
    rules: [{
      userAgent: "*",
      allow: "/",
      // Crawl exclusions are not access controls. Private routes also send noindex.
      disallow: ["/api/", "/admin", "/search"],
    }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
