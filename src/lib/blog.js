export const BLOG_STATUSES = ["draft", "published"];

export function blogPath(post) {
  return `/blog/${post.slug}`;
}

export function readingMinutes(content) {
  const words = String(content || "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatPostDate(value) {
  return new Date(value).toLocaleDateString("en-CA", { month: "long", day: "numeric", year: "numeric", timeZone: "America/Vancouver" });
}

const iso = (value) => (value ? new Date(value).toISOString() : null);

// Public fields only. Lists leave out the body; a single post includes it.
export function publicBlog(post, { content = false } = {}) {
  return {
    _id: String(post._id),
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    ...(content && { content: post.content }),
    image_url: post.image_url || "",
    image_alt: post.image_alt || "",
    author: post.author,
    published_at: iso(post.published_at),
    updatedAt: iso(post.updatedAt),
    reading_minutes: readingMinutes(post.content),
  };
}

// Posts are written in a small Markdown subset: "## " and "### " headings, "- " or
// "1. " lists, "> " quotes and paragraphs separated by blank lines. The page title is
// the only H1, so "# " also becomes an H2.
export function parseBlogContent(text) {
  const blocks = [];
  let open = null; // the paragraph, list or quote the next line may continue
  for (const raw of String(text || "").replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    const item = line.match(/^(?:[-*]|(\d+)[.)])\s+(.+)$/);
    const quote = line.match(/^>\s?(.*)$/);
    if (!line) open = null;
    else if (heading) {
      blocks.push({ type: heading[1].length === 3 ? "h3" : "h2", text: heading[2] });
      open = null;
    } else if (item) {
      const type = item[1] ? "ol" : "ul";
      if (open?.type !== type) blocks.push(open = { type, items: [] });
      open.items.push(item[2]);
    } else if (quote) {
      if (open?.type === "quote") open.text += ` ${quote[1]}`;
      else blocks.push(open = { type: "quote", text: quote[1] });
    } else if (open?.type === "p") open.text += ` ${line}`;
    else blocks.push(open = { type: "p", text: line });
  }
  return blocks;
}

// Link URLs may contain one level of balanced parentheses, as Wikipedia URLs do.
const INLINE = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g;
// Site paths, web and email links only, so a post can never carry a javascript: URL.
const SAFE_HREF = /^(\/(?!\/)|https?:\/\/|mailto:)/;

// **bold**, *italic* and [text](url) inside a block.
export function parseInline(text) {
  const tokens = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    if (match.index > last) tokens.push({ type: "text", text: text.slice(last, match.index) });
    if (match[1]) tokens.push({ type: "strong", text: match[1] });
    else if (match[2]) tokens.push({ type: "em", text: match[2] });
    else if (SAFE_HREF.test(match[4])) tokens.push({ type: "link", text: match[3], href: match[4] });
    else tokens.push({ type: "text", text: match[3] });
    last = match.index + match[0].length;
  }
  if (last < text.length) tokens.push({ type: "text", text: text.slice(last) });
  return tokens;
}

// Public URLs whose content changes when a post goes from `before` to `after` (null
// for a new or deleted post): the post's own URL, old and new, and the blog index.
export function changedBlogPaths(before, after) {
  const live = [before, after].filter((post) => post?.status === "published");
  return live.length ? ["/blog", ...new Set(live.map(blogPath))] : [];
}
