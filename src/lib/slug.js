// Lowercase, hyphenated and ASCII-only, cut at a word boundary: "Café & Trail Run" -> "cafe-and-trail-run".
export function slugify(text, maxLength = 80) {
  const slug = String(text || "")
    .normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/&/g, " and ").replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug.length <= maxLength ? slug : slug.slice(0, maxLength + 1).replace(/-[^-]*$/, "");
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
