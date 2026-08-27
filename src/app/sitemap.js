/** @type {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  const base = "https://www.aktivpal.com";

  /** @type {Array<{path: string, changeFrequency: 'always'|'hourly'|'daily'|'weekly'|'monthly'|'yearly'|'never', priority: number}>} */
  const routes = [
    { path: "", changeFrequency: "weekly", priority: 1.0 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/waitlist", changeFrequency: "weekly", priority: 0.8 },
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
