"use client";

import { useEffect } from "react";

// Home-only pointer effects: hero glow, magnetic primary buttons and card tilt.
// Scroll reveals and smooth scroll live in MarketingMotion, parallax in ParallaxEffects.
// Enabled only for fine pointers when the visitor allows motion; all listeners and
// inline styles are removed on navigation or when either preference changes.
export function HomeEffects() {
  useEffect(() => {
    const home = document.querySelector(".apm-home");
    if (!(home instanceof HTMLElement)) return;
    const hero = home.querySelector(".apm-hero");
    if (!(hero instanceof HTMLElement)) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let teardown = () => {};

    function configure() {
      teardown();
      if (reduce.matches || !pointer.matches) return;
      const cleanup = [];
      const on = (target, event, handler) => {
        target.addEventListener(event, handler, { passive: true });
        cleanup.push(() => target.removeEventListener(event, handler));
      };

      on(hero, "pointermove", (event) => {
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        hero.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
      const resetGlow = () => { hero.style.removeProperty("--mx"); hero.style.removeProperty("--my"); };
      on(hero, "pointerleave", resetGlow);
      cleanup.push(resetGlow);

      document.querySelectorAll(".apm-home .apm-btn--primary, .apm-site-header .apm-btn--primary").forEach((button) => {
        if (!(button instanceof HTMLElement)) return;
        on(button, "pointermove", (event) => {
          const rect = button.getBoundingClientRect();
          const dx = (event.clientX - rect.left - rect.width / 2) * 0.16;
          const dy = (event.clientY - rect.top - rect.height / 2) * 0.28;
          button.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        const reset = () => { button.style.transform = ""; };
        on(button, "pointerleave", reset);
        on(button, "blur", reset);
        cleanup.push(reset);
      });

      const card = home.querySelector("[data-tilt]");
      if (card instanceof HTMLElement) {
        on(card, "pointermove", (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.transform = `rotateX(${-y * 5}deg) rotateY(${x * 6}deg)`;
        });
        const resetTilt = () => { card.style.transform = ""; };
        on(card, "pointerleave", resetTilt);
        cleanup.push(resetTilt);
      }
      teardown = () => cleanup.forEach((dispose) => dispose());
    }

    configure();
    reduce.addEventListener("change", configure);
    pointer.addEventListener("change", configure);
    return () => {
      teardown();
      reduce.removeEventListener("change", configure);
      pointer.removeEventListener("change", configure);
    };
  }, []);
  return null;
}
