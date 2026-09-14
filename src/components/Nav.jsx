"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/primitives";

const NAV_LINKS = [
  { label: "Our Story", href: "/about" },
  { label: "Movement", href: "/movement" },
];
const CTA_CLASS = "inline-flex items-center gap-2 rounded-full bg-[#FF5C00] text-[#0F291E] font-display font-bold px-5 py-3 text-sm hover:bg-[#ff7b33] transition-colors";

export const Nav = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dialogRef = useRef(null);
  const toggleRef = useRef(null);
  const desktopCtaRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => {
    dialogRef.current?.close();
    setMobileOpen(false);
  };

  const keepFocusInMenu = (event) => {
    if (event.key !== "Tab") return;
    const focusable = [...event.currentTarget.querySelectorAll("button, a[href]")]
      .filter((element) => !element.hasAttribute("disabled"));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  useEffect(closeMenu, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = () => {
      if (desktop.matches && dialogRef.current?.open) {
        closeMenu();
        desktopCtaRef.current?.focus();
      }
    };
    desktop.addEventListener("change", onResize);
    return () => desktop.removeEventListener("change", onResize);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <>
      <header data-testid="site-nav" data-theme={scrolled ? "light" : "dark"}
        className="site-navigation fixed top-0 inset-x-0 z-[60] isolate border-b shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-5 md:py-4">
          <Link href="/" aria-label="AKTIVPAL home" className="inline-flex items-center gap-3 rounded" data-testid="nav-logo-link">
            <Logo size={34} light={!scrolled} showWord />
          </Link>
          <div className="hidden md:flex items-center gap-5" data-testid="nav-desktop-right">
            <nav aria-label="Main navigation" className="flex items-center gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}
                  className="site-navigation-link rounded px-3 py-3 text-sm font-semibold">
                  {label}
                </Link>
              ))}
            </nav>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
              <MapPin aria-hidden="true" className="site-navigation-accent h-3.5 w-3.5" /> Canada
            </span>
            <Link ref={desktopCtaRef} href="/waitlist" className={CTA_CLASS} data-testid="nav-cta">
              Join <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <button ref={toggleRef} type="button" onClick={() => setMobileOpen(true)}
            className="md:hidden rounded p-3" aria-label="Open menu"
            aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-haspopup="dialog"
            data-testid="nav-mobile-toggle">
            <Menu aria-hidden="true" size={24} />
          </button>
        </div>
      </header>

      <dialog ref={dialogRef} id="mobile-navigation" aria-label="Main navigation"
        onClose={() => setMobileOpen(false)}
        onKeyDown={keepFocusInMenu}
        onClick={(event) => { if (event.target === event.currentTarget) closeMenu(); }}
        data-lenis-prevent
        data-theme="dark"
        className="site-navigation fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none overflow-y-auto border-0 p-6 backdrop:bg-[#0F291E]"
        data-testid="mobile-nav-overlay">
        <div className="pointer-events-none flex min-h-full flex-col items-center justify-center gap-8 py-20">
          <button type="button" autoFocus onClick={closeMenu} aria-label="Close menu"
            className="pointer-events-auto absolute right-4 top-3 rounded p-3">
            <X aria-hidden="true" size={24} />
          </button>
          <Link href="/" onClick={closeMenu} aria-label="AKTIVPAL home" className="pointer-events-auto rounded">
            <Logo size={52} light showWord />
          </Link>
          <nav aria-label="Mobile navigation" className="pointer-events-auto flex flex-col items-center gap-4">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} onClick={closeMenu} aria-current={pathname === href ? "page" : undefined}
                className="site-navigation-link rounded px-3 py-2 font-display text-3xl font-bold"
                data-testid={`mobile-nav-link-${label.toLowerCase()}`}>
                {label}
              </Link>
            ))}
          </nav>
          <span className="inline-flex items-center gap-1.5 text-sm">
            <MapPin aria-hidden="true" className="site-navigation-accent h-4 w-4" /> Starting in British Columbia
          </span>
          <Link href="/waitlist" onClick={closeMenu} className={`pointer-events-auto ${CTA_CLASS}`} data-testid="mobile-nav-cta">
            JOIN THE MOVEMENT <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </dialog>
    </>
  );
};
