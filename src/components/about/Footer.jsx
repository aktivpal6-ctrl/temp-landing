import { Footer as SharedFooter } from "@/components/Footer";

export const Footer = () => (
  <footer
    data-testid="about-footer"
    className="bg-[#0F291E] grain overflow-hidden"
  >
    <div className="border-t border-white/10">
      <SharedFooter variant="dark" />
    </div>
  </footer>
);
