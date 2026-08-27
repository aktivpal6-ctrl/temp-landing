import { Reveal, MaskedLines, CTA } from "@/components/primitives";

export { Reveal, MaskedLines, CTA };

export const Kicker = ({ children }) => (
  <span className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.22em] text-[#FF5C00]">
    {children}
    <span className="h-[2px] w-8 bg-[#FF5C00]/40" />
  </span>
);
