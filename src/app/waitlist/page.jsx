import { WaitlistPage } from "@/views/WaitlistPage";

export const metadata = {
  title: "AKTIVPAL Early Access — Join the Waitlist",
  description:
    "Sign up for early access to AKTIVPAL. Be one of the first to find activity partners in Canada.",
  openGraph: {
    title: "AKTIVPAL Early Access — Join the Waitlist",
    description:
      "Sign up for early access to AKTIVPAL. Be one of the first to find activity partners in Canada.",
    url: "https://www.aktivpal.com/waitlist",
    siteName: "AKTIVPAL",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AKTIVPAL — Join the Waitlist",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AKTIVPAL Early Access — Join the Waitlist",
    description:
      "Sign up for early access to AKTIVPAL. Be one of the first to find activity partners in Canada.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.aktivpal.com/waitlist",
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "AKTIVPAL Early Access — Join the Waitlist",
  description:
    "Sign up for early access to AKTIVPAL. Be one of the first to find activity partners in Canada.",
  url: "https://www.aktivpal.com/waitlist",
  inLanguage: "en-CA",
  isPartOf: {
    "@type": "Organization",
    name: "AKTIVPAL",
    url: "https://www.aktivpal.com",
  },
};

const breadcrumbsSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.aktivpal.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Waitlist",
      item: "https://www.aktivpal.com/waitlist",
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <WaitlistPage />
    </>
  );
}
