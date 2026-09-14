export const SITE_URL = "https://www.aktivpal.com";
export const canonicalUrl = (path = "/") => new URL(path, `${SITE_URL}/`).href.replace(/\/$/, "");

export const PUBLIC_PAGES = {
  "/": {
    title: "AKTIVPAL | Find Activity Partners in Canada",
    description: "Find people to hike, run, cycle, climb and ski with in Canada. AKTIVPAL is building an outdoor community, starting in British Columbia. Join early access.",
    name: "Home",
  },
  "/about": {
    title: "Our Story | AKTIVPAL Outdoor Community in Canada",
    description: "Discover why AKTIVPAL is building a Canadian outdoor community, starting in British Columbia, to help people connect through shared activities and real plans.",
    name: "Our Story",
  },
  "/movement": {
    title: "Outdoor Activities in British Columbia, Canada | AKTIVPAL",
    description: "Explore AKTIVPAL walks, hikes and runs in British Columbia, Canada. Check upcoming activities, meeting locations and event details, and find people to move with.",
    name: "Movement",
  },
  "/waitlist": {
    title: "Join the Canada Early Access Waitlist | AKTIVPAL",
    description: "Join the AKTIVPAL early access waitlist in Canada. Help shape a community for hiking, running, cycling, climbing and skiing, starting in British Columbia.",
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
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1024, height: 683, alt: "AKTIVPAL — Find activity partners in Canada" }],
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
        spatialCoverage: { "@type": "Country", name: "Canada" },
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
