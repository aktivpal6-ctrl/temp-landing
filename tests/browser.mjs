import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { get } from "node:http";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.TEST_BASE_URL;
assert.ok(base && new URL(base).hostname === "127.0.0.1", "Tests require the isolated loopback server");
const artifacts = process.env.TEST_ARTIFACTS;
mkdirSync(artifacts, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH } : {}),
});
const routes = ["/", "/about", "/movement", "/waitlist", "/how-it-works", "/faq", "/blog"];
let checks = 0;
async function check(name, fn) {
  await fn();
  checks++;
  console.log(`PASS ${name}`);
}
async function context(options = {}) {
  const ctx = await browser.newContext({ reducedMotion: "reduce", ...options });
  // No external requests, real event records, emails, authentication or writes.
  await ctx.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.origin !== base) return route.abort();
    if (url.pathname === "/_next/image" && /^https?:/.test(url.searchParams.get("url") || "")) return route.abort();
    if (url.pathname.startsWith("/api/")) {
      assert.equal(request.method(), "GET", "Browser checks must not submit data");
      return route.fulfill({ json: url.pathname === "/api/events" ? [] : { authenticated: false } });
    }
    return route.continue();
  });
  return ctx;
}
function schemas(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap((match) => { const data = JSON.parse(match[1]); return data["@graph"] || [data]; });
}
async function waitFor(page, fn) {
  await page.waitForFunction(fn);
}
try {
  await check("public HTML metadata, canonical URLs and schema relationships", async () => {
    const titles = new Set();
    for (const path of routes) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200);
      const html = await response.text();
      const canonical = "https://www.aktivpal.com" + path;
      // Next normalizes the homepage metadata URL without a trailing slash.
      const metadataCanonical = path === "/" ? canonical.slice(0, -1) : canonical;
      assert.ok(html.includes('lang="en-CA"'));
      assert.ok(html.includes(`rel="canonical" href="${metadataCanonical}"`));
      assert.ok(html.includes(`property="og:url" content="${metadataCanonical}"`));
      assert.ok(html.includes('property="og:locale" content="en_CA"'));
      assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
      assert.ok(!html.includes("googletagmanager.com"), "Analytics disabled for tests");
      titles.add(html.match(/<title>(.*?)<\/title>/)[1]);
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${path}: one H1`);
      assert.equal((html.match(/rel="canonical"/g) || []).length, 1, `${path}: one canonical`);
      const data = schemas(html);
      assert.ok(data.some((item) => item["@type"] === "Organization" && item.areaServed.name === "British Columbia, Canada"));
      assert.ok(data.some((item) => item["@id"] === canonical + "#webpage" && item.isPartOf["@id"].endsWith("/#website")));
      assert.ok(data.some((item) => item["@type"] === "BreadcrumbList"));
    }
    assert.equal(titles.size, routes.length);
    const html = await (await fetch(base + "/movement?event=test&utm_source=test")).text();
    assert.ok(html.includes('rel="canonical" href="https://www.aktivpal.com/movement"'));
    assert.ok(html.includes("Outdoor activities in British Columbia"));
    assert.ok(html.includes("Activities could not be loaded"), "Database outage is explained in server HTML");
    assert.ok(!html.includes("animate-pulse"), "Server response does not leave an empty loading shell");
  });

  await check("sitemap, robots, private route indexing and canonical redirects", async () => {
    const xml = await (await fetch(base + "/sitemap.xml")).text();
    const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    assert.deepEqual(locations.sort(), routes.map((path) => "https://www.aktivpal.com" + path).sort());
    const lastModified = [...xml.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map((m) => m[1]);
    assert.equal(lastModified.length, 0, "Do not fabricate content modification dates");
    const robots = await (await fetch(base + "/robots.txt")).text();
    assert.ok(robots.includes("Allow: /"));
    assert.ok(robots.includes("Disallow: /api/"));
    assert.ok(robots.includes("Sitemap: https://www.aktivpal.com/sitemap.xml"));
    assert.ok(robots.includes("Disallow: /admin") && robots.includes("Disallow: /search"));
    assert.ok(!robots.includes("Disallow: /login"));
    // The IndexNow key file only exists where INDEXNOW_KEY is set (the live site).
    assert.equal((await fetch(base + "/indexnow-key.txt")).status, 404);
    for (const path of ["/login", "/admin", "/admin/events", "/admin/events/test/edit"]) {
      const response = await fetch(base + path);
      assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
      const html = await response.text();
      assert.ok(html.includes('name="robots" content="noindex, nofollow"'));
      assert.ok(!html.includes('rel="canonical"'), "Private routes must not inherit the home canonical");
    }
    const redirect = await fetch(base + "/about/", { redirect: "manual" });
    assert.equal(redirect.status, 308);
    assert.equal(redirect.headers.get("location"), "/about");
    // Node fetch may replace Host; a raw HTTP request tests virtual-host rules.
    const hostRedirect = await new Promise((resolve, reject) => {
      get(base + "/about", { headers: { Host: "aktivpal.com" } }, (response) => {
        response.resume();
        resolve(response);
      }).on("error", reject);
    });
    assert.equal(hostRedirect.statusCode, 308);
    assert.equal(hostRedirect.headers.location, "https://www.aktivpal.com/about");
    for (const path of routes) {
      for (const query of ["sort=date", "filter=hiking", "q=walk", "page=2", "page=10", "page=02", "event=test"]) {
        const response = await fetch(`${base}${path}?${query}`, { method: "HEAD" });
        assert.equal(response.headers.get("x-robots-tag"), "noindex, follow", `${path}?${query}`);
      }
      for (const query of ["utm_source=test", "page=1"]) {
        const response = await fetch(`${base}${path}?${query}`, { method: "HEAD" });
        assert.equal(response.headers.get("x-robots-tag"), null, `${path}?${query} keeps clean-page indexing`);
      }
    }
    const missing = await fetch(base + "/missing-seo-test-page");
    assert.equal(missing.status, 404);
    assert.ok((await missing.text()).includes('name="robots" content="noindex"'));
  });

  await check("no-JavaScript content, native FAQs and crawlable internal links", async () => {
    const ctx = await context({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(base);
    assert.ok(await page.getByRole("heading", { name: "Find people for outdoor activities near you." }).isVisible());
    assert.equal(await page.locator("main details").count(), 0);
    await page.goto(base + "/faq");
    const html = await (await fetch(base + "/faq")).text();
    const faq = schemas(html).find((item) => item["@type"] === "FAQPage");
    for (const question of faq.mainEntity) {
      const details = page.locator("details").filter({ hasText: question.name });
      await details.locator("summary").click();
      assert.equal(await details.locator("p").innerText(), question.acceptedAnswer.text);
      assert.ok(await details.locator("p").isVisible());
    }
    for (const path of routes.slice(1)) assert.ok(await page.locator(`a[href="${path}"]`).count());
    await page.goto(base + "/movement");
    assert.ok(await page.getByRole("heading", { name: "Outdoor activities in British Columbia" }).isVisible());
    for (const path of routes) {
      await page.goto(base + path);
      const hidden = await page.locator("main h1, main h2, main p").evaluateAll((elements) => elements.filter((element) => {
        if (element.closest("details:not([open])")) return false;
        for (let node = element; node && node.tagName !== "BODY"; node = node.parentElement) {
          const style = getComputedStyle(node);
          if (Number(style.opacity) === 0 || style.visibility === "hidden" || style.display === "none") return true;
        }
        return false;
      }).map((element) => element.textContent.slice(0, 80)));
      assert.deepEqual(hidden, [], `${path}: content remains visible without JavaScript`);
      if (["/about", "/movement", "/waitlist", "/blog"].includes(path)) assert.ok(await page.getByRole("navigation", { name: "Breadcrumb", exact: true }).isVisible());
    }
    await ctx.close();
  });

  const ctx = await context();
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await check("responsive public pages and optimized About hero", async () => {
    for (const width of [360, 375, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of routes) {
        await page.goto(base + path);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${path} overflows at ${width}px`);
        assert.equal(await page.locator("main h1").count(), 1);
        if (["/", "/how-it-works", "/faq"].includes(path)) {
          const heading = await page.locator("main h1").evaluate((el) => ({ size: parseFloat(getComputedStyle(el).fontSize), weight: Number(getComputedStyle(el).fontWeight) }));
          assert.ok(heading.size >= 32 && heading.weight >= 600, `${path}: heading scale survives global styles`);
        }
        assert.equal(await page.locator("img:not([alt])").count(), 0);
        await page.screenshot({ path: join(artifacts, `${path.slice(1) || "home"}-${width}.png`) });
      }
    }
    await page.goto(base + "/about");
    const hero = page.getByTestId("about-hero").locator("img");
    await hero.evaluate((img) => img.decode());
    assert.ok((await hero.getAttribute("srcset")).includes("/_next/image?"));
    assert.ok(await hero.evaluate((img) => img.naturalWidth > 0));
  });
  await check("desktop navigation contrast, keyboard focus and route links", async () => {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const path of routes) {
      await page.goto(base + path);
      for (const scroll of [0, 1000]) {
        await page.evaluate((y) => window.scrollTo(0, y), scroll);
        await page.waitForFunction((expected) => document.querySelector("[data-testid=site-nav]").dataset.theme === expected, "light");
        const palette = await page.getByTestId("site-nav").evaluate((header) => ({
          background: getComputedStyle(header).backgroundColor,
          text: getComputedStyle(header).color,
          logo: header.querySelector("svg path").getAttribute("fill"),
        }));
        assert.equal(palette.text, "rgb(15, 41, 30)");
        assert.equal(palette.logo, "#0F291E");
        const contrast = await page.getByTestId("site-nav").evaluate((header) => {
          const luminance = (color) => {
            const rgb = color.match(/[\d.]+/g).slice(0, 3).map(Number).map((v) => {
              v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
            });
            return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
          };
          return [...header.querySelectorAll("nav a, [data-testid=nav-cta]")].map((link) => {
            const style = getComputedStyle(link);
            const fg = luminance(style.color);
            const bg = luminance(link.dataset.testid === "nav-cta" ? style.backgroundColor : getComputedStyle(header).backgroundColor);
            return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
          });
        });
        assert.ok(contrast.every((ratio) => ratio >= 4.5), `Contrast: ${contrast}`);
      }
    }
    await page.getByTestId("nav-logo-link").focus();
    await page.keyboard.press("Tab");
    assert.ok(await page.evaluate(() => document.activeElement.matches(":focus-visible")));
    assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle), "solid");
    await page.getByTestId("site-nav").getByRole("link", { name: "Our story" }).click();
    await page.waitForURL(base + "/about");
    assert.equal(await page.getByTestId("site-nav").getByRole("link", { name: "Our story" }).getAttribute("aria-current"), "page");
    await page.screenshot({ path: join(artifacts, "desktop-navbar.png") });
  });

  await check("mobile focus trap, Escape, close button, backdrop and scroll restoration", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base);
    const toggle = page.getByTestId("nav-mobile-toggle");
    const dialog = page.getByTestId("mobile-nav-overlay");
    await page.evaluate(() => { document.body.style.overflow = "auto"; });
    await toggle.click();
    await waitFor(page, () => document.querySelector("dialog").open);
    assert.equal(await toggle.getAttribute("aria-expanded"), "true");
    assert.equal(await page.evaluate(() => document.body.style.overflow), "hidden");
    for (let i = 0; i < 18; i++) {
      await page.keyboard.press(i < 9 ? "Tab" : "Shift+Tab");
      assert.ok(await page.evaluate(() => document.querySelector("dialog").contains(document.activeElement)));
    }
    await page.screenshot({ path: join(artifacts, "mobile-menu.png") });
    await page.keyboard.press("Escape");
    await waitFor(page, () => !document.querySelector("dialog").open && document.body.style.overflow === "auto");
    assert.ok(await toggle.evaluate((el) => el === document.activeElement));
    await toggle.click();
    await dialog.getByRole("button", { name: "Close menu" }).click();
    await waitFor(page, () => !document.querySelector("dialog").open);
    await toggle.click();
    await page.mouse.click(5, 400);
    await waitFor(page, () => !document.querySelector("dialog").open);
  });

  await check("mobile same-route, logo, CTA, resize and short-screen behaviour", async () => {
    const toggle = page.getByTestId("nav-mobile-toggle");
    const dialog = page.getByTestId("mobile-nav-overlay");
    await page.goto(base + "/about");
    await toggle.click();
    await dialog.getByRole("link", { name: "Our story" }).click();
    await waitFor(page, () => !document.querySelector("dialog").open && document.body.style.overflow !== "hidden");
    await toggle.click();
    await dialog.getByRole("link", { name: "AKTIVPAL home" }).click();
    await page.waitForURL(base + "/");
    await toggle.click();
    await page.getByTestId("mobile-nav-cta").click();
    await page.waitForURL(base + "/waitlist");
    assert.notEqual(await page.evaluate(() => document.body.style.overflow), "hidden");
    await page.goto(base);
    await toggle.click();
    await page.setViewportSize({ width: 1000, height: 700 });
    await waitFor(page, () => !document.querySelector("dialog").open && document.body.style.overflow !== "hidden");
    assert.ok(await page.getByTestId("nav-cta").evaluate((el) => el === document.activeElement));
    await page.setViewportSize({ width: 999, height: 600 });
    assert.equal(await toggle.getAttribute("aria-expanded"), "false");
    await page.setViewportSize({ width: 320, height: 480 });
    await toggle.click();
    await page.getByTestId("mobile-nav-cta").scrollIntoViewIfNeeded();
    assert.ok(await page.getByTestId("mobile-nav-cta").isVisible());
    assert.ok(await page.evaluate(() => document.querySelector("dialog").scrollWidth <= window.innerWidth));
    await page.keyboard.press("Escape");
    await page.screenshot({ path: join(artifacts, "mobile-home.png") });
  });

  await check("event feed error state and browser runtime errors", async () => {
    await ctx.route("**/api/events", (route) => route.fulfill({ status: 503, json: { error: "Test outage" } }));
    await page.goto(base + "/movement");
    await page.getByRole("status").filter({ hasText: "Activities could not be loaded" }).waitFor();
    assert.deepEqual(errors, []);
  });
  await check("shared navigation, footer-only FAQ and trust links, accessible example toggle", async () => {
    for (const path of routes) {
      await page.goto(base + path);
      assert.equal(await page.getByTestId("site-nav").count(), 1);
      assert.equal(await page.getByRole("navigation", { name: "Footer navigation" }).count(), 1);
      assert.equal(await page.getByTestId("site-nav").locator('a[href="/faq"]').count(), 0);
      assert.equal(await page.getByTestId("mobile-nav-overlay").locator('a[href="/faq"]').count(), 0);
      assert.equal(await page.getByRole("navigation", { name: "Footer navigation" }).locator('a[href="/faq"]').count(), 1);
      // Trust and safety lives in the footer only, like the FAQ.
      assert.equal(await page.getByTestId("site-nav").locator('a[href="/#trust"]').count(), 0);
      assert.equal(await page.getByTestId("mobile-nav-overlay").locator('a[href="/#trust"]').count(), 0);
      assert.equal(await page.getByRole("navigation", { name: "Footer navigation" }).locator('a[href="/#trust"]').count(), 1);
    }
    await page.goto(base);
    // The accessible name changes with the state, so find the toggle by its pressed state.
    const toggle = page.locator(".apm-plan-card button[aria-pressed]");
    await toggle.click();
    assert.equal(await toggle.getAttribute("aria-pressed"), "true");
    assert.equal(await toggle.innerText(), "You're in");
    assert.ok(await page.locator(".apm-plan-card").getByText("4 interested", { exact: true }).isVisible());
    await toggle.click();
    assert.equal(await toggle.getAttribute("aria-pressed"), "false");
    assert.ok(await page.locator(".apm-plan-card").getByText("3 interested", { exact: true }).isVisible());
    await page.goto(base + "/faq");
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.textContent), "Skip to content");
    await page.keyboard.press("Enter");
    assert.equal(await page.evaluate(() => document.activeElement.id), "main-content");
  });

  await check("dark scheme, local photos, touch targets and reduced motion", async () => {
    await page.setViewportSize({ width: 375, height: 812 });
    for (const colorScheme of ["light", "dark"]) {
      await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
      for (const path of ["/", "/how-it-works", "/faq"]) {
        await page.goto(base + path);
        for (const img of await page.locator("main img").all()) {
          await img.scrollIntoViewIfNeeded();
          // Lazy images start loading a frame after they scroll into view; wait for a real load.
          await img.evaluate((element) => (element.complete && element.naturalWidth > 0) || new Promise((resolve, reject) => {
            element.addEventListener("load", resolve, { once: true });
            element.addEventListener("error", () => reject(new Error(`Image failed to load: ${element.currentSrc}`)), { once: true });
          }));
          await img.evaluate((element) => element.decode());
          assert.ok((await img.getAttribute("src")).startsWith("/_next/image?url=%2Fimages%2Fhome%2F"));
        }
        const shortTargets = await page.locator("main a, main button, main summary").evaluateAll((elements) => elements.filter((el) => el.getBoundingClientRect().height < 44).map((el) => el.textContent));
        assert.deepEqual(shortTargets, []);
        assert.equal(await page.locator(".apm-pending").count(), 0);
        assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
        await page.screenshot({ path: join(artifacts, `${path.slice(1) || "home"}-${colorScheme}-375.png`), fullPage: true });
      }
      await page.goto(base);
      const surface = await page.locator("main.marketing-page").evaluate((el) => getComputedStyle(el).backgroundColor);
      assert.equal(surface, colorScheme === "dark" ? "rgb(10, 28, 20)" : "rgb(247, 247, 242)");
    }
  });

  await check("home-only motion and live preference changes", async () => {
    const motionContext = await context({ reducedMotion: "no-preference", viewport: { width: 1280, height: 900 } });
    const motionPage = await motionContext.newPage();
    await motionPage.goto(base);
    await motionPage.waitForFunction(() => document.querySelector(".apm-pending"));
    await motionPage.mouse.move(300, 250);
    assert.ok(await motionPage.locator(".apm-hero").evaluate((el) => el.style.getPropertyValue("--mx")));
    await motionPage.evaluate(() => window.scrollTo(0, 250));
    // The home banner has no photo; its rings and elevation line carry the parallax.
    await motionPage.waitForFunction(() => document.querySelector(".apm-hero [data-parallax]").style.translate !== "");
    assert.equal(await motionPage.locator(".apm-hero img").count(), 0);
    assert.equal(await motionPage.getByTestId("trail-rail").count(), 1);
    // The timeline is taller than the viewport, so bring each step into view in turn.
    for (const step of await motionPage.locator(".apm-steps > li").all()) await step.scrollIntoViewIfNeeded();
    await motionPage.waitForFunction(() => !document.querySelector(".apm-steps .apm-pending"));
    await motionPage.locator("[data-tilt]").hover();
    assert.ok(await motionPage.locator("[data-tilt]").evaluate((el) => el.style.transform.includes("rotate")));
    await motionPage.emulateMedia({ reducedMotion: "reduce" });
    await motionPage.waitForFunction(() => !document.querySelector(".apm-pending") && [...document.querySelectorAll("[data-parallax]")].every((el) => el.style.translate === ""));
    assert.equal(await motionPage.locator("[data-tilt]").evaluate((el) => el.style.transform), "");
    await motionPage.emulateMedia({ reducedMotion: "no-preference" });
    await motionPage.getByTestId("site-nav").getByRole("link", { name: "How it works", exact: true }).click();
    await motionPage.waitForURL(base + "/how-it-works");
    await motionPage.mouse.move(300, 250);
    await motionPage.evaluate(() => window.scrollTo(0, 100));
    // Scroll parallax is shared by the marketing pages; reveals and pointer effects stay home-only.
    await motionPage.waitForFunction(() => document.querySelector(".apm-hero-photo").style.translate !== "");
    assert.equal(await motionPage.getByTestId("trail-rail").count(), 1);
    assert.equal(await motionPage.locator(".apm-hero").evaluate((el) => el.style.getPropertyValue("--mx")), "");
    await motionContext.close();

    const touchContext = await context({ reducedMotion: "no-preference", isMobile: true, hasTouch: true, viewport: { width: 375, height: 812 } });
    const touchPage = await touchContext.newPage();
    await touchPage.goto(base);
    await touchPage.mouse.move(200, 200);
    assert.equal(await touchPage.locator(".apm-hero").evaluate((el) => el.style.getPropertyValue("--mx")), "");
    await touchContext.close();
  });
  await ctx.close();
  console.log(`${checks} browser test groups passed. Screenshots: ${artifacts}`);
} finally {
  await browser.close();
}
