import { z } from "zod";
import { SLUG_PATTERN } from "./slug.js";
import { BLOG_STATUSES } from "./blog.js";

const httpUrl = z.string().trim().url("Must be a valid URL")
  .refine((value) => /^https?:\/\//.test(value), "Must start with http:// or https://");

// Shared by the admin form and the API, so both reject the same input.
export const blogInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120, "Title must be 120 characters or less"),
  slug: z.string().trim().max(100, "URL must be 100 characters or less")
    .regex(SLUG_PATTERN, "Use lowercase letters, numbers and single hyphens").or(z.literal("")),
  excerpt: z.string().trim().min(50, "Summary must be at least 50 characters").max(300, "Summary must be 300 characters or less"),
  content: z.string().trim().min(1, "Content is required").max(50000, "Content must be 50,000 characters or less"),
  image_url: httpUrl.or(z.literal("")),
  image_alt: z.string().trim().max(200, "Image description must be 200 characters or less"),
  author: z.string().trim().min(1, "Author is required").max(80, "Author must be 80 characters or less"),
  status: z.enum(BLOG_STATUSES, { required_error: "Status is required" }),
}).refine((post) => !post.image_url || post.image_alt, {
  message: "Describe the image for people who can't see it",
  path: ["image_alt"],
});
