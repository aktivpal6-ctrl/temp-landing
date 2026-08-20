// app/sitemap.js
export default function sitemap() {
  const base = "https://www.aktivpal.com";
  const routes = ["", "/about", "/community", "/safety", "/contact"];
  return routes.map(path => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
