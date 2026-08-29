"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { Nav } from "@/components/Nav";
import { TrailRail } from "@/components/TrailRail";
import { Hero } from "@/components/about/Hero";
import { ChapterOne } from "@/components/about/ChapterOne";
import { ChapterTwo } from "@/components/about/ChapterTwo";
import { ChapterThree } from "@/components/about/ChapterThree";
import { Mission } from "@/components/about/Mission";
import { CanadaBuilt } from "@/components/about/CanadaBuilt";
import { Closing } from "@/components/about/Closing";
import { Footer } from "@/components/about/Footer";

export const AboutPage = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    let rafId;
    const loop = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F7F7F2] text-[#1A1D1A]">
      <div
        aria-hidden="true"
        className="grain pointer-events-none fixed inset-0 z-[1]"
      />
      <Nav />
      <TrailRail
        chapters={[
          { id: "chapter-01" },
          { id: "chapter-02" },
          { id: "chapter-03" },
          { id: "chapter-04" },
          { id: "canada-built-section" },
        ]}
      />
      <main>
        <Hero />
        <ChapterOne />
        <ChapterTwo />
        <ChapterThree />
        <Mission />
        <CanadaBuilt />
        <Closing />
      </main>
      <Footer />
    </div>
  );
};
