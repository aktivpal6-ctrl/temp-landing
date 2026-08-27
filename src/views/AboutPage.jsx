"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { Nav } from "@/components/Nav";
import { ClosingFooter } from "@/components/Sections";
import { TrailRail } from "@/components/TrailRail";
import { ParallaxImage } from "@/components/about/ParallaxImage";
import { CTA, Kicker, MaskedLines, Reveal } from "@/components/about/motion";

const EASE = [0.22, 1, 0.36, 1];

const IMG = {
  hero: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=2000&q=85",
  peaks: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=85",
  ride: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1400&q=85",
  forest: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=85",
  lake: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85",
};

const Numeral = ({ value, dark = false, className = "" }) => (
  <span
    aria-hidden="true"
    className={`pointer-events-none absolute select-none font-display text-[9rem] font-black leading-none tracking-tighter md:text-[15rem] ${
      dark ? "text-stroke-light" : "text-stroke-dark"
    } ${className}`}
  >
    {value}
  </span>
);

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);

  return (
    <section ref={ref} data-testid="about-hero" className="relative flex min-h-screen items-end overflow-hidden bg-[#0F291E]">
      <motion.div style={{ y: imgY }} className="absolute inset-0">
        <motion.img
          src={IMG.hero}
          alt="Hikers moving along a mountain ridge trail"
          initial={{ scale: 1.18 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
          className="h-full w-full object-cover will-change-transform"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F291E]/70 via-[#0F291E]/55 to-[#0F291E]" />

      <motion.div style={{ opacity: fade, y: contentY }} className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-28 pt-44 md:pb-36">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25, ease: EASE }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FF5C00]/30 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#FF5C00] backdrop-blur-sm">
            Our Story
          </span>
        </motion.div>
        <h1 className="mt-7 font-display text-5xl font-black leading-[1.02] tracking-tight text-[#F7F7F2] sm:text-6xl md:text-7xl lg:text-[4.5rem]">
          <MaskedLines lines={["It started with", "a simple feeling."]} delay={0.4} />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75, ease: EASE }}
          className="mt-6 max-w-2xl text-lg italic leading-relaxed text-[#F7F7F2]/55 md:text-[1.75rem] md:leading-snug"
        >
          I wish I had someone to share this with.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.95, ease: EASE }} className="mt-9">
          <span data-testid="hero-location-badge" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F7F7F2]/70 backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5 text-[#FF5C00]" />
            Starting in British Columbia
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        onClick={() => {
          ref.current?.nextElementSibling?.scrollIntoView({
            behavior: "smooth",
          });
        }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[#F7F7F2]/50 cursor-pointer"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </motion.div>
    </section>
  );
};

const ChapterOne = () => (
  <section data-testid="chapter-01" className="relative overflow-hidden py-28 md:py-36">
    <Numeral value="01" className="-top-8 right-0 md:-right-4" />
    <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
      <div>
        <Reveal>
          <Kicker>The Beginning</Kicker>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-7 text-lg font-medium leading-relaxed text-[#1A1D1A] md:text-xl">
            Five years ago, I moved to BC, Canada. I came with a love for adventure and a curiosity to explore everything this beautiful part of the world had to offer.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 text-base leading-relaxed text-[#4A524A] md:text-lg">
            Over the years, I travelled solo along much of the Pacific Coast — from Alaska to Mexico — exploring mountains, trails, coastlines and countless places across BC and the western United States.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="mt-6 text-base leading-relaxed text-[#4A524A] md:text-lg">
            I loved the freedom of going wherever I wanted and discovering places on my own. But there was always one thing I wished I had: someone to share it with. Someone to join me for a morning run. Someone who was up for a weekend hike.
          </p>
        </Reveal>
        <Reveal delay={0.32}>
          <p className="mt-10 font-display text-2xl font-extrabold tracking-tight text-[#0F291E] md:text-3xl">
            Someone who would say, <span className="text-[#FF5C00]">"Let's go."</span>
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.15} className="relative">
        <div aria-hidden="true" className="absolute -inset-3 rounded-[2.25rem] border border-[#FF5C00]/30" />
        <ParallaxImage
          src={IMG.peaks}
          alt="A lone traveller beneath snowy mountain peaks under a night sky"
          className="aspect-[4/5] rounded-[2rem] shadow-2xl"
        />
        <span className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-[#0F291E]/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F7F7F2]/85 backdrop-blur-sm">
          Pacific Coast — Alaska to Mexico
        </span>
      </Reveal>
    </div>
  </section>
);

const ChapterTwo = () => (
  <section data-testid="chapter-02" className="relative overflow-hidden py-28 md:py-36">
    <Numeral value="02" className="-top-8 left-0 md:-left-4" />
    <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
      <Reveal>
        <Kicker>The Problem</Kicker>
      </Reveal>
      <h2 className="mt-6 font-display text-4xl font-black leading-[1.05] tracking-tight text-[#0F291E] md:text-5xl">
        <MaskedLines lines={["Making friends as", "an adult is hard."]} />
      </h2>
      <Reveal delay={0.1}>
        <p className="mt-8 text-base leading-relaxed text-[#4A524A] md:text-lg">
          Friends have their own lives. They're busy, unavailable, or simply don't share the same interests. And I realized something: making meaningful friendships as an adult is hard — especially when you're new to a place.
        </p>
      </Reveal>
      <Reveal delay={0.18}>
        <p className="mt-6 text-base leading-relaxed text-[#4A524A] md:text-lg">
          I looked everywhere. Facebook groups, communities, social platforms and different apps helped me find people or information, but everything felt scattered.
        </p>
      </Reveal>
      <Reveal delay={0.26}>
        <blockquote className="mt-12 border-l-4 border-[#FF5C00] pl-6 md:pl-8">
          <p className="font-display text-2xl font-extrabold leading-snug tracking-tight text-[#0F291E] md:text-4xl">
            I didn't need another place to scroll. <span className="text-[#FF5C00]">I needed a place to go.</span>
          </p>
        </blockquote>
      </Reveal>
    </div>
  </section>
);

const ChapterThree = () => (
  <section data-testid="chapter-03" className="relative overflow-hidden py-28 md:py-36">
    <Numeral value="03" className="-top-8 right-0 md:-right-4" />
    <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
      <Reveal className="relative order-2 lg:order-1">
        <div aria-hidden="true" className="absolute -inset-3 rounded-[2.25rem] border border-[#0F291E]/15" />
        <ParallaxImage src={IMG.ride} alt="Cyclists riding together outdoors" className="aspect-[4/3] rounded-[2rem] shadow-2xl" />
        <span className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-[#0F291E]/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F7F7F2]/85 backdrop-blur-sm">
          Try something new
        </span>
      </Reveal>
      <div className="order-1 lg:order-2">
        <Reveal>
          <Kicker>The Idea</Kicker>
        </Reveal>
        <h2 className="mt-6 font-display text-4xl font-black leading-[1.05] tracking-tight text-[#0F291E] md:text-5xl">
          <MaskedLines lines={["What if finding someone", "was as easy as finding", "the thing itself?"]} />
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-8 text-lg font-semibold text-[#0F291E]">That's where AKTIVPAL began.</p>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="mt-5 text-base leading-relaxed text-[#4A524A] md:text-lg">
            But the more I thought about it, the more I realized this wasn't just my problem. People move to new cities. Friends get busy. Interests don't always align. Travellers arrive somewhere knowing nobody. And sometimes, you simply want someone who's up for the same adventure.
          </p>
        </Reveal>
        <Reveal delay={0.26}>
          <p className="mt-10 border-l-4 border-[#FF5C00] pl-6 font-display text-xl font-extrabold leading-snug tracking-tight text-[#0F291E] md:text-2xl">
            We all have things we want to do. Sometimes, we just don't have someone to do them with.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);

const Mission = () => (
  <section data-testid="chapter-04" className="relative overflow-hidden bg-[#0F291E] py-28 md:py-40">
    {/* TODO: Convert to next/image with fill + sizes for automatic lazy loading and CLS prevention. Decorative background image — no SEO impact, but performance benefit. */}
    <img src={IMG.forest} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-[0.95]" />
    <div className="absolute inset-0 bg-gradient-to-b from-[#0F291E] via-[#0F291E]/80 to-[#0F291E]" />
    <Numeral dark value="04" className="-top-6 left-0 opacity-70 md:left-6" />
    <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
      <Reveal>
        <Kicker>The Mission</Kicker>
      </Reveal>
      <h2 className="mt-6 font-display text-4xl font-black leading-[1.05] tracking-tight text-[#F7F7F2] md:text-5xl lg:text-6xl">
        <MaskedLines lines={["AKTIVPAL exists", "to change that."]} />
      </h2>
      <Reveal delay={0.1}>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-[#F7F7F2]/80 md:text-lg">
          We're building a place where you can find the right people to move, explore, play and experience more with — whether you're new to a city, travelling somewhere new, or simply looking for someone who's up for it.
        </p>
      </Reveal>
      <Reveal delay={0.18}>
        <p className="mt-12 font-display text-2xl font-extrabold leading-snug tracking-tight text-[#F7F7F2] md:text-4xl">
          Because some of the best experiences are better shared.
        </p>
        <p className="mt-3 font-display text-2xl font-extrabold leading-snug tracking-tight text-[#FF5C00] md:text-4xl">
          And some of your best people are still strangers.
        </p>
      </Reveal>
      <Reveal delay={0.26}>
        <span className="mt-12 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F7F7F2]/70 backdrop-blur-sm">
          From "we should" to "let's go."
        </span>
      </Reveal>
    </div>
  </section>
);

export const AboutPage = () => {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
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
      <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-[1]" />
      <Nav />
      <TrailRail
        chapters={[
          { id: "chapter-01" },
          { id: "chapter-02" },
          { id: "chapter-03" },
          { id: "chapter-04" },
        ]}
      />
      <main>
        <Hero />
        <ChapterOne />
        <ChapterTwo />
        <ChapterThree />
        <Mission />
      </main>
      <ClosingFooter converted={false} />
    </div>
  );
};
