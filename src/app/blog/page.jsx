import { JsonLd } from "@/components/JsonLd";
import { BlogIndexPage } from "@/views/BlogIndexPage";
import { getPublishedPosts } from "@/lib/blog-store";
import { pageMetadata, pageSchema } from "@/lib/seo";

export const runtime = "nodejs";
// Posts change in the admin, so they are read on every request rather than frozen at build time.
export const dynamic = "force-dynamic";

// null when the database is unavailable, so the page can say so instead of looking empty.
function loadPosts() {
  return getPublishedPosts().catch((error) => {
    console.error("Blog posts fetch error:", error.message);
    return null;
  });
}

export async function generateMetadata() {
  const posts = await loadPosts();
  // An empty blog is a thin page: keep it out of search until the first post is published.
  if (posts?.length === 0) return { ...pageMetadata("/blog"), robots: { index: false, follow: true } };
  return pageMetadata("/blog");
}

export default async function Page() {
  const posts = await loadPosts();
  return <>
    <JsonLd data={pageSchema("/blog", "CollectionPage")} />
    <BlogIndexPage posts={posts || []} loadError={!posts} />
  </>;
}
