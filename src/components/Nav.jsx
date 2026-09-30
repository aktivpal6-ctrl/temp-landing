"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";

const NAV_LINKS = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Our story", href: "/about" },
  { label: "Movement", href: "/movement" },
  { label: "Blog", href: "/blog" },
];
const CTA_CLASS = "apm-btn apm-btn--primary apm-btn--sm";

export const Nav = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const dialogRef = useRef(null);
  const toggleRef = useRef(null);
  const desktopCtaRef = useRef(null);

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
    const desktop = window.matchMedia("(min-width: 1000px)");
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
      <a className="marketing-chrome apm-skip" href="#main-content">Skip to content</a>
      <header data-testid="site-nav" data-theme="light"
        className="marketing-chrome apm-site-header">
        <div className="apm-wrap apm-bar">
          <Link href="/" aria-label="AKTIVPAL home" className="apm-brand" data-testid="nav-logo-link">
            <Logo size={30} showWord />
          </Link>
          <div className="apm-desktop" data-testid="nav-desktop-right">
            <nav aria-label="Main navigation" className="apm-nav">
              {NAV_LINKS.map(({ label, href }) => (
                <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}
                  className="apm-nav-link">
                  {label}
                </Link>
              ))}
            </nav>
            <Link ref={desktopCtaRef} href="/waitlist" className={CTA_CLASS} data-testid="nav-cta">
              Join early access
            </Link>
          </div>
          <div className="apm-mobile-actions">
          <Link href="/waitlist" className={CTA_CLASS} aria-label="Join early access">Join<span className="apm-long">&nbsp;early access</span></Link>
          <button ref={toggleRef} type="button" onClick={() => setMobileOpen(true)}
            className="apm-menu-toggle" aria-label="Open menu"
            aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-haspopup="dialog"
            data-testid="nav-mobile-toggle">
            <Menu aria-hidden="true" size={22} />
          </button>
          </div>
        </div>
      </header>

      <dialog ref={dialogRef} id="mobile-navigation" aria-label="Main navigation"
        onClose={() => setMobileOpen(false)}
        onKeyDown={keepFocusInMenu}
        onClick={(event) => { if (event.target === event.currentTarget) closeMenu(); }}
        data-lenis-prevent
        data-theme="light"
        className="marketing-chrome apm-mobile-dialog"
        data-testid="mobile-nav-overlay">
        <div className="pointer-events-none flex min-h-full flex-col items-center justify-center gap-8 py-20">
          <button type="button" autoFocus onClick={closeMenu} aria-label="Close menu"
            className="pointer-events-auto absolute right-4 top-3 rounded p-3 min-h-11 min-w-11">
            <X aria-hidden="true" size={24} />
          </button>
          <Link href="/" onClick={closeMenu} aria-label="AKTIVPAL home" className="pointer-events-auto rounded">
            <Logo size={52} showWord />
          </Link>
          <nav aria-label="Mobile navigation" className="pointer-events-auto flex flex-col items-center gap-4">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} onClick={closeMenu} aria-current={pathname === href ? "page" : undefined}
                className="apm-mobile-link"
                data-testid={`mobile-nav-link-${label.toLowerCase()}`}>
                {label}
              </Link>
            ))}
          </nav>
          <Link href="/waitlist" onClick={closeMenu} className={`pointer-events-auto ${CTA_CLASS}`} data-testid="mobile-nav-cta">
            Join early access
          </Link>
        </div>
      </dialog>
    </>
  );
};
