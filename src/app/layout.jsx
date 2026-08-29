import "@/index.css";
import Script from "next/script";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "./providers";

const GA_ID = "G-CEH9SBXJSJ";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-outfit",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const metadata = {
  title: "AKTIVPAL — Movement is better together.",
  description:
    "AKTIVPAL — Movement is better together. The easiest way to find the right people to hike, run, ride, climb, ski and explore with in Canada.",
  metadataBase: new URL("https://www.aktivpal.com"),
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
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AKTIVPAL — Movement is better together.",
    description:
      "AKTIVPAL helps you find the right people to hike, run, ride, climb, ski and explore with in Canada. Join the movement.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport = {
  themeColor: "#0F291E",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.aktivpal.com/#organization",
  name: "AKTIVPAL",
  url: "https://www.aktivpal.com",
  logo: {
    "@type": "ImageObject",
    url: "https://www.aktivpal.com/images/aktivpal.png",
    width: 512,
    height: 512,
  },
  description:
    "AKTIVPAL helps you find people to hike, run, ski, climb, cycle, and explore with in Canada. Starting in British Columbia.",
  foundingDate: "2024",
  areaServed: {
    "@type": "Country",
    name: "Canada",
  },
  // TODO: Add more social media URLs once profiles are created.
  // Expected platforms: YouTube, Facebook, LinkedIn, TikTok
  sameAs: ["https://www.instagram.com/aktivpals/"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "hello@aktivpal.com",
    availableLanguage: "English",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AKTIVPAL",
  url: "https://www.aktivpal.com",
  inLanguage: "en-CA",
  publisher: {
    "@type": "Organization",
    "@id": "https://www.aktivpal.com/#organization",
  },
  // TODO: Add SearchAction if a search endpoint is implemented
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakarta.variable}`}>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
