import "@/index.css";
import Script from "next/script";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "./providers";
import { SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

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
  metadataBase: new URL(SITE_URL),
  title: "AKTIVPAL | Outdoor Activities in British Columbia",
  description: "Find people for outdoor activities with AKTIVPAL, starting in British Columbia.",
  icons: { icon: "/favicon.ico" },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport = {
  themeColor: "#0F291E",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "AKTIVPAL",
  url: `${SITE_URL}/`,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.svg`,
  },
  description:
    "AKTIVPAL helps people find others to hike, trek, trail run, walk, camp, ski, kayak, swim and explore with, starting in British Columbia.",
  areaServed: {
    "@type": "AdministrativeArea",
    name: "British Columbia, Canada",
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
  "@id": `${SITE_URL}/#website`,
  name: "AKTIVPAL",
  alternateName: "AktivPal",
  url: `${SITE_URL}/`,
  inLanguage: "en-CA",
  publisher: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
  },
  // TODO: Add SearchAction if a search endpoint is implemented
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-CA" className={`${outfit.variable} ${plusJakarta.variable}`}>
      <head>
        {process.env.AKTIVPAL_TEST_MODE !== "1" && <>
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
        </>}
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <noscript>
          <style>{`
            main [style*="opacity:0"], main [style*="opacity: 0"],
            main .ap-reveal, main .ap-reveal-right, main .ap-stagger-item,
            main .ap-hero-reveal, main [style*="translateY(110%)"] {
              opacity: 1 !important;
              transform: none !important;
              animation: none !important;
            }
          `}</style>
        </noscript>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
