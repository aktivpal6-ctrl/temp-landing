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

export default function Page() {
  return <WaitlistPage />;
}
