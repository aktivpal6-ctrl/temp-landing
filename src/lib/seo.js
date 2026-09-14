export const SITE_URL = "https://www.aktivpal.com";
export const canonicalUrl = (path = "/") => new URL(path, `${SITE_URL}/`).href.replace(/\/$/, "");

export const PUBLIC_PAGES = {
  "/": {
    title: "Find People for Outdoor Activities Near You | AKTIVPAL",
    description: "Find people to hike, trail run, walk, camp, ski, kayak, swim and explore with. AKTIVPAL connects people through outdoor activities, starting in British Columbia.",
    name: "Home",
  },
  "/about": {
    title: "Our Story | Why We Built AKTIVPAL",
    description: "Read why AKTIVPAL began in British Columbia and how we are helping people find others for outdoor activities, shared adventures and real-world connection.",
    name: "Our Story",
  },
  "/movement": {
    title: "Outdoor Activities in British Columbia | AKTIVPAL",
    description: "Explore upcoming walks, hikes, trail runs and other outdoor activities in British Columbia. Check the location, pace and details, then find people to move with.",
    name: "Movement",
  },
  "/waitlist": {
    title: "Join the AKTIVPAL Early Access Waitlist",
    description: "Join AKTIVPAL early access in British Columbia and help shape a community for hiking, trail running, walking, camping, skiing, kayaking and swimming.",
    name: "Early Access",
  },
};

export function pageMetadata(path) {
  const { title, description } = PUBLIC_PAGES[path];
  const url = canonicalUrl(path);
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: {
      title, description, url, siteName: "AKTIVPAL", locale: "en_CA", type: "website",
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1024, height: 683, alt: "AKTIVPAL — find people for outdoor activities" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/og-image.png`] },
  };
}

export function pageSchema(path, type = "WebPage") {
  const page = PUBLIC_PAGES[path];
  const url = canonicalUrl(path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type, "@id": `${url}#webpage`, url, name: page.title,
        description: page.description, inLanguage: "en-CA",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        spatialCoverage: {
          "@type": "AdministrativeArea",
          name: "British Columbia, Canada",
        },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl() },
          ...(path === "/" ? [] : [{ "@type": "ListItem", position: 2, name: page.name, item: url }]),
        ],
      },
    ],
  };
}
