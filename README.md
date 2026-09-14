# AKTIVPAL Landing

Next.js (App Router) landing page and founding community survey for AKTIVPAL.

## Getting started

```bash
yarn install
```

## Available scripts

| Script          | Description                                            |
| --------------- | ------------------------------------------------------ |
| `yarn dev`      | Start the dev server at http://localhost:3000          |
| `yarn build`    | Create an optimized production build                   |
| `yarn start`    | Serve the production build                             |

## Public routes and search

- `/` — Canadian activity-partner introduction and FAQ
- `/about` — our story and British Columbia origins
- `/movement` — activity overview and interactive event feed
- `/waitlist` — early access signup

`src/lib/seo.js` defines public route metadata, canonical URLs and page schemas.
The canonical origin remains `https://www.aktivpal.com`; the existing host/HTTPS
redirects and trailing-slash normalization are retained. Query variants of
Movement canonicalize to `/movement`.

The sitemap includes only public canonical pages. Login and admin pages send
`noindex, nofollow` in metadata and HTTP headers; they are crawlable so search
engines can read those directives. APIs are disallowed in robots.txt and send
an indexing exclusion header. These directives are not authentication controls.

Visible FAQs and FAQ structured data share `src/data/faq.js`. Native details
elements keep every answer in the HTML and work without JavaScript. The
Movement overview is prerendered; event records still load from the API in
the browser. Individual events do not yet have indexable detail pages or
Event schema. No nationwide availability, ratings or guaranteed rich results
are claimed.

## Isolated build and browser verification

Use Node 20.9 or newer, installed dependencies, Playwright and Chromium.

```bash
yarn verify
# Build only:
yarn verify --build-only
```

If Playwright or Chromium is provided by an external tool installation, set
`PLAYWRIGHT_MODULE` to its absolute module directory and
`CHROMIUM_EXECUTABLE_PATH` to the browser executable.

The verification script copies only source, public assets and build
configuration to a temporary directory. It does not copy or load any
repository environment files and starts child processes with an explicit
environment containing loopback database settings and dummy credentials.
Analytics is disabled by `AKTIVPAL_TEST_MODE=1`. Browser tests mock API
requests, block external requests and reject submissions. The disposable
build uses webpack to support its shared dependency symlink.

Checks cover metadata, canonical URLs, sitemap/robots, private indexing
directives, no-JavaScript content, FAQ/schema consistency, desktop contrast
at the top and after scrolling, mobile dialog dismissal/focus/resize,
and event-feed failures. Screenshots are saved in the printed temporary
directory. Do not deploy the test build.
