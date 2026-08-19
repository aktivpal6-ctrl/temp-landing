import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import { Logo, Reveal, MaskedLines, CTA, stagger, item, scrollToSurvey } from "./primitives";
import { useDrift } from "./atmosphere";
import { IMAGES, MATCH_CRITERIA, ACTIVITIES, WHO_FOR, SAFETY, STEPS, FOUNDING_TAGS } from "../data/survey";

const Ic = ({ name, ...p }) => {
  const C = Icons[name] || Icons.Circle;
  return <C {...p} />;
};

// Big faint drifting chapter numeral — a recurring parallax motif per section
const DriftNumeral = ({ n, y, className = "", dark = false }) => (
  <motion.span
    style={{ y }} aria-hidden
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "26%"]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.18]);
  const yContent = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-[#0F291E] grain" data-testid="hero">
      <motion.div style={{ y: yBg, scale: scaleBg }} className="absolute inset-0">
        <img src={IMAGES.hero} alt="Mountain ridge in Canada" className="w-full h-full object-cover opacity-55" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F291E]/70 via-[#0F291E]/55 to-[#0F291E]" />

      {/* pinned/parallaxed hero content */}
      <motion.div style={{ y: yContent }} className="relative z-10 max-w-6xl mx-auto px-6 pt-8 pb-24 min-h-[100svh] flex flex-col">
        <motion.header
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} className="flex items-center justify-between"
        >
          <Logo size={38} showWord light />
          <span className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[#F7F7F2]/70 border border-white/15 rounded-full px-4 py-2 backdrop-blur-sm">
            <Ic name="MapPin" size={14} className="text-[#FF5C00]" /> Canada
          </span>
        </motion.header>

        <motion.div style={{ opacity: fade }} className="flex-1 flex flex-col justify-center max-w-4xl mt-16">
          <motion.span
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00] mb-6"
          >
            <span className="w-8 h-px bg-[#FF5C00]" /> The movement app for Canada
          </motion.span>

          <h1 className="font-display font-black text-[#F7F7F2] tracking-tighter leading-[0.92] text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem]">
            <MaskedLines lines={["Find your people.", "Move together."]} delay={0.25} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.6 }}
            className="mt-7 text-lg md:text-xl text-[#F7F7F2]/80 max-w-2xl leading-relaxed"
          >
            The easiest way to find the right people to hike, run, ride, climb, ski, play and explore with.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.6 }}
            className="mt-3 text-base text-[#F7F7F2]/55 max-w-xl"
          >
            You choose the activity, time, location and pace. AKTIVPAL helps you find people who fit.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <CTA testId="hero-cta" onClick={scrollToSurvey}>
              JOIN THE AKTIVPAL COMMUNITY <Ic name="ArrowRight" size={18} />
            </CTA>
            <span className="text-sm text-[#F7F7F2]/50 font-medium">Launching in Canada</span>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity: fade }} className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#F7F7F2]/50 z-10"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <Ic name="ChevronDown" size={22} />
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ---------------- PROBLEM (slow reveal + parallax numeral) ---------------- */
export const Problem = () => {
  const { ref, y } = useDrift(90);
  const lines = [
    "Ever wanted to go… but didn't have anyone to go with?",
    "Your friends are busy. Someone isn't into hiking. Someone is too slow. Someone is too fast. Someone cancels.",
    "And suddenly, another weekend passes.",
  ];
  return (
    <section ref={ref} className="relative bg-[#F7F7F2] py-28 md:py-40 overflow-hidden" data-testid="problem">
      <DriftNumeral n="01" y={y} className="text-[22rem] -right-10 top-6" />
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">01 — The problem</span>
        <div className="mt-10 space-y-8">
          {lines.map((l, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className="font-display font-bold text-2xl md:text-4xl leading-tight tracking-tight text-[#1A1D1A] text-balance">
                {l}
              </p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1} className="mt-16 border-l-4 border-[#FF5C00] pl-6">
          <p className="text-lg md:text-xl text-[#4A524A] leading-relaxed max-w-2xl">
            We think being active shouldn't depend on having the right friends available.
            <strong className="block mt-3 font-display font-extrabold text-[#0F291E]">Simply looking for a partner to be active with.</strong>
            <span className="text-[#0F291E] font-semibold"> That's why we're building AKTIVPAL.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
};

/* ---------------- REFRAME ---------------- */
export const Reframe = () => {
  const { ref, y } = useDrift(80);
  return (
    <section ref={ref} className="relative bg-[#0F291E] py-28 md:py-40 grain overflow-hidden" data-testid="reframe">
      <motion.div style={{ y }} className="pointer-events-none absolute -left-24 top-1/2 w-[36rem] h-[36rem] rounded-full bg-[#FF5C00]/10 blur-3xl" aria-hidden />
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <Reveal>
          <h2 className="font-display font-black text-[#F7F7F2] tracking-tighter leading-[0.95] text-4xl md:text-6xl text-balance">
            Your next adventure shouldn't depend on your <span className="text-[#FF5C00]">group chat.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 text-xl md:text-2xl text-[#F7F7F2]/75 max-w-3xl leading-relaxed">
            AKTIVPAL is being built to help you find people who actually fit what you want to do.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-4 text-xl md:text-2xl font-display font-bold text-[#F7F7F2]">
            Not just people nearby. <span className="text-[#FF5C00]">The right people.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
};

/* ---------------- MATCH CRITERIA ---------------- */
export const MatchCriteria = () => {
  const { ref, y } = useDrift(90);
  return (
    <section ref={ref} className="relative bg-[#F7F7F2] py-28 md:py-36 overflow-hidden" data-testid="match-criteria">
      <DriftNumeral n="02" y={y} className="text-[22rem] -left-10 top-10" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">02 — How matching works</span>
          <h2 className="mt-4 font-display font-extrabold text-3xl md:text-5xl tracking-tight text-[#1A1D1A] max-w-2xl">
            Find people based on things that actually matter.
          </h2>
        </Reveal>
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {MATCH_CRITERIA.map((c, i) => (
            <motion.div
              key={c.title} variants={item} whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-3xl border border-black/10 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              data-testid={`match-card-${i}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FF5C00]/10 flex items-center justify-center mb-5">
                <Ic name={c.icon} size={22} className="text-[#FF5C00]" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#0F291E]">{c.title}</h3>
              <p className="mt-2 text-[15px] text-[#4A524A] leading-relaxed">{c.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ---------------- PRODUCT MOMENT (pinned title + sequential reveal) ---------------- */
export const ProductMoment = () => {
  const sectionRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  const o1 = useTransform(scrollYProgress, [0.12, 0.26], [0, 1]);
  const o2 = useTransform(scrollYProgress, [0.32, 0.46], [0, 1]);
  const o3 = useTransform(scrollYProgress, [0.52, 0.66], [0, 1]);
  const ty1 = useTransform(scrollYProgress, [0.12, 0.26], [18, 0]);
  const ty2 = useTransform(scrollYProgress, [0.32, 0.46], [18, 0]);
  const ty3 = useTransform(scrollYProgress, [0.52, 0.66], [18, 0]);

  const paras = [
    { o: o1, y: ty1, cls: "text-[#F7F7F2]/75",
      node: <>You see people interested in the same hike. Similar fitness levels. Similar pace. Similar interests.</> },
    { o: o2, y: ty2, cls: "text-[#F7F7F2]/75",
      node: <>You choose who you'd like to connect with. And you go.</> },
    { o: o3, y: ty3, cls: "text-[#F7F7F2] font-medium",
      node: <>No endless scrolling. No asking five friends. No waiting for someone to be free. <span className="text-[#FF5C00] font-semibold">Just people who want to go.</span></> },
  ];

  return (
    <section ref={sectionRef} className="relative bg-[#0F291E] grain py-20 md:py-24" data-testid="product-moment">
      <div className="max-w-6xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-14 items-start lg:min-h-[135vh]">
        {/* LEFT: pinned title + paragraphs that fade in one-by-one */}
        <div className="lg:sticky lg:top-28 lg:h-[80vh] flex flex-col justify-center">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">03 — Imagine this</span>
            <h2 className="mt-4 font-display font-black text-[#F7F7F2] text-4xl md:text-5xl tracking-tight leading-[1.02]">
              Saturday. 8:00 AM. You want to hike. You open AKTIVPAL.
            </h2>
          </Reveal>
          <div className="mt-8 space-y-5 text-lg leading-relaxed">
            {paras.map((p, i) => (
              <motion.p key={i} style={reduce ? undefined : { opacity: p.o, y: p.y }} className={p.cls} data-testid={`imagine-line-${i}`}>
                {p.node}
              </motion.p>
            ))}
          </div>
        </div>

        {/* RIGHT: pinned Grouse Grind card */}
        <div className="lg:sticky lg:top-28 lg:h-[80vh] flex items-center">
          <Reveal x={40} className="w-full">
            <motion.div
              whileHover={{ y: -8, rotate: -0.5 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-white/5 backdrop-blur-xl"
            >
              <div className="h-52 relative overflow-hidden">
                <img src={IMAGES.hike} alt="Grouse Grind trail" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F291E] to-transparent" />
                <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider bg-[#FF5C00] text-white px-3 py-1.5 rounded-full">
                  New plan near you
                </span>
              </div>
              <div className="p-6 -mt-4 relative">
                <h3 className="font-display font-black text-2xl text-white">Grouse Grind</h3>
                <div className="mt-4 space-y-2.5 text-[15px] text-[#F7F7F2]/85">
                  <div className="flex items-center gap-3"><Ic name="Footprints" size={17} className="text-[#FF5C00]" /> Moderate to hard</div>
                  <div className="flex items-center gap-3"><Ic name="Clock" size={17} className="text-[#FF5C00]" /> Saturday · 8:00 AM</div>
                  <div className="flex items-center gap-3"><Ic name="MapPin" size={17} className="text-[#FF5C00]" /> Vancouver</div>
                  <div className="flex items-center gap-3"><Ic name="Users" size={17} className="text-[#FF5C00]" /> Looking for 2–3 people · similar pace</div>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[0, 1, 2].map((n) => (
                      <div key={n} className="w-8 h-8 rounded-full border-2 border-[#0F291E] bg-gradient-to-br from-[#FF5C00] to-[#16382A]" />
                    ))}
                  </div>
                  <span className="text-xs text-[#F7F7F2]/60">3 interested</span>
                  <button className="ml-auto text-sm font-bold text-[#0F291E] bg-[#FF5C00] rounded-full px-5 py-2" data-testid="mock-join-btn">
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

/* ---------------- POSITIONING ---------------- */
export const Positioning = () => {
  const { ref, y } = useDrift(70);
  return (
    <section ref={ref} className="relative bg-[#F7F7F2] py-28 md:py-36 overflow-hidden" data-testid="positioning">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <Reveal>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight text-[#1A1D1A]">
            It's not another fitness tracker.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 text-lg md:text-xl text-[#4A524A] leading-relaxed max-w-2xl">
            AKTIVPAL isn't trying to tell you how many calories you burned. It isn't trying to replace Strava.
            It isn't another giant Facebook group where you hope someone posts the right thing at the right time.
          </p>
        </Reveal>
      </div>
      <motion.div style={{ y }} className="mt-20 relative z-10">
        <Reveal>
          <p className="text-center font-display font-black text-4xl md:text-7xl tracking-tighter text-[#0F291E] px-6">
            “Who wants to do <span className="text-[#FF5C00]">this</span> with me?”
          </p>
        </Reveal>
      </motion.div>
    </section>
  );
};

/* ---------------- ACTIVITIES ---------------- */
export const ActivitiesGrid = () => {
  const { ref, y } = useDrift(100);
  return (
    <section ref={ref} className="relative bg-[#0F291E] py-28 md:py-36 grain overflow-hidden" data-testid="activities">
      <div className="absolute inset-0" aria-hidden>
        <img
          src={IMAGES.activitiesBg}
          alt="Group hiking through a Canadian mountain trail"
          className="w-full h-full object-cover object-center opacity-50"
          data-testid="activities-background-image"
        />
        <div className="absolute inset-0 bg-[#0F291E]/62" />
      </div>
      <DriftNumeral n="04" y={y} dark className="text-[24rem] -right-16 top-0" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">04 — Many ways to move</span>
          <h2 className="mt-4 font-display font-black text-[#F7F7F2] text-3xl md:text-5xl tracking-tight max-w-3xl">
            From solo plans to shared adventures. One platform.
          </h2>
        </Reveal>
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {ACTIVITIES.map((a, i) => (
            <motion.div
              key={a.title} variants={item} whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`group rounded-3xl border border-white/20 p-7 bg-[#0F291E]/45 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.22)] hover:bg-[#0F291E]/58 ${i === 6 ? "md:col-span-2 lg:col-span-1" : ""}`}
              data-testid={`activity-card-${i}`}
            >
              <div className="w-11 h-11 rounded-xl bg-[#FF5C00]/15 flex items-center justify-center mb-4 group-hover:bg-[#FF5C00] transition-colors">
                <Ic name={a.icon} size={20} className="text-[#FF5C00] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#F7F7F2]">{a.title}</h3>
              <p className="mt-2 text-sm text-[#F7F7F2]/60 leading-relaxed">{a.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ---------------- WHO FOR ---------------- */
export const WhoFor = () => {
  const { ref, y } = useDrift(90);
  return (
    <section ref={ref} className="relative bg-[#F7F7F2] py-28 md:py-36 overflow-hidden" data-testid="who-for">
      <DriftNumeral n="05" y={y} className="text-[22rem] -right-10 top-10" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">05 — Who this is for</span>
          <h2 className="mt-4 font-display font-extrabold text-3xl md:text-5xl tracking-tight text-[#1A1D1A] max-w-2xl">
            Your people are out there. You just haven't found them yet.
          </h2>
        </Reveal>
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {WHO_FOR.map((c, i) => (
            <motion.div
              key={c.title} variants={item} whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`bg-white rounded-3xl border border-black/10 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${i === 0 ? "lg:col-span-2" : ""}`}
              data-testid={`whofor-card-${i}`}
            >
              <span className="font-display font-black text-3xl text-[#FF5C00]/30">0{i + 1}</span>
              <h3 className="mt-3 font-display font-bold text-xl text-[#0F291E]">{c.title}</h3>
              <p className="mt-2 text-[15px] text-[#4A524A] leading-relaxed">{c.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ---------------- SAFETY ---------------- */
export const Safety = () => {
  const { ref, y } = useDrift(100);
  return (
    <section ref={ref} className="relative bg-[#0F291E] py-28 md:py-36 grain overflow-hidden" data-testid="safety">
      <DriftNumeral n="06" y={y} dark className="text-[24rem] -left-16 top-0" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">06 — Trust & safety</span>
          <h2 className="mt-4 font-display font-black text-[#F7F7F2] text-3xl md:text-5xl tracking-tight max-w-3xl leading-[1.05]">
            Meeting someone new should feel exciting—not reckless.
          </h2>
          <p className="mt-6 text-lg text-[#F7F7F2]/70 max-w-2xl">
            As AKTIVPAL grows, we're designing trust and safety into the platform from the beginning.
          </p>
        </Reveal>
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {SAFETY.map((c, i) => (
            <motion.div
              key={c.title} variants={item} whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-3xl border border-white/10 p-7 bg-white/[0.03]"
              data-testid={`safety-card-${i}`}
            >
              <Ic name={c.icon} size={24} className="text-[#FF5C00] mb-4" />
              <h3 className="font-display font-bold text-lg text-[#F7F7F2]">{c.title}</h3>
              <p className="mt-2 text-sm text-[#F7F7F2]/60 leading-relaxed">{c.body}</p>
            </motion.div>
          ))}
        </motion.div>
        <Reveal delay={0.1}>
          <p className="mt-14 text-lg md:text-xl text-[#F7F7F2]/80 max-w-3xl leading-relaxed border-l-4 border-[#FF5C00] pl-6">
            Because finding someone to adventure with should never mean compromising your sense of safety.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

/* ---------------- WHY CANADA (deep parallax image) ---------------- */
export const WhyCanada = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-12%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.1, 1.25]);
  return (
    <section ref={ref} className="relative py-28 md:py-40 overflow-hidden bg-[#0F291E]" data-testid="why-canada">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img src={IMAGES.canada} alt="Canadian mountain landscape" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0F291E]/80" />
      </motion.div>
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">07 — Why Canada</span>
          <h2 className="mt-4 font-display font-black text-[#F7F7F2] text-4xl md:text-6xl tracking-tighter leading-[0.95]">
            We're starting in Canada.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 text-lg md:text-xl text-[#F7F7F2]/80 leading-relaxed">
            Mountains. Ocean. Trails. Ski hills. Cycling routes. Climbing gyms. Parks. Beaches. And thousands of
            people who already want to be active.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-5 text-lg md:text-xl text-[#F7F7F2] font-semibold leading-relaxed">
            The problem isn't that people don't want to do things. It's finding the right people at the right time.
            That's the problem we're here to solve.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 text-base text-[#F7F7F2]/65">
            We're building AKTIVPAL with the community—not for the community. Canada first. Real people first.
            Real activities first.
          </p>
        </Reveal>
        <Reveal delay={0.25} className="mt-12">
          <p className="text-lg text-[#F7F7F2]/85 mb-6 max-w-2xl">
            Before we build everything, we want to understand what you actually need. Tell us what you'd use AKTIVPAL for.
          </p>
          <CTA testId="canada-cta" onClick={scrollToSurvey}>I WANT TO JOIN <Ic name="ArrowRight" size={18} /></CTA>
        </Reveal>
      </div>
    </section>
  );
};

/* ---------------- HOW IT WORKS (timeline w/ scroll-draw line) ---------------- */
export const HowItWorks = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const lineH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <section ref={ref} className="relative bg-[#F7F7F2] py-28 md:py-36 overflow-hidden" data-testid="how-it-works">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#FF5C00]">08 — What happens when you join</span>
        </Reveal>
        <div className="mt-14 relative">
          <div className="absolute left-[27px] top-2 bottom-2 w-[2px] bg-black/10 hidden sm:block" />
          <motion.div style={{ height: lineH }} className="absolute left-[27px] top-2 w-[2px] bg-[#FF5C00] hidden sm:block origin-top" />
          <div className="space-y-10">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.05} x={20}>
                <div className="flex gap-6 items-start">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#0F291E] text-[#FF5C00] font-display font-black text-lg flex items-center justify-center relative z-10">
                    {s.n}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-display font-bold text-xl md:text-2xl text-[#0F291E]">{s.title}</h3>
                    <p className="mt-2 text-[15px] md:text-base text-[#4A524A] leading-relaxed">{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------- FOUNDING ---------------- */
export const Founding = () => {
  const { ref, y } = useDrift(80);
  return (
    <section ref={ref} className="relative bg-[#0F291E] py-28 md:py-36 grain overflow-hidden" data-testid="founding">
      <motion.div style={{ y }} className="pointer-events-none absolute right-0 top-10 w-[30rem] h-[30rem] rounded-full bg-[#FF5C00]/10 blur-3xl" aria-hidden />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <Reveal>
          <h2 className="font-display font-black text-[#F7F7F2] text-3xl md:text-5xl tracking-tight leading-tight">
            We're looking for Canada's <span className="text-[#FF5C00]">first AKTIVPALS.</span>
          </h2>
          <p className="mt-6 text-lg text-[#F7F7F2]/70 max-w-2xl mx-auto">
            Not thousands of signups yet. The right first people. People who genuinely want to:
          </p>
        </Reveal>
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          {FOUNDING_TAGS.map((t) => (
            <motion.span
              key={t.label} variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-[#F7F7F2]"
            >
              <Ic name={t.icon} size={16} className="text-[#FF5C00]" /> {t.label}
            </motion.span>
          ))}
        </motion.div>
        <Reveal delay={0.1}>
          <p className="mt-10 text-xl font-display font-bold text-[#F7F7F2]">
            If that's you, you're exactly who we're building this for.
          </p>
          <div className="mt-8"><CTA testId="founding-cta" onClick={scrollToSurvey}>BECOME AN EARLY AKTIVPAL <Ic name="ArrowRight" size={18} /></CTA></div>
        </Reveal>
      </div>
    </section>
  );
};

/* ---------------- EMOTIONAL CLOSE ---------------- */
export const EmotionalClose = () => {
  const { ref, y } = useDrift(70);
  return (
    <section ref={ref} className="relative bg-[#F7F7F2] py-28 md:py-40 overflow-hidden" data-testid="emotional-close">
      <div className="absolute inset-0" aria-hidden>
        <img
          src={IMAGES.run}
          alt=""
          className="w-full h-full object-cover object-center opacity-20"
          data-testid="emotional-close-background-image"
        />
        <div className="absolute inset-0 bg-[#F7F7F2]/78" />
      </div>
      <DriftNumeral n="09" y={y} className="text-[22rem] left-1/2 -translate-x-1/2 top-4" />
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <Reveal>
          <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-[#1A1D1A] leading-tight text-balance">
            What would you do if you always had someone to go with?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 text-lg text-[#4A524A] leading-relaxed">
            Would you finally hike that trail? Start running? Try climbing? Go skiing more often? Explore somewhere new?
            Meet people outside your usual circle?
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-8 text-lg text-[#4A524A]">Maybe the hardest part isn't getting motivated.</p>
          <p className="mt-3 font-display font-black text-3xl md:text-4xl text-[#0F291E]">
            Maybe you just need <span className="text-[#FF5C00]">your people.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
};

/* ---------------- CLOSING + FOOTER ---------------- */
export const ClosingFooter = ({ converted }) => (
  <footer className="relative bg-[#0F291E] grain overflow-hidden" data-testid="footer">
    <div className="max-w-5xl mx-auto px-6 py-28 md:py-36 text-center relative z-10">
      <Reveal>
        <Logo size={52} light />
        <h2 className="mt-8 font-display font-black text-[#F7F7F2] text-3xl md:text-5xl sm:text-3xl tracking-tight">
          Find your people. Move together.
        </h2>
        <p className="mt-4 text-[#F7F7F2]/60 text-lg">Built in Canada. Built for movement. Built around people.</p>
      </Reveal>
      {!converted && (
        <Reveal delay={0.1} className="mt-10">
          <CTA testId="footer-cta" onClick={scrollToSurvey}>JOIN THE COMMUNITY <Ic name="ArrowRight" size={18} /></CTA>
          <p className="mt-3 text-xs uppercase tracking-widest text-[#FF5C00] font-bold">Coming soon</p>
        </Reveal>
      )}
      <Reveal delay={0.15}>
        <p className="mt-14 text-[#F7F7F2]/50 max-w-2xl mx-auto leading-relaxed">
          Canada → North America → Everywhere. AKTIVPAL is starting with outdoor activities and expanding toward
          a world where finding someone to move with is as easy as finding a place to go.
        </p>
        <p className="mt-6 font-display font-bold text-[#F7F7F2] text-lg">One activity. One plan. New people.</p>
      </Reveal>
    </div>
    <div className="border-t border-white/10 relative z-10">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size={26} light />
          <span className="text-sm text-[#F7F7F2]/50">"Your people for movement."</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-[#F7F7F2]/60">
          {["About", "Community", "Safety", "Contact"].map((l) => (
            <a key={l} href="#" className="hover:text-[#FF5C00] transition-colors" data-testid={`footer-link-${l.toLowerCase()}`}>{l}</a>
          ))}
        </nav>
        <span className="text-sm text-[#F7F7F2]/40">© 2026 AKTIVPAL</span>
      </div>
    </div>
  </footer>
);
