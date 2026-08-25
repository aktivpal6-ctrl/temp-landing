import { LandingPage } from "@/views/LandingPage";

export const metadata = {
  title: "AKTIVPAL — Movement is better together.",
  description:
    "AKTIVPAL helps you find the right people to hike, run, ride, climb, ski and explore with in Canada. Join the movement.",
  openGraph: {
    title: "AKTIVPAL — Movement is better together.",
    description:
      "AKTIVPAL helps you find the right people to hike, run, ride, climb, ski and explore with in Canada.",
    url: "https://www.aktivpal.com",
    siteName: "AKTIVPAL",
    type: "website",
  },
  alternates: {
    canonical: "https://www.aktivpal.com",
  },
};

export default function Page() {
  return <LandingPage />;
}
