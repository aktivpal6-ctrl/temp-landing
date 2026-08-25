import "@/index.css";
import { Providers } from "./providers";

export const metadata = {
  title: "AKTIVPAL — Movement is better together.",
  description:
    "AKTIVPAL — Find your people. Move together. The easiest way to find the right people to hike, run, ride, climb, ski and explore with in Canada.",
};

export const viewport = {
  themeColor: "#0F291E",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
              description:
                "AKTIVPAL helps you find people to hike, run, ski, climb, and explore with in Canada.",
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
