import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const G = "#0F291E";
const O = "#F7F7F2";
const OR = "#FF5C00";

/* ------------------------------------------------------------------ */
/* Continuous page-wide atmosphere: one motif thread that runs behind  */
/* EVERY section and drifts with scroll (parallax). Painted above each  */
/* section's solid background (z-1) but below content (z-10).           */
/* ------------------------------------------------------------------ */
export const PageAtmosphere = () => {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const ridge1Y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["6%", "-16%"]);
  const ridge2Y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["2%", "-30%"]);
  const ridge1X = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-5%"]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden data-testid="page-atmosphere">
      {/* continuous mountain-ridge motif — always present near the lower viewport */}
      <motion.svg
        style={{ y: ridge2Y }}
        className="absolute bottom-[10vh] left-0 w-[128%] h-[34vh]"
        viewBox="0 0 1440 320" preserveAspectRatio="none"
      >
        <path
          d="M0,250 L150,190 L280,235 L430,150 L590,210 L780,120 L980,220 L1180,160 L1320,230 L1440,180"
          fill="none" stroke="rgba(255,92,0,0.10)" strokeWidth="2" vectorEffect="non-scaling-stroke"
        />
      </motion.svg>
      <motion.svg
        style={{ y: ridge1Y, x: ridge1X }}
        className="absolute bottom-[-2vh] left-0 w-[132%] h-[42vh]"
        viewBox="0 0 1440 320" preserveAspectRatio="none"
      >
        <path
          d="M0,220 L160,150 L300,200 L460,90 L620,180 L820,70 L1010,190 L1180,120 L1320,205 L1440,140"
          fill="none" stroke="rgba(255,92,0,0.16)" strokeWidth="2.5" vectorEffect="non-scaling-stroke"
        />
      </motion.svg>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Blended, non-flat seam between two adjacent sections. Gradient tone  */
/* from -> to + a curved/diagonal edge in the destination colour, so     */
/* the boundary is a gradual blend, never a hard straight line.          */
/* ------------------------------------------------------------------ */
const SEAM_PATHS = {
  wave: "M0,60 C380,140 1060,-10 1440,60 L1440,120 L0,120 Z",
  diagR: "M0,18 L1440,108 L1440,120 L0,120 Z",
  diagL: "M0,108 L1440,18 L1440,120 L0,120 Z",
  deep: "M0,36 C480,150 960,150 1440,36 L1440,120 L0,120 Z",
};

export const Seam = ({ from = O, to = G, variant = "wave", height = 120 }) => (
  <div
    className="relative w-full z-[2] -mt-px"
    style={{ height, background: from }}
    aria-hidden
  >
    <svg
      className="absolute bottom-[-1px] left-0 w-full h-full"
      viewBox="0 0 1440 120" preserveAspectRatio="none"
    >
      <path d={SEAM_PATHS[variant] || SEAM_PATHS.wave} fill={to} />
    </svg>
  </div>
);

/* Per-section parallax hook — background/decorative layers move slower */
export const useDrift = (dist = 70) => {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [dist, -dist]);
  return { ref, y };
};
