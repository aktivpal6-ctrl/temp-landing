import { LandingPage } from "@/views/LandingPage";

export const metadata = {
  title: "AKTIVPAL — Movement is better together.",
  description:
    "AKTIVPAL helps you find the right people to hike, run, ride, climb, ski and explore with in Canada. Join the movement.",
  openGraph: {
    title: "AKTIVPAL — Movement is better together.",
    description:
      "AKTIVPAL helps you find the right people to hike, run, ride, climb, ski and explore with in Canada. Join the movement.",
    url: "https://www.aktivpal.com",
    siteName: "AKTIVPAL",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AKTIVPAL — Movement is better together.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AKTIVPAL — Movement is better together.",
    description:
      "AKTIVPAL helps you find the right people to hike, run, ride, climb, ski and explore with in Canada. Join the movement.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.aktivpal.com",
  },
};

const FAQS = [
  {
    question: "What is AKTIVPAL?",
    answer:
      "AKTIVPAL helps you find the right people to move with. Whether you're new to a place, struggling to make friends as an adult, or simply don't have anyone who's up for your next hike, run, ski day, or adventure, we make it easier to connect, make plans, and get moving together.",
  },
  {
    question: "Is it safe to meet someone through AKTIVPAL?",
    answer:
      "You'll see who you're meeting before you go — profiles, activity history, and reviews from other members. Unlike dating apps, everyone's here for the same reason: to actually do something.",
  },
  {
    question: "What activities can I do on AKTIVPAL?",
    answer:
      "Hiking, running, skiing and snowboarding, cycling, climbing, outdoor-walking — and many more! We're expanding from there.",
  },
  {
    question: "Where is AKTIVPAL available?",
    answer: "British Columbia right now. We're expanding from there.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "AKTIVPAL — Movement is better together.",
  description:
    "AKTIVPAL helps you find the right people to hike, run, ride, climb, ski and explore with in Canada. Join the movement.",
  url: "https://www.aktivpal.com",
  inLanguage: "en-CA",
  isPartOf: {
    "@type": "Organization",
    name: "AKTIVPAL",
    url: "https://www.aktivpal.com",
  },
  about: {
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
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <LandingPage />
    </>
  );
}
