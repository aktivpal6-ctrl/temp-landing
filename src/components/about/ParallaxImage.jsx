"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// TODO: Cannot use next/image here because framer-motion requires a DOM <img> element for scroll-driven parallax transforms.
// Consider refactoring to use CSS transforms on a wrapper div with next/image inside, if performance is a concern.
export const ParallaxImage = ({ src, alt, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="absolute inset-0 h-[120%] w-full object-cover will-change-transform"
      />
    </div>
  );
};
