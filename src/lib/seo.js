import { eventEndTime, eventPath, formatEventTime, isPastEvent } from "./public-event.js";
import { blogPath } from "./blog.js";

export const SITE_URL = "https://www.aktivpal.com";
export function canonicalUrl(path = "/") {
  const url = new URL(path, `${SITE_URL}/`);
  if (url.origin !== SITE_URL)
    throw new Error("Canonical URLs must belong to AKTIVPAL");
  url.search = "";
  url.hash = "";
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  return url.href;
}

export const PUBLIC_PAGES = {
  "/": {
    title: "Find People for Outdoor Activities Near You | AKTIVPAL",
    description:
      "Find people for hikes, walks, trail runs and more with AKTIVPAL. Explore outdoor activities and join early access, starting in British Columbia.",
    name: "Home",
  },
  "/how-it-works": {
    title:
      "How AKTIVPAL Works: Find People, Join or Host a Movement | AKTIVPAL",
    description:
      "See how AKTIVPAL works: discover outdoor Movements near you, join or host a plan, meet up and keep the connection. Starting in British Columbia.",
    name: "How it works",
  },
  "/faq": {
    title: "Frequently Asked Questions | AKTIVPAL",
    description:
      "Answers to common questions about AKTIVPAL, Movements, outdoor activities, safety and early access, starting in British Columbia.",
    name: "FAQ",
  },
  "/about": {
    title: "Our Story | Why We Built AKTIVPAL",
    description:
      "Read why AKTIVPAL began in British Columbia and how we are helping people find others for outdoor activities, shared adventures and real-world connection.",
    name: "Our Story",
  },
  "/movement": {
    title: "Outdoor Activities in British Columbia | AKTIVPAL",
    description:
      "Explore outdoor activities in British Columbia with AKTIVPAL. Check each walk, hike or trail run for its location, pace and meeting details.",
    name: "Movement",
  },
  "/waitlist": {
    title: "Join the AKTIVPAL Early Access Waitlist",
    description:
      "Join AKTIVPAL early access in British Columbia and help shape a community for hiking, trail running, walking, camping, skiing, kayaking and swimming.",
    name: "Early Access",
  },
  "/blog": {
    title: "Outdoor Guides and Stories from BC | AKTIVPAL Blog",
    description:
      "Trail guides, safety tips and stories about hiking, walking and trail running with other people in British Columbia, from the AKTIVPAL team.",
    name: "Blog",
  },
};

const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: 1024,
  height: 683,
  alt: "AKTIVPAL — find people for outdoor activities",
};

export function pageMetadata(path) {
  const { title, description } = PUBLIC_PAGES[path];
  const url = canonicalUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "AKTIVPAL",
      locale: "en_CA",
      type: "website",
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

export function pageSchema(path, type = "WebPage") {
  const page = PUBLIC_PAGES[path];
  const url = canonicalUrl(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: "en-CA",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        spatialCoverage: {
          "@type": "AdministrativeArea",
          name: "British Columbia, Canada",
        },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: canonicalUrl(),
          },
          ...(path === "/"
            ? []
            : [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: page.name,
                  item: url,
                },
              ]),
        ],
      },
    ],
  };
}

// Collapses whitespace and cuts at a word boundary so the result fits in `max` characters.
function clip(text, max) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

// Event pages are generated from the database, so their title and description lead
// with what a searcher or a shared link preview needs: what, when and where.
export function eventMetadata(event, now = new Date()) {
  const url = canonicalUrl(eventPath(event));
  const branded = `${event.title} | AKTIVPAL`;
  const title = branded.length <= 60 ? branded : event.title;
  const description = clip(`${formatEventTime(event.start_time, "short")} at ${event.location}. ${event.description}`, 155);
  return {
    title: { absolute: title }, description,
    alternates: { canonical: url },
    // Images come from the route's opengraph-image, and Twitter inherits them.
    openGraph: { title, description, url, siteName: "AKTIVPAL", locale: "en_CA", type: "website" },
    twitter: { card: "summary_large_image", title, description },
    // Finished activities stay reachable for people who have the link, but out of search.
    ...(isPastEvent(event, now) && { robots: { index: false, follow: true } }),
  };
}

export function eventSchema(event) {
  const url = canonicalUrl(eventPath(event));
  const end = eventEndTime(event);
  const images = event.images.filter((src) => /^https?:\/\//.test(src));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage", "@id": `${url}#webpage`, url, name: event.title,
        description: clip(event.description, 300), inLanguage: "en-CA",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: { "@id": `${url}#event` },
      },
      {
        "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl() },
          { "@type": "ListItem", position: 2, name: PUBLIC_PAGES["/movement"].name, item: canonicalUrl("/movement") },
          { "@type": "ListItem", position: 3, name: event.title, item: url },
        ],
      },
      {
        "@type": "Event", "@id": `${url}#event`, url, name: event.title,
        description: event.description, inLanguage: "en-CA",
        startDate: event.start_time,
        ...(end && { endDate: end.toISOString() }),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place", name: event.location,
          address: { "@type": "PostalAddress", streetAddress: event.location, addressRegion: "BC", addressCountry: "CA" },
          ...(event.location_link && { hasMap: event.location_link }),
        },
        image: images.length ? images : [`${SITE_URL}/og-image.png`],
        organizer: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "AKTIVPAL", url: `${SITE_URL}/` },
      },
    ],
  };
}

export function blogPostMetadata(post) {
  const url = canonicalUrl(blogPath(post));
  const branded = `${post.title} | AKTIVPAL`;
  const title = branded.length <= 60 ? branded : post.title;
  const description = clip(post.excerpt, 155);
  const image = post.image_url
    ? { url: post.image_url, alt: post.image_alt }
    : DEFAULT_OG_IMAGE;
  return {
    title,
    description,
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "AKTIVPAL",
      locale: "en_CA",
      type: "article",
      publishedTime: post.published_at,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export function blogPostSchema(post) {
  const url = canonicalUrl(blogPath(post));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: post.title,
        description: post.excerpt,
        inLanguage: "en-CA",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: { "@id": `${url}#article` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl() },
          { "@type": "ListItem", position: 2, name: PUBLIC_PAGES["/blog"].name, item: canonicalUrl("/blog") },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        url,
        headline: clip(post.title, 110),
        description: post.excerpt,
        inLanguage: "en-CA",
        datePublished: post.published_at,
        dateModified: post.updatedAt || post.published_at,
        author: { "@type": "Person", name: post.author },
        publisher: { "@id": `${SITE_URL}/#organization` },
        image: [post.image_url || DEFAULT_OG_IMAGE.url],
        mainEntityOfPage: { "@id": `${url}#webpage` },
        isPartOf: {
          "@type": "Blog",
          "@id": `${canonicalUrl("/blog")}#blog`,
          name: "AKTIVPAL Blog",
          url: canonicalUrl("/blog"),
        },
      },
    ],
  };
}

// Next 16 writes sitemap values into the XML verbatim, so any URL that can contain
// &, <, >, " or ' (such as an admin-entered image URL with a query string) must be
// escaped first or the whole sitemap becomes unparseable.
export function escapeXml(text) {
  return String(text).replace(/[&<>"']/g, (char) => `&${{ "&": "amp", "<": "lt", ">": "gt", '"': "quot", "'": "apos" }[char]};`);
}
