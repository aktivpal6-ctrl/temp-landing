import assert from "node:assert/strict";
import test from "node:test";
import { blogPostMetadata, blogPostSchema, canonicalUrl, escapeXml, PUBLIC_PAGES, pageMetadata, pageSchema } from "../src/lib/seo.js";
import { publicEvent } from "../src/lib/public-event.js";
import { changedBlogPaths, parseBlogContent, parseInline, publicBlog } from "../src/lib/blog.js";
import { INDEXNOW_ENDPOINT, indexNowKey, indexNowPayload, notifyIndexNow } from "../src/lib/indexnow.js";
import { blogInputSchema } from "../src/lib/blog-schema.js";
import { slugify } from "../src/lib/slug.js";

test("canonical URLs consolidate tracking, fragments and trailing slashes", () => {
  assert.equal(canonicalUrl("/?utm_source=email"), "https://www.aktivpal.com/");
  assert.equal(canonicalUrl("/movement/?page=2#details"), "https://www.aktivpal.com/movement");
  assert.throws(() => canonicalUrl("https://example.com/movement"));
});

test("public pages have unique, concise metadata and consistent schema URLs", () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const [path, page] of Object.entries(PUBLIC_PAGES)) {
    if (path === "/how-it-works") {
      assert.equal(page.title, "How AKTIVPAL Works: Find People, Join or Host a Movement | AKTIVPAL");
    } else {
      assert.ok(page.title.length < 60, `${path}: title length`);
    }
    assert.ok(page.description.length < 155, `${path}: description length`);
    titles.add(page.title);
    descriptions.add(page.description);
    const metadata = pageMetadata(path);
    assert.equal(metadata.alternates.canonical, canonicalUrl(path));
    assert.equal(metadata.openGraph.url, canonicalUrl(path));
    assert.equal(pageSchema(path)["@graph"][0].url, canonicalUrl(path));
  }
  assert.equal(titles.size, Object.keys(PUBLIC_PAGES).length);
  assert.equal(descriptions.size, titles.size);
});

test("public events retain useful content and counts without private attendee fields", () => {
  const event = {
    _id: "example-id", title: "Community walk", description: "Meet for a walk.",
    start_time: new Date("2026-10-01T17:00:00Z"), location: "Vancouver",
    attendees: [{ name: "Private Person", email: "private@example.invalid", phone: "5551234567" }],
    internalNotes: "Never publish this",
  };
  const result = publicEvent(event);
  assert.equal(result.attendeeCount, 1);
  assert.equal(result.title, event.title);
  assert.equal(result.start_time, "2026-10-01T17:00:00.000Z");
  for (const field of ["attendees", "internalNotes"]) assert.ok(!(field in result));
  assert.ok(!JSON.stringify(result).includes("private@example.invalid"));
  assert.equal(publicEvent({ ...event, attendees: null }).attendeeCount, 0);
});

test("slugs are readable, ASCII and cut at a word boundary", () => {
  assert.equal(slugify("Café & Trail Run: Grouse’s Best!"), "cafe-and-trail-run-grouses-best");
  assert.equal(slugify("  --  "), "");
  const long = slugify("word ".repeat(40), 30);
  assert.ok(long.length <= 30 && !long.endsWith("-") && long.split("-").every((part) => part === "word"));
});

test("blog content becomes headings, lists, quotes and paragraphs", () => {
  const blocks = parseBlogContent("Intro line\ncontinues\n\n# Top\n## Gear\n- Boots\n- Water\n1. First\n2) Second\n> Leave no\n> trace\n### Small\nEnd");
  assert.deepEqual(blocks, [
    { type: "p", text: "Intro line continues" },
    { type: "h2", text: "Top" },
    { type: "h2", text: "Gear" },
    { type: "ul", items: ["Boots", "Water"] },
    { type: "ol", items: ["First", "Second"] },
    { type: "quote", text: "Leave no trace" },
    { type: "h3", text: "Small" },
    { type: "p", text: "End" },
  ]);
});

test("inline links are limited to safe URLs", () => {
  const tokens = parseInline("**Go** *now*: [FAQ](/faq), [wiki](https://en.wikipedia.org/wiki/Foo_(bar)), [x](javascript:alert(1)) [y](//evil.test)");
  assert.deepEqual(tokens.filter((t) => t.type === "link").map((t) => t.href), ["/faq", "https://en.wikipedia.org/wiki/Foo_(bar)"]);
  assert.ok(tokens.some((t) => t.type === "strong" && t.text === "Go"));
  assert.ok(!JSON.stringify(tokens).includes('"href":"javascript'));
});

const validPost = {
  title: "Beginner hikes near Vancouver", slug: "beginner-hikes-near-vancouver",
  excerpt: "Five well-marked trails for a first group hike near Vancouver, with distance and elevation for each.",
  content: "## Why start small\nShort trails are easier to plan.", image_url: "https://images.unsplash.com/photo-1",
  image_alt: "Hikers on a forest trail", author: "Jordan Lee", status: "published",
};

