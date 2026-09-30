import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { BlogPostPage } from "@/views/BlogPostPage";
import { getPublishedPost, getPublishedPosts } from "@/lib/blog-store";
import { blogPostMetadata, blogPostSchema } from "@/lib/seo";
import { SLUG_PATTERN } from "@/lib/slug";

export const runtime = "nodejs";
// Edits in the admin show on the next request.
export const dynamic = "force-dynamic";

// Drafts and unknown slugs are 404s. A database error is left to throw (a 500), so an
// outage never tells search engines that a post is gone.
async function findPost(params) {
  const { slug } = await params;
  const post = SLUG_PATTERN.test(slug) ? await getPublishedPost(slug) : null;
  if (!post) notFound();
  return post;
}

export async function generateMetadata({ params }) {
  return blogPostMetadata(await findPost(params));
}

export default async function Page({ params }) {
  const post = await findPost(params);
  const others = await getPublishedPosts().catch(() => []);
  return <>
    <JsonLd data={blogPostSchema(post)} />
    <BlogPostPage post={post} related={others.filter((other) => other._id !== post._id).slice(0, 3)} />
  </>;
}
