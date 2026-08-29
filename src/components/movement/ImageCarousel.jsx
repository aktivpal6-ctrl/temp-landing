"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

export const ImageCarousel = ({ images = [], alt = "", testid = "carousel" }) => {
  const [index, setIndex] = useState(0);
  const count = images.length;

  const go = (delta) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((i) => (i + delta + count) % count);
  };

  if (count === 0) {
    return (
      <div data-testid={testid} className="group relative h-full w-full overflow-hidden bg-[#0F291E]">
        <div className="absolute inset-0 flex items-center justify-center text-[#F7F7F2]/30 text-sm font-medium">
          No images
        </div>
      </div>
    );
  }

  return (
    <div data-testid={testid} className="group relative h-full w-full overflow-hidden bg-[#0F291E]">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.img
          key={index}
          src={images[index]}
          alt={alt}
          loading="lazy"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            data-testid={`${testid}-prev`}
            onClick={go(-1)}
            className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-[#0F291E]/45 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 hover:bg-[#0F291E]/70 group-hover:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            data-testid={`${testid}-next`}
            onClick={go(1)}
            className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-[#0F291E]/45 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 hover:bg-[#0F291E]/70 group-hover:opacity-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                data-testid={`${testid}-dot-${i}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
