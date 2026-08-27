import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence, // add this
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import * as Icons from "lucide-react";
import {
  Logo,
  Reveal,
  MaskedLines,
  CTA,
  Stagger,
  item,
  scrollToWaitlist,
} from "./primitives";
import { useDrift } from "./atmosphere";
import {
  IMAGES,
  MATCH_CRITERIA,
  ACTIVITIES,
  SAFETY,
  STEPS,
  COMMUNITY_TAGS,
} from "../data/survey";

const Ic = ({ name, ...p }) => {
  const C = Icons[name] || Icons.Circle;
  return <C {...p} />;
};

// Big faint drifting chapter numeral — a recurring parallax motif per section
const DriftNumeral = ({ n, y, className = "", dark = false }) => (
  <motion.span
    style={{ y }}
    aria-hidden
    className={`pointer-events-none absolute font-display font-black leading-none select-none ${
      dark ? "text-white/[0.05]" : "text-[#0F291E]/[0.045]"
    } ${className}`}
  >
    {n}
  </motion.span>
);

/* ---------------- HERO ---------------- */
export const Hero = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yBg = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["0%", "26%"],
  );
  const scaleBg = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [1, 1] : [1, 1.18],
  );
  const yContent = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["0%", "40%"],
  );
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden bg-[#0F291E] grain"
      data-testid="hero"
    >
      <motion.div
        style={{ y: yBg, scale: scaleBg }}
        className="absolute inset-0"
      >
        <Image
          src={IMAGES.hero}
          alt="Hikers moving along a mountain ridge trail"
          fill
          priority
          sizes="100vw"
          className="w-full h-full object-cover opacity-55"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F291E]/70 via-[#0F291E]/55 to-[#0F291E]" />

      <motion.div
        style={{ y: yContent }}
        className="relative z-10 max-w-6xl mx-auto px-6 pt-8 pb-24 min-h-[100svh] flex flex-col"
      >
        <header
          className="flex items-center justify-between ap-hero-reveal ap-in-view"
        >
          <Logo size={38} showWord light />
          <span className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[#F7F7F2]/70 border border-white/15 rounded-full px-4 py-2 backdrop-blur-sm">
            <Ic name="MapPin" size={14} className="text-[#FF5C00]" /> Canada
          </span>
        </header>

        <motion.div
          style={{ opacity: fade }}
          className="flex-1 flex flex-col items-center justify-center text-center mt-10"
        >
          <span
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00] mb-8 border border-[#FF5C00]/30 rounded-full px-5 py-2.5 backdrop-blur-sm ap-hero-reveal ap-in-view"
            style={{ animationDelay: "0.15s" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00]" />
            Life happens when you move
          </span>

          <h1 className="font-display max-w-4xl">
            <span className="flex flex-wrap items-baseline justify-center gap-x-[0.28em] gap-y-1 font-black tracking-tighter leading-[0.92] text-5xl sm:text-6xl md:text-7xl lg:text-[4.5rem]">
              <span className="text-[#F7F7F2]">
                <MaskedLines lines={["Movement is better"]} delay={0.25} />
              </span>
              <span className="relative text-[#FF5C00]">
                <MaskedLines lines={["together."]} delay={0.38} />
                <motion.svg
                  viewBox="0 0 220 16"
                  className="absolute left-0 -bottom-2 md:-bottom-3 w-full h-[10px] md:h-[14px] pointer-events-none"
                  aria-hidden
                >
                  <motion.path
                    d="M2 10 C 40 2, 80 14, 120 6 S 190 2, 218 9"
                    stroke="#FF5C00"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{
                      delay: 1,
                      duration: 0.7,
                      ease: [0.65, 0, 0.35, 1],
                    }}
                  />
                </motion.svg>
              </span>
            </span>

            <span className="block max-w-2xl mx-auto mt-3 md:mt-4 font-medium italic tracking-tight leading-snug text-[#F7F7F2]/55 text-xl sm:text-2xl md:text-[1.75rem]">
              <MaskedLines
                lines={["Some of your best people are still strangers."]}
                delay={0.55}
              />
            </span>
          </h1>

          <p
            className="mt-7 text-lg md:text-xl text-[#F7F7F2]/80 max-w-2xl leading-relaxed ap-hero-reveal ap-in-view"
            style={{ animationDelay: "0.75s" }}
          >
            From a morning run to a mountain adventure, find the right people to
            move with.
          </p>

          <div
            className="mt-10 flex flex-col items-center gap-4 ap-hero-reveal ap-in-view"
            style={{ animationDelay: "0.95s" }}
          >
            <CTA testId="hero-cta" onClick={scrollToWaitlist}>
              JOIN THE MOVEMENT <Ic name="ArrowRight" size={18} />
            </CTA>
            <span className="text-sm text-[#F7F7F2]/50 font-medium">
              Starting in British Columbia
            </span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity: fade }}
        onClick={() => {
          ref.current?.nextElementSibling?.scrollIntoView({
            behavior: "smooth",
          });
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#F7F7F2]/50 z-10 cursor-pointer"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <Ic name="ChevronDown" size={22} />
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ---------------- PROBLEM — "There's more to being active than working out" ---------------- */
export const Problem = () => {
  const { ref, y } = useDrift(90);
  return (
    <section
      ref={ref}
      className="relative bg-[#0F291E] py-28 md:py-40 grain overflow-hidden"
      data-testid="problem"
    >
      <DriftNumeral
        n="01"
        y={y}
        dark
        className="text-[24rem] -right-12 top-2"
      />
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">
          01 — More than a workout
        </span>
        <Reveal delay={0.05}>
          <h2 className="mt-6 font-display font-black text-[#F7F7F2] text-4xl md:text-6xl tracking-tighter leading-[0.95] text-balance">
            Movement is more than staying active. It’s the places you discover,
            people you meet, and stories you create
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-6 text-lg text-[#F7F7F2]/60">
            AKTIVPAL helps you find the right people to move with.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

/* ---------------- MATCH CRITERIA — "Find someone who's up for it" ---------------- */
export const MatchCriteria = () => {
  const { ref, y } = useDrift(90);
  return (
    <section
      ref={ref}
      className="relative bg-[#F7F7F2] py-28 md:py-36 overflow-hidden"
      data-testid="match-criteria"
    >
      <DriftNumeral n="02" y={y} className="text-[22rem] -left-10 top-10" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">
            02 — Find someone who's up for it
          </span>
          <h2 className="mt-4 font-display font-extrabold text-3xl md:text-5xl tracking-tight text-[#1A1D1A] max-w-2xl">
            Find people who are into the same things you are.
          </h2>
          <p className="mt-5 text-lg text-[#4A524A] max-w-xl">
            Hike this weekend? A running partner? A ski day? Match, then get out
            there.
          </p>
        </Reveal>
        <Stagger
          className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {MATCH_CRITERIA.map((c, i) => (
            <motion.div
              key={c.title}
              variants={item}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-3xl border border-black/10 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              data-testid={`match-card-${i}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FF5C00]/10 flex items-center justify-center mb-5">
                <Ic name={c.icon} size={22} className="text-[#FF5C00]" />
              </div>
              <h3 className="font-display font-bold text-lg md:text-xl text-[#0F291E]">
                {c.title}
              </h3>
              <p className="mt-1.5 text-sm text-[#4A524A] leading-relaxed">
                {c.body}
              </p>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
};
const STEP_LAYOUT = [
  {
    rotate: "md:-rotate-3",
    translate: "md:translate-y-0",
    height: "h-[420px] md:h-[560px]",
    z: "z-[3]",
  },
  {
    rotate: "md:rotate-2",
    translate: "md:translate-y-14",
    height: "h-[380px] md:h-[440px]",
    z: "z-[2]",
  },
  {
    rotate: "md:-rotate-2",
    translate: "md:-translate-y-6",
    height: "h-[400px] md:h-[500px]",
    z: "z-[1]",
  },
];
/* ---------------- HOW IT WORKS — 3 steps ---------------- */
export const HowItWorks = () => {
  const { ref, y } = useDrift(80);
  return (
    <section
      ref={ref}
      className="relative bg-[#0F291E] py-28 md:py-40 grain overflow-hidden"
      data-testid="how-it-works"
    >
      <DriftNumeral
        n="01"
        y={y}
        dark
        className="text-[24rem] -right-14 top-6"
      />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">
            How AKTIVPAL works
          </span>
          <h2 className="mt-4 font-display font-black text-[#F7F7F2] text-3xl md:text-5xl tracking-tight max-w-2xl">
            Less planning. Less scrolling. More doing.
          </h2>
        </Reveal>
        <Stagger
          className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6"
        >
          {STEPS.map((s, i) => {
            const l = STEP_LAYOUT[i] || STEP_LAYOUT[0];
            return (
              <motion.div
                key={s.n}
                variants={item}
                className={`relative ${l.z} md:hover:z-20`}
              >
                <div
                  className={`relative rounded-[1.75rem] border border-white/12 overflow-hidden shadow-2xl flex flex-col justify-end
                    rotate-0 translate-y-0 ${l.rotate} ${l.translate} ${l.height}
                    transition-transform duration-500 ease-out
                    md:hover:rotate-0 md:hover:-translate-y-3 md:hover:scale-[1.03]`}
                  data-testid={`step-card-${i}`}
                >
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="absolute inset-0 w-full h-full object-cover"
                    data-testid={`step-card-image-${i}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F291E] via-[#0F291E]/70 to-[#0F291E]/10" />
                  <div className="relative z-10 p-10">
                    <span className="font-display font-black text-6xl text-[#FF5C00]/70">
                      {s.n}
                    </span>
                    <h3 className="mt-4 font-display font-bold text-2xl text-[#F7F7F2]">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-base text-[#F7F7F2]/75 leading-relaxed max-w-xs">
                      {s.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
};

/* ---------------- PRODUCT MOMENT — "From 'we should' to 'let's go'" ---------------- */
export const ProductMoment = () => {
  const sectionRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const o1 = useTransform(scrollYProgress, [0.14, 0.3], [0, 1]);
  const o2 = useTransform(scrollYProgress, [0.4, 0.56], [0, 1]);
  const ty1 = useTransform(scrollYProgress, [0.14, 0.3], [18, 0]);
  const ty2 = useTransform(scrollYProgress, [0.4, 0.56], [18, 0]);

  const paras = [
    {
      o: o1,
      y: ty1,
      cls: "text-[#F7F7F2]/75",
      node: (
        <>
          "We should go hiking sometime." "Let's run together." And then…
          nothing happens.
        </>
      ),
    },
    {
      o: o2,
      y: ty2,
      cls: "text-[#F7F7F2] font-medium",
      node: (
        <>
          AKTIVPAL turns "sometime" into "this weekend."{" "}
          <span className="text-[#FF5C00] font-semibold">
            Find the people. Make the plan. Go.
          </span>
        </>
      ),
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#F7F7F2] py-20 md:py-24"
      data-testid="product-moment"
    >
      <div className="max-w-6xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-14 items-start lg:min-h-[120vh]">
        <div className="lg:sticky lg:top-28 lg:h-[80vh] flex flex-col justify-center">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">
              We've all said it
            </span>
            <h2 className="mt-4 font-display font-black text-[#1A1D1A] text-4xl md:text-5xl tracking-tighter leading-[1.02]">
              From "we should" to "let's go."
            </h2>
          </Reveal>
          <div className="mt-8 space-y-5 text-lg leading-relaxed">
            {paras.map((p, i) => (
              <motion.p
                key={i}
                style={reduce ? undefined : { opacity: p.o, y: p.y }}
                className={p.cls
                  .replace("text-[#F7F7F2]/75", "text-[#4A524A]")
                  .replace(
                    "text-[#F7F7F2] font-medium",
                    "text-[#1A1D1A] font-medium",
                  )}
                data-testid={`imagine-line-${i}`}
              >
                {p.node}
              </motion.p>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-28 lg:h-[80vh] flex items-center">
          <Reveal x={40} className="w-full">
            <motion.div
              whileHover={{ y: -8, rotate: -0.5 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="relative rounded-[2rem] overflow-hidden border border-black/10 shadow-2xl bg-[#0F291E]"
            >
              <div className="h-52 relative overflow-hidden">
                <Image
                  src={IMAGES.hike}
                  alt="Steep forest hiking trail for a Grouse Grind plan"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F291E] to-transparent" />
                <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider bg-[#FF5C00] text-white px-3 py-1.5 rounded-full">
                  New plan near you
                </span>
              </div>
              <div className="p-6 -mt-4 relative">
                <h3 className="font-display font-black text-2xl text-white">
                  Grouse Grind
                </h3>
                <div className="mt-4 space-y-2.5 text-[15px] text-[#F7F7F2]/85">
                  <div className="flex items-center gap-3">
                    <Ic
                      name="Footprints"
                      size={17}
                      className="text-[#FF5C00]"
                    />{" "}
                    Moderate to hard
                  </div>
                  <div className="flex items-center gap-3">
                    <Ic name="Clock" size={17} className="text-[#FF5C00]" />{" "}
                    Saturday · 8:00 AM
                  </div>
                  <div className="flex items-center gap-3">
                    <Ic name="MapPin" size={17} className="text-[#FF5C00]" />{" "}
                    Vancouver
                  </div>
                  <div className="flex items-center gap-3">
                    <Ic name="Users" size={17} className="text-[#FF5C00]" />{" "}
                    Looking for 2–3 people · similar pace
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[0, 1, 2].map((n) => (
                      <div
                        key={n}
                        className="w-8 h-8 rounded-full border-2 border-[#0F291E] bg-gradient-to-br from-[#FF5C00] to-[#16382A]"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#F7F7F2]/60">
                    3 interested
                  </span>
                  <button
                    className="ml-auto text-sm font-bold text-[#0F291E] bg-[#FF5C00] rounded-full px-5 py-2"
                    data-testid="mock-join-btn"
                  >
                    I'm in
                  </button>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ---------------- COMMUNITY — "More than activity partners" ---------------- */
export const Community = () => {
  const { ref, y } = useDrift(80);
  return (
    <section
      ref={ref}
      className="relative bg-[#0F291E] py-28 md:py-36 grain overflow-hidden"
      data-testid="community"
    >
      <motion.div
        style={{ y }}
        className="pointer-events-none absolute right-0 top-10 w-[30rem] h-[30rem] rounded-full bg-[#FF5C00]/10 blur-3xl"
        aria-hidden
      />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">
            More than partners
          </span>
          <h2 className="mt-4 font-display font-black text-[#F7F7F2] text-3xl md:text-5xl tracking-tight leading-tight">
            We're building a community around movement.
          </h2>
        </Reveal>
        <Stagger
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          {COMMUNITY_TAGS.map((t) => (
            <motion.span
              key={t.label}
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-[#F7F7F2]"
            >
              <Ic name={t.icon} size={16} className="text-[#FF5C00]" />{" "}
              {t.label}
            </motion.span>
          ))}
        </Stagger>
        <Reveal delay={0.1}>
          <p className="mt-12 text-xl md:text-2xl font-display font-bold text-[#F7F7F2]">
            The best part of an adventure…{" "}
            <span className="text-[#FF5C00]">is who you share it with.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
};

/* ---------------- ACTIVITIES — "Move your way" ---------------- */
export const ActivitiesGrid = () => {
  const { ref, y } = useDrift(100);
  return (
    <section
      ref={ref}
      className="relative bg-[#F7F7F2] py-28 md:py-36 overflow-hidden"
      data-testid="activities"
    >
      <DriftNumeral n="06" y={y} className="text-[24rem] -right-16 top-0" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">
            06 — Move your way
          </span>
          <h2 className="mt-4 font-display font-extrabold text-3xl md:text-5xl tracking-tight text-[#1A1D1A] max-w-2xl">
            One community. Endless possibilities.
          </h2>
        </Reveal>
        <Stagger
          className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {ACTIVITIES.map((a, i) => (
            <motion.div
              key={a.title}
              variants={item}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group bg-white rounded-3xl border border-black/10 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-[#FF5C00]/30"
              data-testid={`activity-card-${i}`}
            >
              <div className="w-11 h-11 rounded-xl bg-[#FF5C00]/10 flex items-center justify-center mb-4 group-hover:bg-[#FF5C00] transition-colors">
                <Ic
                  name={a.icon}
                  size={20}
                  className="text-[#FF5C00] group-hover:text-white transition-colors"
                />
              </div>
              <h3 className="font-display font-bold text-base md:text-lg text-[#0F291E]">
                {a.title}
              </h3>
              <p className="mt-1 text-sm text-[#4A524A] leading-snug">
                {a.body}
              </p>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
};

/* ---------------- SAFETY — "Built for connection. Designed for trust." ---------------- */
export const Safety = () => {
  const { ref, y } = useDrift(100);
  return (
    <section
      ref={ref}
      className="relative bg-[#0F291E] py-28 md:py-36 grain overflow-hidden"
      data-testid="safety"
    >
      <DriftNumeral n="04" y={y} dark className="text-[24rem] -left-16 top-0" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">
            Built for trust.
          </span>
          <h2 className="mt-4 font-display font-black text-[#F7F7F2] text-3xl md:text-5xl tracking-tight max-w-3xl leading-[1.05]">
            Built for connection. Designed for trust.
          </h2>
          <p className="mt-6 text-lg text-[#F7F7F2]/70 max-w-2xl">
            Meeting new people should feel exciting — not uncertain.
          </p>
        </Reveal>
        <Stagger
          className="mt-14 grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5"
        >
          {SAFETY.map((c, i) => (
            <motion.div
              key={c.title}
              variants={item}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-3xl border border-white/10 p-6 bg-white/[0.03]"
              data-testid={`safety-card-${i}`}
            >
              <Ic name={c.icon} size={24} className="text-[#FF5C00] mb-4" />
              <h3 className="font-display font-bold text-base text-[#F7F7F2]">
                {c.title}
              </h3>
              <p className="mt-1.5 text-sm text-[#F7F7F2]/60 leading-relaxed">
                {c.body}
              </p>
            </motion.div>
          ))}
        </Stagger>
        <Reveal delay={0.1}>
          <p className="mt-14 text-lg md:text-xl text-[#F7F7F2]/80 max-w-3xl leading-relaxed border-l-4 border-[#FF5C00] pl-6">
            Unlike dating apps, the goal is simple:{" "}
            <strong className="font-display font-extrabold text-[#F7F7F2]">
              Find the people who want move with you.
            </strong>
          </p>
        </Reveal>
      </div>
    </section>
  );
};

const FAQS = [
  {
    question: "What is AKTIVPAL?",
    answer:
      "AKTIVPAL helps you find the right people to move with. Whether you’re new to a place, struggling to make friends as an adult, or simply don’t have anyone who’s up for your next hike, run, ski day, or adventure, we make it easier to connect, make plans, and get moving together.",
  },
  {
    question: "Is it safe to meet someone through AKTIVPAL?",
    answer:
      "You'll see who you're meeting before you go — profiles, activity history, and reviews from other members. Unlike dating apps, everyone's here for the same reason: to actually do something.",
  },
  {
    question: "What activities can I do on AKTIVPAL?",
    answer:
      "Hiking, running, skiing and snowboarding, cycling, climbing, outdoor-walking — and many more! We're expanding from there.",
  },
  {
    question: "Where is AKTIVPAL available?",
    answer: "British Columbia right now. We're expanding from there.",
  },
];

/* ---------------- FAQ ---------------- */
const FAQItem = ({ faq, isOpen, onToggle, index }) => (
  <motion.div
    variants={item}
    className="bg-white rounded-3xl border border-black/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
    data-testid={`faq-card-${index}`}
  >
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      data-testid={`faq-toggle-${index}`}
      className="group w-full flex items-center justify-between gap-6 text-left px-6 md:px-10 py-7 md:py-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C00]/50"
    >
      <span className="font-display font-bold text-xl md:text-2xl text-[#0F291E] leading-snug group-hover:text-[#FF5C00] transition-colors">
        {faq.question}
      </span>
      <motion.span
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#FF5C00]/10 flex items-center justify-center"
      >
        <Ic name="Plus" size={20} className="text-[#FF5C00]" />
      </motion.span>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <p className="px-6 md:px-10 pb-8 md:pb-10 text-base md:text-lg text-[#4A524A] leading-relaxed max-w-2xl">
            {faq.answer}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export const FAQ = () => {
  const { ref, y } = useDrift(100);
  const [openIndex, setOpenIndex] = useState(0); // first question open on load

  return (
    <section
      ref={ref}
      className="relative bg-[#F7F7F2] py-28 md:py-36 overflow-hidden"
      data-testid="faq"
    >
      <DriftNumeral n="05" y={y} className="text-[24rem] -right-16 top-0" />
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">
            FAQ
          </span>
          <h2 className="mt-4 font-display font-extrabold text-3xl md:text-5xl tracking-tight text-[#1A1D1A]">
            Questions before you get moving.
          </h2>
        </Reveal>
        <Stagger
          className="mt-14 space-y-4"
        >
          {FAQS.map((faq, i) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </Stagger>
      </div>
    </section>
  );
};

/* ---------------- FINAL CTA — "Your next adventure could start here" ---------------- */
export const FinalCTA = () => {
  const { ref, y } = useDrift(70);
  return (
    <section
      ref={ref}
      className="relative bg-[#F7F7F2] py-28 md:py-40 overflow-hidden"
      data-testid="final-cta"
    >
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={IMAGES.run}
          alt="Runner on an outdoor trail"
          fill
          sizes="100vw"
          className="w-full h-full object-cover object-center opacity-20"
          data-testid="final-cta-background-image"
        />
        <div className="absolute inset-0 bg-[#F7F7F2]/78" />
      </div>
      <DriftNumeral
        n="09"
        y={y}
        className="text-[22rem] left-1/2 -translate-x-1/2 top-4"
      />
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <Reveal>
          <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter text-[#0F291E] leading-[0.95] text-balance">
            Your next adventure could start here.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 text-lg md:text-xl text-[#4A524A] max-w-xl mx-auto leading-relaxed">
            A hiking partner. A running buddy. Someone to explore a new mountain
            with. Or a friend you never would have met otherwise.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-10">
          <CTA testId="finalcta-cta" onClick={scrollToWaitlist}>
            JOIN AKTIVPAL <Ic name="ArrowRight" size={18} />
          </CTA>
          <p className="mt-4 text-sm text-[#4A524A]">
            Starting in British Columbia.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

/* ---------------- CLOSING + FOOTER ---------------- */
export const ClosingFooter = ({ converted }) => (
  <footer
    className="relative bg-[#0F291E] grain overflow-hidden"
    data-testid="footer"
  >
    <div className="max-w-5xl mx-auto px-6 py-24 md:py-28 text-center relative z-10">
      <Reveal>
        <Logo size={52} light />
        <h2 className="mt-8 font-display font-black text-[#F7F7F2] text-3xl md:text-5xl tracking-tight">
          Movement is better together.{" "}
        </h2>
        <p className="mt-4 text-[#F7F7F2]/60 text-lg">
          Starting in British Columbia.
        </p>
      </Reveal>
      {!converted && (
        <Reveal delay={0.1} className="mt-10">
          <CTA testId="footer-cta" onClick={scrollToWaitlist}>
            JOIN THE MOVEMENT <Ic name="ArrowRight" size={18} />
          </CTA>
          <p className="mt-3 text-xs uppercase tracking-widest text-[#FF5C00] font-bold">
            Coming soon
          </p>
        </Reveal>
      )}
    </div>
    <div className="border-t border-white/10 relative z-10">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size={26} light />
          <span className="text-sm text-[#F7F7F2]/50">
            "Your people for movement."
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-[#F7F7F2]/60">
          {[
            { label: "About", href: "/about" },
            { label: "Community", href: "/community" },
            { label: "Safety", href: "/safety" },
            { label: "Contact", href: "/contact" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="hover:text-[#FF5C00] transition-colors"
              data-testid={`footer-link-${label.toLowerCase()}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <span className="text-sm text-[#F7F7F2]/40">© 2026 AKTIVPAL</span>
      </div>
    </div>
  </footer>
);
