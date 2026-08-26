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

export default function Page() {
  return <LandingPage />;
}
