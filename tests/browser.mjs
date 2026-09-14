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
const routes = ["/", "/about", "/movement", "/waitlist"];
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
      const canonical = "https://www.aktivpal.com" + (path === "/" ? "" : path);
      assert.ok(html.includes('lang="en-CA"'));
      assert.ok(html.includes(`rel="canonical" href="${canonical}"`));
      assert.ok(html.includes(`property="og:url" content="${canonical}"`));
      assert.ok(html.includes('property="og:locale" content="en_CA"'));
      assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
      assert.ok(!html.includes("googletagmanager.com"), "Analytics disabled for tests");
      titles.add(html.match(/<title>(.*?)<\/title>/)[1]);
      const data = schemas(html);
      assert.ok(data.some((item) => item["@type"] === "Organization" && item.areaServed.name === "British Columbia, Canada"));
      assert.ok(data.some((item) => item["@id"] === canonical + "#webpage" && item.isPartOf["@id"].endsWith("/#website")));
      assert.ok(data.some((item) => item["@type"] === "BreadcrumbList"));
    }
    assert.equal(titles.size, 4);
    const html = await (await fetch(base + "/movement?event=test&utm_source=test")).text();
    assert.ok(html.includes('rel="canonical" href="https://www.aktivpal.com/movement"'));
    assert.ok(html.includes("Upcoming activities in British Columbia"));
  });

  await check("sitemap, robots, private route indexing and canonical redirects", async () => {
    const xml = await (await fetch(base + "/sitemap.xml")).text();
    const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    assert.deepEqual(locations.sort(), routes.map((path) => "https://www.aktivpal.com" + (path === "/" ? "" : path)).sort());
    const lastModified = [...xml.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map((m) => m[1]);
    assert.equal(lastModified.length, routes.length);
    assert.ok(lastModified.every((value) => !Number.isNaN(Date.parse(value))));
    const robots = await (await fetch(base + "/robots.txt")).text();
    assert.ok(robots.includes("Allow: /"));
    assert.ok(robots.includes("Disallow: /api/"));
    assert.ok(robots.includes("Sitemap: https://www.aktivpal.com/sitemap.xml"));
    assert.ok(!robots.includes("Disallow: /admin") && !robots.includes("Disallow: /login"));
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
  });

  await check("no-JavaScript content, native FAQs and crawlable internal links", async () => {
    const ctx = await context({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(base);
    assert.ok(await page.getByRole("heading", { name: "Find your people. Then get moving." }).isVisible());
    const html = await (await fetch(base)).text();
    const faq = schemas(html).find((item) => item["@type"] === "FAQPage");
    for (const question of faq.mainEntity) {
      const details = page.locator("details").filter({ hasText: question.name });
      await details.locator("summary").click();
      assert.equal(await details.locator("p").innerText(), question.acceptedAnswer.text);
      assert.ok(await details.locator("p").isVisible());
    }
    for (const path of routes.slice(1)) assert.ok(await page.locator(`a[href="${path}"]`).count());
    await page.goto(base + "/movement");
    assert.ok(await page.getByRole("heading", { name: "Upcoming activities in British Columbia" }).isVisible());
    await ctx.close();
  });

  const ctx = await context();
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await check("desktop navigation contrast, keyboard focus and route links", async () => {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const path of ["/", "/about", "/movement"]) {
      await page.goto(base + path);
      for (const scroll of [0, 1000]) {
        await page.evaluate((y) => window.scrollTo(0, y), scroll);
        await page.waitForFunction((expected) => document.querySelector("[data-testid=site-nav]").dataset.theme === expected, scroll ? "light" : "dark");
        const palette = await page.getByTestId("site-nav").evaluate((header) => ({
          background: getComputedStyle(header).backgroundColor,
          text: getComputedStyle(header).color,
          logo: header.querySelector("svg path").getAttribute("fill"),
        }));
        assert.deepEqual(palette, scroll
          ? { background: "rgb(247, 247, 242)", text: "rgb(15, 41, 30)", logo: "#0F291E" }
          : { background: "rgb(15, 41, 30)", text: "rgb(247, 247, 242)", logo: "#F7F7F2" });
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
    await page.getByTestId("site-nav").getByRole("link", { name: "Our Story" }).click();
    await page.waitForURL(base + "/about");
    assert.equal(await page.getByTestId("site-nav").getByRole("link", { name: "Our Story" }).getAttribute("aria-current"), "page");
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
    await dialog.getByRole("link", { name: "Our Story" }).click();
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
    await page.setViewportSize({ width: 768, height: 700 });
    await waitFor(page, () => !document.querySelector("dialog").open && document.body.style.overflow !== "hidden");
    assert.ok(await page.getByTestId("nav-cta").evaluate((el) => el === document.activeElement));
    await page.setViewportSize({ width: 767, height: 600 });
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
  await ctx.close();
  console.log(`${checks} browser test groups passed. Screenshots: ${artifacts}`);
} finally {
  await browser.close();
}