test("blog input is validated the same way in the admin form and the API", () => {
  assert.ok(blogInputSchema.safeParse(validPost).success);
  assert.ok(blogInputSchema.safeParse({ ...validPost, slug: "", image_url: "", image_alt: "" }).success);
  const issues = (input) => blogInputSchema.safeParse({ ...validPost, ...input }).error.issues.map((issue) => issue.path[0]);
  assert.deepEqual(issues({ slug: "Bad Slug" }), ["slug"]);
  assert.deepEqual(issues({ image_alt: "" }), ["image_alt"]);
  assert.deepEqual(issues({ image_url: "javascript:alert(1)" }), ["image_url"]);
  assert.deepEqual(issues({ excerpt: "Too short" }), ["excerpt"]);
  assert.deepEqual(issues({ status: "scheduled" }), ["status"]);
});

test("blog posts get canonical article metadata and BlogPosting schema", () => {
  const stored = { ...validPost, _id: "a".repeat(24), content: "word ".repeat(600), published_at: new Date("2026-09-01T16:00:00Z"), updatedAt: new Date("2026-09-03T16:00:00Z") };
  const list = publicBlog(stored);
  assert.ok(!("content" in list), "Lists leave out the body");
  assert.equal(list.reading_minutes, 3);
  const post = publicBlog(stored, { content: true });
  const url = "https://www.aktivpal.com/blog/beginner-hikes-near-vancouver";
  const metadata = blogPostMetadata(post);
  assert.equal(metadata.alternates.canonical, url);
  assert.equal(metadata.title, "Beginner hikes near Vancouver | AKTIVPAL");
  assert.ok(metadata.description.length <= 155);
  assert.equal(metadata.openGraph.type, "article");
  assert.equal(metadata.openGraph.images[0].alt, validPost.image_alt);
  assert.equal(blogPostMetadata({ ...post, title: "t".repeat(70) }).title, "t".repeat(70), "Long titles drop the suffix");
  assert.ok(blogPostMetadata({ ...post, excerpt: "word ".repeat(80) }).description.length <= 155);
  const graph = blogPostSchema(post)["@graph"];
  const article = graph.find((node) => node["@type"] === "BlogPosting");
  assert.equal(article.author.name, "Jordan Lee");
  assert.equal(article.datePublished, "2026-09-01T16:00:00.000Z");
  assert.equal(article.mainEntityOfPage["@id"], `${url}#webpage`);
  assert.deepEqual(graph.find((node) => node["@type"] === "BreadcrumbList").itemListElement.map((item) => item.item),
    ["https://www.aktivpal.com/", "https://www.aktivpal.com/blog", url]);
});

test("search engines hear about every public URL a blog change affects", () => {
  const live = { slug: "old-url", status: "published" };
  const moved = { slug: "new-url", status: "published" };
  const draft = { slug: "draft-url", status: "draft" };
  assert.deepEqual(changedBlogPaths(null, live), ["/blog", "/blog/old-url"]);
  assert.deepEqual(changedBlogPaths(live, moved), ["/blog", "/blog/old-url", "/blog/new-url"]);
  assert.deepEqual(changedBlogPaths(live, live), ["/blog", "/blog/old-url"]);
  assert.deepEqual(changedBlogPaths(live, draft), ["/blog", "/blog/old-url"], "unpublishing announces the removal");
  assert.deepEqual(changedBlogPaths(live, null), ["/blog", "/blog/old-url"]);
  assert.deepEqual(changedBlogPaths(null, draft), [], "drafts stay private");
});

test("IndexNow payloads use canonical URLs and a root key file", () => {
  assert.equal(indexNowKey({ INDEXNOW_KEY: "0123456789abcdef" }), "0123456789abcdef");
  for (const bad of ["", "short", "has spaces in it", "x".repeat(129)]) assert.equal(indexNowKey({ INDEXNOW_KEY: bad }), null);
  assert.deepEqual(indexNowPayload(["/blog", "/blog/a?utm_source=x", "/blog/"], "0123456789abcdef"), {
    host: "www.aktivpal.com",
    key: "0123456789abcdef",
    keyLocation: "https://www.aktivpal.com/indexnow-key.txt",
    urlList: ["https://www.aktivpal.com/blog", "https://www.aktivpal.com/blog/a"],
  });
});

test("IndexNow is only notified when a key is configured outside test mode", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, init) => { calls.push({ url, body: JSON.parse(init.body) }); return new Response(null, { status: 202 }); });
  const env = { ...process.env };
  t.after(() => { process.env = env; });
  delete process.env.AKTIVPAL_TEST_MODE;
  delete process.env.INDEXNOW_KEY;
  await notifyIndexNow(["/blog"]);
  process.env.INDEXNOW_KEY = "0123456789abcdef";
  await notifyIndexNow([]);
  process.env.AKTIVPAL_TEST_MODE = "1";
  await notifyIndexNow(["/blog"]);
  assert.equal(calls.length, 0);
  delete process.env.AKTIVPAL_TEST_MODE;
  await notifyIndexNow(["/blog", "/blog/a"]);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, INDEXNOW_ENDPOINT);
  assert.deepEqual(calls[0].body.urlList, ["https://www.aktivpal.com/blog", "https://www.aktivpal.com/blog/a"]);
});

test("sitemap values are XML-escaped", () => {
  assert.equal(escapeXml("https://images.unsplash.com/p?w=1600&q=80&fm=jpg"), "https://images.unsplash.com/p?w=1600&amp;q=80&amp;fm=jpg");
  assert.equal(escapeXml(`a<b>"c'`), "a&lt;b&gt;&quot;c&apos;");
});
