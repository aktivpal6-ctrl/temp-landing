import mongoose from "mongoose";
import { BLOG_STATUSES } from "@/lib/blog";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    // Public URL segment: /blog/<slug>.
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    // Summary for the blog index, search results and link previews.
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    image_url: { type: String, default: "", trim: true },
    image_alt: { type: String, default: "", trim: true },
    author: { type: String, required: true, trim: true },
    status: { type: String, enum: BLOG_STATUSES, default: "draft" },
    // Set the first time a post is published and kept through later edits.
    published_at: { type: Date, default: null },
  },
  { timestamps: true },
);

BlogSchema.index({ status: 1, published_at: -1 });

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema, "blogs");

export default Blog;
