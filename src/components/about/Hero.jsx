"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { MaskedLines } from "@/components/about/motion";

const EASE = [0.22, 1, 0.36, 1];

const HERO_IMG = "/images/about/photo-1551632811-561732d1e306.jpeg";

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);

  return (
    <section
      ref={ref}
      data-testid="about-hero"
      className="relative flex min-h-screen items-end overflow-hidden bg-[#0F291E]"
    >
      <motion.div style={{ y: imgY }} className="absolute inset-0">
        <motion.img
          src={HERO_IMG}
          alt="Hikers moving along a mountain ridge trail"
          initial={{ scale: 1.18 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
          className="h-full w-full object-cover will-change-transform"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F291E]/70 via-[#0F291E]/55 to-[#0F291E]" />

      <motion.div
        style={{ opacity: fade, y: contentY }}
        className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-28 pt-44 md:pb-36"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FF5C00]/30 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#FF5C00] backdrop-blur-sm">
            Our Story
          </span>
        </motion.div>
        <h1 className="mt-7 font-display text-5xl font-black leading-[1.02] tracking-tight text-[#F7F7F2] sm:text-6xl md:text-7xl lg:text-[4.5rem]">
          <MaskedLines
            lines={["It started with", "a simple feeling."]}
            delay={0.4}
          />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75, ease: EASE }}
          className="mt-6 max-w-2xl text-lg italic leading-relaxed text-[#F7F7F2]/55 md:text-[1.75rem] md:leading-snug"
        >
          I wish I had someone to share this with.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.95, ease: EASE }}
          className="mt-9"
        >
          <span
            data-testid="hero-location-badge"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F7F7F2]/70 backdrop-blur-sm"
          >
            <MapPin className="h-3.5 w-3.5 text-[#FF5C00]" />
            Starting in British Columbia
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[#F7F7F2]/50"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  );
};
