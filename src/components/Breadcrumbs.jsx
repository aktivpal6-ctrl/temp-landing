import Link from "next/link";
import { PUBLIC_PAGES } from "@/lib/seo";

// `current` names a page nested under `path`, such as a blog post under /blog.
export function Breadcrumbs({ path, current = null, className = "" }) {
  const { name } = PUBLIC_PAGES[path];
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link href="/" className="underline underline-offset-4">Home</Link></li>
        <li aria-hidden="true">/</li>
        {current ? <>
          <li><Link href={path} className="underline underline-offset-4">{name}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{current}</li>
        </> : <li aria-current="page">{name}</li>}
      </ol>
    </nav>
  );
}
