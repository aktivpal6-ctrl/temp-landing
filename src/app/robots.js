import { SITE_URL } from "@/lib/seo";

/** @returns {import('next').MetadataRoute.Robots} */
export default function robots() {
  return {
    rules: [{
      userAgent: "*",
      allow: "/",
      // Login/admin must remain crawlable so their noindex can be read.
      disallow: ["/api/"],
    }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
