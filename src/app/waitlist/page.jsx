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
    type: "website",
  },
  alternates: {
    canonical: "https://www.aktivpal.com/waitlist",
  },
};

export default function Page() {
  return <WaitlistPage />;
}
