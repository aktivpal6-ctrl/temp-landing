/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  async headers() {
    return [
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/login", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/search/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }] },
      // Query variants keep their clean canonical and cannot be indexed separately.
      ...["q", "search", "sort", "filter", "category", "activity", "location", "difficulty", "event"].map((key) => ({
        source: "/:page(about|movement|waitlist)?",
        has: [{ type: "query", key }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      })),
      {
        source: "/:page(about|movement|waitlist)?",
        has: [{ type: "query", key: "page", value: "(?:0*[2-9]|0*[1-9][0-9]+)" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "aktivpal.com",
          },
        ],
        destination: "https://www.aktivpal.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.aktivpal.com",
          },
          {
            type: "header",
            key: "x-forwarded-proto",
            value: "http",
          },
        ],
        destination: "https://www.aktivpal.com/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
