// app/sitemap.js
export default function sitemap() {
  return [
    {
      url: "https://www.aktivpal.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // add /about, /community, /safety, /contact here as each one goes live
  ];
}
