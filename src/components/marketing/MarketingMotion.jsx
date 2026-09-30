"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// The Our Story motion system, shared by the marketing pages: Lenis smooth scroll
// with the same settings, and scroll reveals with the same distance, duration and
// easing. Headings get a masked reveal, content fades up, grouped cards stagger.
// Server-rendered content stays visible before JS runs, for anything already on
// screen, and whenever the visitor prefers reduced motion.
const REVEALS = [
  ["mask", ".apm-section h2, .apm-doc-sec > h2, .apm-cta h2"],
  ["up", [
    ".apm-lead", ".apm-body-p", ".apm-chips-note", ".apm-pills", ".apm-pull",
    ".apm-community-photo", ".apm-safety", ".apm-ack-inner", ".apm-callout", ".apm-fields",
    ".apm-bul", ".apm-safe-box", ".apm-doc-cols", ".apm-text-link", ".apm-cta p", ".apm-cta .apm-btn",
    ".apm-features > h2", ".apm-story-line", ".apm-story-photo", ".apm-story-statement", ".apm-story-pill",
    ".apm-blog-status", ".apm-post-cover",
  ].join(", ")],
  ["right", ".apm-plan-wrap"],
  ["step", ".apm-step-card"],
];
const STAGGERED = ".apm-feat-list > li, .apm-trust-list > li, .apm-faq > details, .apm-chips > li, .apm-post-grid > .apm-post-card";

export function MarketingMotion() {
  useEffect(() => {
    const main = document.querySelector(".marketing-page");
    if (!(main instanceof HTMLElement)) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let teardown = () => {};

    function configure() {
      teardown();
      if (reduce.matches) return;

      const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      let raf = requestAnimationFrame(function loop(time) {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      });

      const tagged = [];
      const tag = (element, kind, delay) => {
        if (!(element instanceof HTMLElement) || element.dataset.reveal) return;
        element.dataset.reveal = kind;
        if (delay) element.style.setProperty("--reveal-delay", `${delay}ms`);
        tagged.push(element);
      };
      REVEALS.forEach(([kind, selector]) => main.querySelectorAll(selector).forEach((element) => tag(element, kind)));
      main.querySelectorAll(STAGGERED).forEach((element) => {
        const index = Array.prototype.indexOf.call(element.parentElement.children, element);
        tag(element, "up", Math.min(index, 4) * 80);
      });

      const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove("apm-pending");
          observer.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -80px 0px" }) : null;
      if (observer) {
        tagged.forEach((element) => {
          // Never hide what is already visible, including restored scroll positions.
          if (element.getBoundingClientRect().top < window.innerHeight) return;
          element.classList.add("apm-pending");
          observer.observe(element);
        });
      }

      teardown = () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
        observer?.disconnect();
        tagged.forEach((element) => {
          element.classList.remove("apm-pending");
          element.style.removeProperty("--reveal-delay");
          delete element.dataset.reveal;
        });
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
