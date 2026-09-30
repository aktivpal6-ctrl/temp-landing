"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { blogInputSchema } from "@/lib/blog-schema";
import { slugify } from "@/lib/slug";

const CARD = "rounded-[1.5rem] border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]";
const LABEL = "text-sm font-bold text-[#0F291E]";
const HINT = "text-xs text-[#4A524A]";

const FORMATTING = [
  ["## Heading", "section heading"],
  ["### Heading", "smaller heading"],
  ["- item", "bullet list (1. for numbered)"],
  ["> text", "pull quote"],
  ["**bold**  *italic*", "emphasis"],
  ["[text](/movement)", "link to a page or https:// address"],
];

function FieldError({ error }) {
  return error ? <p className="text-xs text-red-500">{error.message}</p> : null;
}

export const BlogForm = ({ initialData, onSubmit, submitLabel = "Create post", submitting = false, error = "" }) => {
  // The URL follows the title until someone edits it by hand.
  const [slugEdited, setSlugEdited] = useState(Boolean(initialData?.slug));
  const [previewFailed, setPreviewFailed] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(blogInputSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      image_url: initialData?.image_url || "",
      image_alt: initialData?.image_alt || "",
      author: initialData?.author || "",
      status: initialData?.status || "draft",
    },
  });

  const title = watch("title");
  const slug = watch("slug");
  const excerpt = watch("excerpt");
  const imageUrl = watch("image_url");
  const status = watch("status");

  useEffect(() => {
    if (!slugEdited) setValue("slug", slugify(title));
  }, [title, slugEdited, setValue]);

  useEffect(() => setPreviewFailed(false), [imageUrl]);

  const slugField = register("slug");
  const movesPublishedPost = initialData?.status === "published" && slug !== initialData.slug;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className={CARD}>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className={LABEL}>Title</Label>
            <Input id="title" placeholder="e.g. 7 beginner-friendly hikes near Vancouver" {...register("title")} className="border-black/10" />
            <FieldError error={errors.title} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className={LABEL}>Page URL</Label>
            <div className="flex items-center overflow-hidden rounded-md border border-black/10 focus-within:ring-1 focus-within:ring-ring">
              <span className="shrink-0 border-r border-black/10 bg-[#F7F7F2] px-3 py-2 text-sm text-[#4A524A]">aktivpal.com/blog/</span>
              <input
                id="slug"
                {...slugField}
                onChange={(e) => {
                  setSlugEdited(e.target.value !== "");
                  slugField.onChange(e);
                }}
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-base outline-none md:text-sm"
              />
            </div>
            <p className={HINT}>Lowercase words joined by hyphens. Filled in from the title until you change it.</p>
            {movesPublishedPost && (
              <p className="text-xs font-semibold text-[#A63C00]">
                This post is live. Changing its URL breaks links people have already shared.
              </p>
            )}
            <FieldError error={errors.slug} />
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-4">
              <Label htmlFor="excerpt" className={LABEL}>Summary</Label>
              <span className={`text-xs ${excerpt.length > 155 ? "text-[#A63C00]" : "text-[#4A524A]"}`}>{excerpt.length}/300</span>
            </div>
            <Textarea
              id="excerpt"
              rows={3}
              placeholder="One or two sentences on what readers will get from this post."
              {...register("excerpt")}
              className="border-black/10"
            />
            <p className={HINT}>
              Shown on the blog page, in search results and in link previews. Search results cut it off after about 155 characters.
            </p>
            <FieldError error={errors.excerpt} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author" className={LABEL}>Author</Label>
            <Input id="author" placeholder="e.g. Jordan Lee" {...register("author")} className="border-black/10" />
            <p className={HINT}>The person who wrote the post. It is shown on the post and to search engines.</p>
            <FieldError error={errors.author} />
          </div>
        </div>
      </div>

      <div className={CARD}>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="image_url" className={LABEL}>Cover image URL (optional)</Label>
            <Input id="image_url" type="url" placeholder="https://images.unsplash.com/photo-..." {...register("image_url")} className="border-black/10" />
            <FieldError error={errors.image_url} />
          </div>

          {/^https?:\/\/\S+$/.test(imageUrl) && (
            previewFailed ? (
              <p className="text-xs font-semibold text-red-500">This image could not be loaded. Check that the URL points directly to an image.</p>
            ) : (
              <div className="aspect-[16/9] overflow-hidden rounded-xl border border-black/10 bg-[#F7F7F2]">
                <img src={imageUrl} alt="" onError={() => setPreviewFailed(true)} className="h-full w-full object-cover" />
              </div>
            )
          )}

          <div className="space-y-2">
            <Label htmlFor="image_alt" className={LABEL}>Image description</Label>
            <Input id="image_alt" placeholder="e.g. Three hikers on a forest trail above Vancouver at sunrise" {...register("image_alt")} className="border-black/10" />
            <p className={HINT}>Describe what the photo shows, for screen readers and search engines. Required when there is a cover image.</p>
            <FieldError error={errors.image_alt} />
          </div>
        </div>
      </div>

      <div className={CARD}>
        <div className="space-y-2">
          <Label htmlFor="content" className={LABEL}>Content</Label>
          <Textarea
            id="content"
            rows={20}
            placeholder={"Start with a short introduction.\n\n## First section\nWrite paragraphs separated by a blank line."}
            {...register("content")}
            className="border-black/10 font-mono text-sm leading-relaxed"
          />
          <FieldError error={errors.content} />
          <ul className="grid gap-x-6 gap-y-1 pt-2 text-xs text-[#4A524A] sm:grid-cols-2">
            {FORMATTING.map(([syntax, meaning]) => (
              <li key={syntax}><code className="rounded bg-[#F7F7F2] px-1.5 py-0.5 text-[#0F291E]">{syntax}</code> {meaning}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={CARD}>
        <div className="space-y-2">
          <Label className={LABEL}>Status</Label>
          <Select value={status} onValueChange={(val) => setValue("status", val, { shouldValidate: true })}>
            <SelectTrigger className="border-black/10" data-testid="blog-status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <p className={HINT}>Drafts are only visible here in the admin. Published posts appear on the blog straight away.</p>
          <FieldError error={errors.status} />
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[#FF5C00] px-6 py-3 text-sm font-bold text-white hover:bg-[#e64f00] disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
};
