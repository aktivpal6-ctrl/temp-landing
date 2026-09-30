"use client";

import { useEffect } from "react";

// Scroll parallax for any element marked data-parallax="<speed>".
// Offsets use the CSS `translate` property so they compose with transforms such as
// the card tilt, and are clamped to the element's overscan so no gaps appear.
// data-parallax-mode="exit" moves only once its parent starts scrolling away (the
// Our Story hero drift), and data-parallax-fade fades it out over that distance.
// Nothing moves when the visitor prefers reduced motion.
export function ParallaxEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let teardown = () => {};

    function configure() {
      teardown();
      const layers = Array.from(document.querySelectorAll("[data-parallax]")).filter((el) => el instanceof HTMLElement);
      if (reduce.matches || !layers.length) return;
      let frame = 0;
      const update = () => {
        frame = 0;
        const center = window.innerHeight / 2;
        layers.forEach((el) => {
          const parent = el.parentElement;
          if (!parent) return;
          const rect = parent.getBoundingClientRect();
          if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
          const speed = parseFloat(el.dataset.parallax) || 0;
          if (el.dataset.parallaxMode === "exit") {
            const scrolled = Math.max(0, Math.min(-rect.top, rect.height));
            el.style.translate = `0 ${(scrolled * speed).toFixed(1)}px`;
            if ("parallaxFade" in el.dataset) el.style.opacity = String(Math.max(0, 1 - scrolled / (rect.height * 0.75)));
            return;
          }
          const limit = Number(el.dataset.parallaxLimit) || Math.max(0, (el.offsetHeight - parent.offsetHeight) / 2);
          const offset = Math.max(-limit, Math.min(limit, (center - (rect.top + rect.height / 2)) * speed));
          el.style.translate = `0 ${offset.toFixed(1)}px`;
        });
      };
      const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      update();
      teardown = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        layers.forEach((el) => { el.style.translate = ""; el.style.opacity = ""; });
      };
    }

    configure();
    reduce.addEventListener("change", configure);
    return () => {
      teardown();
      reduce.removeEventListener("change", configure);
    };
  }, []);
  return null;
}
