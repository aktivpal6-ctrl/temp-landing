import Link from "next/link";
import { PUBLIC_PAGES } from "@/lib/seo";

export function Breadcrumbs({ path, className = "" }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link href="/" className="underline underline-offset-4">Home</Link></li>
        <li aria-hidden="true">/</li>
        <li aria-current="page">{PUBLIC_PAGES[path].name}</li>
      </ol>
    </nav>
  );
}
