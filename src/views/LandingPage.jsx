"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  Hero,
  Problem,
  MatchCriteria,
  HowItWorks,
  ProductMoment,
  Community,
  ActivitiesGrid,
  Safety,
  FAQ,
  FinalCTA,
  ClosingFooter,
} from "@/components/Sections";
import { PageAtmosphere } from "@/components/atmosphere";
import { TrailRail } from "@/components/TrailRail";
import { Logo, scrollToSurvey } from "@/components/primitives";

const StickyCTA = ({ visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed bottom-0 inset-x-0 z-50 px-4 pb-4 md:px-6 md:pb-6"
          data-testid="sticky-cta"
        >
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-black/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-4 py-3 md:px-6 md:py-4">
            <div className="flex items-center gap-3 min-w-0">
              <Logo size={30} />
              <span
                className="hidden sm:block font-display font-bold text-[#0F291E] truncate"
                data-testid="sticky-cta-text"
              >
                Movement is better together.{" "}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={scrollToSurvey}
              data-testid="sticky-cta-btn"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#FF5C00] text-white font-display font-bold px-5 py-3 text-sm hover:bg-[#e64f00] transition-colors"
            >
              Join <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const LandingPage = () => {
  const reduce = useReducedMotion();
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduce]);

  useEffect(() => {
    const onScroll = () => {
      const heroPassed = window.scrollY > window.innerHeight * 0.9;
      const footerTop =
        document
          .querySelector('[data-testid="footer"]')
          ?.getBoundingClientRect().top ?? Infinity;
      const footerReached = footerTop < window.innerHeight * 0.88;
      setShowSticky(heroPassed && !footerReached);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="App relative" data-testid="landing-page">
      <PageAtmosphere />
      <TrailRail />

      <Hero />

      <HowItWorks />
      <ProductMoment />
      <Community />
      <Safety />
      <FAQ />
      {/* <FinalCTA /> */}
      <ClosingFooter converted={false} />

      <StickyCTA visible={showSticky} />
    </div>
  );
};
