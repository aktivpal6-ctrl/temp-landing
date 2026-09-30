import { cache } from "react";
import { connectToDatabase } from "@/lib/db";
import Blog from "@/models/Blog";
import { publicBlog } from "@/lib/blog";
import { slugify } from "@/lib/slug";

// Newest first. Cached per request, so metadata and the page share one query.
export const getPublishedPosts = cache(async () => {
  await connectToDatabase();
  const posts = await Blog.find({ status: "published" }).sort({ published_at: -1 }).lean();
  return posts.map((post) => publicBlog(post));
});

export const getPublishedPost = cache(async (slug) => {
  await connectToDatabase();
  const post = await Blog.findOne({ slug, status: "published" }).lean();
  return post && publicBlog(post, { content: true });
});

export async function slugTaken(slug, excludeId = null) {
  return Boolean(await Blog.exists({ slug, _id: { $ne: excludeId } }));
}

// Validated form input as stored fields: a unique slug from the title when the URL is
// left blank, and the first publish date, which later edits and unpublishing keep.
export async function blogFields(input, existing = null) {
  let slug = input.slug;
  if (!slug) {
    const base = slugify(input.title) || "post";
    slug = base;
    for (let n = 2; await slugTaken(slug, existing?._id); n++) slug = `${base}-${n}`;
  }
  const published_at = existing?.published_at || (input.status === "published" ? new Date() : null);
  return { ...input, slug, published_at };
}
