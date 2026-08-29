"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/primitives";
import { scrollToWaitlist } from "@/components/primitives";

const NAV_LINKS = [
  { label: "Our Story", href: "/about" },
  { label: "Movement", href: "/movement" },
];

export const Nav = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isHome = pathname === "/";
  const light = true;

  return (
    <>
      <motion.header
        data-testid="site-nav"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-5 md:py-4">
          <Link href="/" className="inline-flex items-center gap-3" data-testid="nav-logo-link">
            <Logo size={34} light={light} showWord />
          </Link>

          <div className="hidden md:flex items-center gap-5" data-testid="nav-desktop-right">
            <nav className="flex items-center gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className={`relative px-3 py-1.5 text-sm font-semibold transition-colors after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:w-0 after:bg-[#FF5C00] after:transition-all after:duration-300 hover:after:w-[calc(100%-1.5rem)] ${
                    pathname === href
                      ? "text-[#FF5C00] after:w-[calc(100%-1.5rem)]"
                      : "text-[#F7F7F2]/70 hover:text-[#FF5C00]"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#F7F7F2]/60">
              <MapPin className="h-3.5 w-3.5 text-[#FF5C00]" /> Canada
            </span>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={scrollToWaitlist}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF5C00] text-white font-display font-bold px-5 py-2 text-sm hover:bg-[#e64f00] transition-colors"
              data-testid="nav-cta"
            >
              Join <ArrowRight size={16} />
            </motion.button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative z-50 p-2 text-[#F7F7F2]"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            data-testid="nav-mobile-toggle"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#0F291E]/98 backdrop-blur-xl md:hidden"
            data-testid="mobile-nav-overlay"
          >
            <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-6">
              <Logo size={52} light showWord />

              <nav className="flex flex-col items-center gap-2 mt-8">
                {NAV_LINKS.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className={`font-display text-3xl font-bold tracking-tight transition-colors ${
                      pathname === href
                        ? "text-[#FF5C00]"
                        : "text-[#F7F7F2]/70 hover:text-[#F7F7F2]"
                    }`}
                    data-testid={`mobile-nav-link-${label.toLowerCase()}`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col items-center gap-4 mt-8">
                <span className="inline-flex items-center gap-1.5 text-sm text-[#F7F7F2]/50">
                  <MapPin className="h-4 w-4 text-[#FF5C00]" /> Starting in British Columbia
                </span>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={scrollToWaitlist}
                  className="inline-flex items-center gap-2 rounded-full bg-[#FF5C00] text-white font-display font-bold px-8 py-4 text-base hover:bg-[#e64f00] transition-colors"
                  data-testid="mobile-nav-cta"
                >
                  JOIN THE MOVEMENT <ArrowRight size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
