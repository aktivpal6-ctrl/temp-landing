"use client";

import { usePathname } from "next/navigation";

const PUBLIC_ROUTES = ["/", "/about", "/movement", "/waitlist", "/how-it-works", "/faq", "/blog"];

// Slots keep the footer and page content on the server while excluding admin UI.
export function SiteChrome({ header, footer, children }) {
  const pathname = usePathname();
  if (!PUBLIC_ROUTES.includes(pathname) && !pathname.startsWith("/blog/")) return children;
  return <>{header}{children}{footer}</>;
}
