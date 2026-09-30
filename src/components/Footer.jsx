import Link from "next/link";
// Instagram is a deprecated lucide brand icon; it ships in the pinned 0.516.0 but not in lucide v1.
import { Instagram } from "lucide-react";
import { Logo } from "@/components/Logo";

// Description and Instagram are the same facts published in the
// Organization schema in app/layout.jsx; keep them in step if either changes.
const DESCRIPTION = "AKTIVPAL helps people find others for hikes, walks, trail runs and other outdoor activities, starting in British Columbia.";
const INSTAGRAM = "https://www.instagram.com/aktivpals/";

const FOOTER_GROUPS = [
  { title: "Explore", links: [
    { label: "Home", href: "/" },
    { label: "How it works", href: "/how-it-works" },
    { label: "Movement", href: "/movement" },
    { label: "Blog", href: "/blog" },
    { label: "Waitlist", href: "/waitlist" },
  ] },
  { title: "Company", links: [
    { label: "About", href: "/about" },
    { label: "Trust and safety", href: "/#trust" },
    { label: "FAQ", href: "/faq" },
  ] },
];

// Standalone panel on pages without a final call to action; directly after one,
// marketing.css joins the two into a single closing panel.
export const Footer = () => (
  <footer className="marketing-chrome apm-foot" data-testid="footer">
    <div className="apm-wrap apm-foot-inner">
      <div className="apm-foot-brand">
        <Link href="/" aria-label="AKTIVPAL home" className="apm-brand"><Logo size={30} light showWord /></Link>
        <p className="apm-foot-tagline">Your people for movement.</p>
        <p className="apm-foot-desc">{DESCRIPTION}</p>
        <div className="apm-foot-pills">
          <a className="apm-foot-pill" href={INSTAGRAM} rel="noopener"><Instagram size={16} aria-hidden="true" />Instagram</a>
        </div>
      </div>
      <nav aria-label="Footer navigation" className="apm-foot-cols">
        {FOOTER_GROUPS.map(({ title, links }) => (
          <div key={title} className="apm-foot-col">
            <h2 className="apm-foot-head">{title}</h2>
            <ul>
              {links.map(({ label, href }) => (
                <li key={href}><Link href={href} data-testid={`footer-link-${label.toLowerCase().replaceAll(" ", "-")}`}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <small className="apm-foot-legal">&copy; {new Date().getFullYear()} AKTIVPAL</small>
    </div>
  </footer>
);
