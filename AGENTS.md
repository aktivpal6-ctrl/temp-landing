<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Node.js runtime

Use Node.js 26 for all project commands. Run `nvm use` (loading `~/.nvm/nvm.sh` first if needed) to select the version specified in `.nvmrc`.

# SEO & Technical Content Instructions — Community Platform

## Role

You are helping build and maintain the marketing site and public-facing pages of a community platform. Apply every rule below to any page, component, or content piece you generate or edit. If a request conflicts with a rule here, say so instead of silently ignoring the rule.

## 1. Technical foundation (non-negotiable)

- Render marketing/content pages with SSR or static generation (Next.js, Remix, Astro, etc.) — never ship them as a pure client-rendered SPA with an empty initial HTML shell. This is the single most common way AI-built platform sites become invisible to search engines.
- HTTPS everywhere, mobile-responsive layout. Target Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms.
- One canonical URL per piece of content. Query-string variants (sort, filter, session ID, tracking params) are never separate indexable pages — canonicalize them to the clean URL.
- Maintain an auto-updating XML sitemap; it must be submitted in Google Search Console.
- robots.txt: allow crawling of real content; disallow admin, internal search-result, and API paths.
- Every new page must be linked from at least one existing page (nav, sitemap page, or a related-content module). No orphan pages.

## 2. Community/UGC-specific indexing rules

Most pages on a community platform are auto-generated and will hurt SEO if indexed as-is:

- Set `noindex, follow` on: empty or near-empty profile pages, empty/1-post threads, faceted or filtered list views, and paginated pages beyond page 1 (canonicalize to page 1 or a "view all" page instead).
- Add `DiscussionForumPosting` or `Article` schema only to genuine, substantive posts/threads — not to placeholder or auto-generated pages.
- Add `Person` schema to profile pages once they contain real content.
- Add `Organization` and `WebSite` (with `SearchAction`) schema on the homepage.
- Add `BreadcrumbList` schema on nested content pages.

## 3. On-page checklist — apply to every content page

- [ ] Primary keyword/topic appears once in the `<title>` (under ~60 characters) and once in an H2 — never stuffed.
- [ ] Unique meta description per page, under ~155 characters, written for a human.
- [ ] Descriptive, non-generic alt text on every meaningful image.
- [ ] At least one internal link to a related page, and where genuinely relevant, one external link to a credible source.
- [ ] Clean, descriptive, lowercase, hyphenated URL — no IDs or query strings in the canonical URL.

## 4. Content rules

- Write for the topic, not a single keyword. Cover every subtopic a knowledgeable reader would expect — check the top 3-4 currently-ranking pages for the target query and make the page genuinely more complete than theirs, not just longer.
- Never keyword-stuff. If a phrase would appear more than 2-3 times naturally, switch to synonyms or related terms instead.
- Every AI-drafted page needs a human edit pass before publishing: add a real example, real author/contributor expertise, and verify every factual claim. Unedited AI-only pages are exactly what quality-ranking systems are built to suppress.
- Before creating a new page, check whether an existing page already covers the topic. If yes, expand that page instead of creating a near-duplicate — this avoids cannibalization.

## 5. Site architecture — topical mapping

- Group keyword/topic research into clusters of near-duplicate or closely related queries.
- Each cluster gets one pillar page (broad overview) and, where a subtopic is meaty enough, cluster pages that link back to the pillar and to each other.
- Never create a separate thin page per individual keyword variant — this is the #1 cause of cannibalization and diluted authority on new sites.

## 6. Process before publishing any new content page

1. Confirm the target keyword cluster and the searcher's actual intent (informational / commercial / navigational).
2. Pull the top 3-4 currently-ranking pages for the main term; list every subtopic they cover.
3. Build an outline matching or exceeding that coverage.
4. Draft the content.
5. Human review pass (accuracy, real examples, expertise signals).
6. Apply the on-page checklist (Section 3).
7. Add correct schema (Section 2 if UGC, otherwise Article/WebPage).
8. Link the new page from at least one existing page.

## 7. Never do this

- No keyword stuffing, cloaking, doorway pages, hidden text, or link-scheme/PBN backlinks.
- No guaranteeing or implying a specific ranking position in copy or in your own output — rankings vary by query, device, location, and personalization.
- No publishing bulk AI-generated content with no human review purely to increase page count.

## Notes for the human running this

- This file assumes SSR/SSG and information-architecture decisions are made deliberately — re-confirm the framework is SSR/SSG-capable before generation starts if you're unsure.
- Keyword lists are intentionally not included here. Supply your actual niche and target keywords before asking for content — this file governs *how* to build, not *what* to target.
