import { PUBLIC_PAGES, canonicalUrl, escapeXml } from "@/lib/seo";
import { blogPath } from "@/lib/blog";
import { getPublishedPosts } from "@/lib/blog-store";

// Built per request from the database, so a post appears, changes or disappears here
// as soon as it is saved in the admin. Search engines find this file through
// robots.txt and Search Console; the admin API also notifies IndexNow (lib/indexnow.js).
export const dynamic = "force-dynamic";

/** @returns {Promise<import('next').MetadataRoute.Sitemap>} */
export default async function sitemap() {
  // During a database outage the static pages are still listed.
  const posts = await getPublishedPosts().catch(() => null);
  // Google uses <lastmod> to schedule recrawls, so it is only set from real content
  // changes: a post's last save, and for the index, the most recent save of any post.
  const blogUpdated = posts?.map((post) => post.updatedAt).filter(Boolean).sort().at(-1);
  // An empty blog index is noindex (see app/blog/page.jsx), so it is left out until the first post.
  const paths = Object.keys(PUBLIC_PAGES).filter((path) => path !== "/blog" || posts?.length !== 0);
  return [
    ...paths.map((path) => ({
      url: canonicalUrl(path),
      // Other pages have no revision timestamp; build or request time is not a content change.
      ...(path === "/blog" && blogUpdated && { lastModified: blogUpdated }),
      changeFrequency: path === "/about" ? "monthly" : "weekly",
      priority: path === "/" ? 1 : 0.7,
    })),
    ...(posts || []).map((post) => ({
      url: canonicalUrl(blogPath(post)),
      ...(post.updatedAt && { lastModified: post.updatedAt }),
      changeFrequency: "monthly",
      priority: 0.6,
      // Canonical URLs are always XML-safe; admin-entered image URLs are not.
      ...(post.image_url && { images: [escapeXml(post.image_url)] }),
    })),
  ];
}
