import "@/index.css";
import Script from "next/script";
import { Providers } from "./providers";

const GA_ID = "G-CEH9SBXJSJ";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.consentmanager.net/delivery/autoblocking/56ad0c0c62a2c.js"
          data-cmp-ab="1"
          data-cmp-host="b.delivery.consentmanager.net"
          data-cmp-cdn="cdn.consentmanager.net"
          data-cmp-codesrc="16"
          strategy="beforeInteractive"
        />
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "AKTIVPAL",
              url: "https://www.aktivpal.com",
              logo: "https://www.aktivpal.com/images/aktivpal.png",
              description:
                "AKTIVPAL helps you find people to hike, run, ski, climb, and explore with in Canada.",
              sameAs: [],
            }),
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
