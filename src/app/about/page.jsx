import { AboutPage } from "@/views/AboutPage";

export const metadata = {
  title: "About — AKTIVPAL",
  description:
    "Learn about AKTIVPAL — why we exist, the problem we're solving, and our mission to help you find the right people to move with.",
  openGraph: {
    title: "About — AKTIVPAL",
    description:
      "Learn about AKTIVPAL — why we exist, the problem we're solving, and our mission to help you find the right people to move with.",
    url: "https://www.aktivpal.com/about",
    siteName: "AKTIVPAL",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About AKTIVPAL",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — AKTIVPAL",
    description:
      "Learn about AKTIVPAL — why we exist, the problem we're solving, and our mission to help you find the right people to move with.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.aktivpal.com/about",
  },
};

export default function Page() {
  return <AboutPage />;
}
