import assert from "node:assert/strict";
import test from "node:test";
import { canonicalUrl, PUBLIC_PAGES, pageMetadata, pageSchema } from "../src/lib/seo.js";
import { publicEvent } from "../src/lib/public-event.js";

test("canonical URLs consolidate tracking, fragments and trailing slashes", () => {
  assert.equal(canonicalUrl("/?utm_source=email"), "https://www.aktivpal.com/");
  assert.equal(canonicalUrl("/movement/?page=2#details"), "https://www.aktivpal.com/movement");
  assert.throws(() => canonicalUrl("https://example.com/movement"));
});

test("public pages have unique, concise metadata and consistent schema URLs", () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const [path, page] of Object.entries(PUBLIC_PAGES)) {
    assert.ok(page.title.length < 60, `${path}: title length`);
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
