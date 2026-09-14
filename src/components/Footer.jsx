import Link from "next/link";
import { Logo } from "@/components/primitives";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Movement", href: "/movement" },
  { label: "Waitlist", href: "/waitlist" },
];

export const Footer = ({ variant = "dark" }) => {
  const isDark = variant === "dark";

  return (
    <div className="relative z-10">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size={26} light={isDark} />
          {isDark && (
            <span className="text-sm text-[#F7F7F2]/50">
              &ldquo;Your people for movement.&rdquo;
            </span>
          )}
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap justify-center items-center gap-6 text-sm text-[#F7F7F2]/60">
          {FOOTER_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={
                isDark
                  ? "text-[#F7F7F2]/60 hover:text-[#FF5C00] transition-colors"
                  : "text-[#4A524A] hover:text-[#0F291E] transition-colors"
              }
              data-testid={`footer-link-${label.toLowerCase()}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <span
          className={
            isDark ? "text-sm text-[#F7F7F2]/40" : "text-sm text-[#4A524A]/60"
          }
        >
          &copy; {new Date().getFullYear()} AKTIVPAL
        </span>
      </div>
    </div>
  );
};
