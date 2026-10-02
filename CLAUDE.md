# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
nvm use                    # select the Node version pinned in .nvmrc before anything else
yarn install
yarn dev                   # dev server at http://localhost:3000 (loads real .env)
yarn build                 # production build
yarn start                 # serve the production build
node --test tests/seo.test.mjs   # run the SEO/metadata/schema unit tests directly
yarn verify                 # full isolated build + Playwright browser checks (see below)
yarn verify --build-only     # isolated build only, no browser checks
```

`yarn verify` is the real check to run after touching SEO, metadata, routing, or anything
rendered server-side — it copies `src`, `public` and build config into a disposable temp
directory (no `.env*` files are copied), builds with webpack under dummy env vars
(`AKTIVPAL_TEST_MODE=1`, loopback `MONGO_URI`, fake admin/mail credentials), starts that
build, and runs `tests/browser.mjs` against it with all network/API requests mocked and
submissions rejected. Never deploy the disposable build. If Playwright/Chromium come from
an external install, set `PLAYWRIGHT_MODULE` and `CHROMIUM_EXECUTABLE_PATH` first.

There is no separate lint script; ESLint config exists via devDependencies but is invoked
through editor integration, not a package.json script.

## Architecture

Next.js App Router (`next@16`, intentionally **not** the Next.js you already know — see
AGENTS.md: read `node_modules/next/dist/server/lib/generate-agent-files.js`-generated docs
under `node_modules/next/dist/docs/` before assuming any API). Plain JS/JSX, no TypeScript
(`components.json` has `tsx: false`, `rsc: false`). Path alias `@/*` → `src/*`
(`jsconfig.json`).

**Routing is a thin shell over `src/views/`.** Every `src/app/**/page.jsx` is a few lines:
import the matching component from `src/views/`, attach `pageMetadata(path)` /
`pageSchema(path, type)` from `src/lib/seo.js`, render a `<JsonLd>` block plus the view. Data
fetching for a route (e.g. `src/app/movement/page.jsx` querying `Event`) happens in the
`page.jsx`, not inside the view component — views receive data as props
(`initialEvents`, `initialLoadError`, etc.) so they stay presentational/client-interactive.
When adding a route, follow this split rather than putting markup directly in `app/`.

**SEO is centralized, not per-page.** `src/lib/seo.js` is the single source of truth:
- `PUBLIC_PAGES` maps each public path to its title/description/breadcrumb name — titles
  under ~60 chars, descriptions under ~155 chars, enforced by `tests/seo.test.mjs`.
- `canonicalUrl(path)` strips query/hash/trailing slash and throws if the path doesn't
  resolve under `SITE_URL` (`https://www.aktivpal.com`) — the only way a canonical URL is
  produced anywhere in the app.
- `pageMetadata`/`pageSchema` (static pages), `eventMetadata`/`eventSchema` (DB-backed
  event pages), `blogPostMetadata`/`blogPostSchema` (DB-backed posts) each return Next
  `metadata` objects and schema.org `@graph` JSON-LD consistently (WebPage + BreadcrumbList
  + the type-specific node, all keyed by the same canonical URL).
- Query-string variants and pagination beyond page 1 get `X-Robots-Tag: noindex, follow`
  via headers in `next.config.js`, not by duplicating logic elsewhere.
- Adding a new public page means: add an entry to `PUBLIC_PAGES`, add it to
  `src/app/sitemap.js`'s path list if applicable, and link it from existing nav/content —
  don't hand-roll metadata in the page file.

**Content models follow a store + public-projection pattern**, used to keep private fields
(attendee contact info, internal notes) out of anything sent to the browser or baked into
HTML/schema:
- `src/lib/public-event.js` (`publicEvent`) and `src/lib/blog.js` (`publicBlog`) are
  explicit allowlists — add a field to a Mongoose model and it will **not** appear in API
  responses or SSR'd pages until it's added to the corresponding allowlist function too.
- `src/lib/blog-store.js` wraps Mongoose queries in React's `cache()` so a given request
  only hits the DB once even if metadata and the page body both need the same post/list.
- `src/lib/db.js` holds a single cached `mongoose` connection on `global` (survives Next's
  module reloads in dev); a failed connect clears the cached promise so the next request
  retries instead of staying poisoned.

**Admin is a separate, deliberately simple auth layer**, not a general auth system:
`src/lib/auth.js` signs an opaque random token with an HMAC (`ADMIN_SECRET`) into an
`admin_session` cookie; `isAdmin()` just verifies the signature. There's one shared
`ADMIN_PASSWORD`, no per-user accounts. `src/app/admin/**` and `/login` are `noindex,
nofollow` via both route `metadata` and `next.config.js` headers (crawl exclusion is not
an access control — admin routes still require the signed cookie).

**IndexNow** (`src/lib/indexnow.js`): on blog/event changes the admin API can ping
IndexNow-participating engines (Bing, Yandex, etc. — not Google, which relies on the
sitemap's `lastmod`). No-ops without a valid `INDEXNOW_KEY` and during
`AKTIVPAL_TEST_MODE=1`. The key is also served verbatim at `/indexnow-key.txt`
(`src/app/indexnow-key.txt/route.js`) since the key location must match.

**Dynamic vs. static rendering**: pages backed by MongoDB (`movement`, `blog/[slug]`,
`sitemap.js`) set `export const dynamic = "force-dynamic"` so database content is never
frozen into a build-time snapshot — keep this when adding new DB-backed routes.

UI primitives in `src/components/ui/` are shadcn/radix components (`style: "new-york"`,
`baseColor: "neutral"`, icons from `lucide-react`); prefer composing from there over adding
new Radix primitives directly.
