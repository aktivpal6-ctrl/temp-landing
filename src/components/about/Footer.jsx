import Link from "next/link";
import { Logo } from "@/components/primitives";

export const Footer = () => (
  <footer
    data-testid="about-footer"
    className="border-t border-[#0F291E]/10 bg-[#F7F7F2] py-12 md:py-16"
  >
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
      <Logo size={32} />
      <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-[#4A524A]">
        <Link href="/" className="transition-colors hover:text-[#0F291E]">
          Home
        </Link>
        <Link
          href="/about"
          className="transition-colors hover:text-[#0F291E]"
        >
          Our Story
        </Link>
        <Link
          href="/waitlist"
          className="transition-colors hover:text-[#0F291E]"
        >
          Join the Waitlist
        </Link>
      </nav>
      <p className="text-xs text-[#4A524A]/60">
        &copy; {new Date().getFullYear()} AKTIVPAL. Made in Canada.
      </p>
    </div>
  </footer>
);
