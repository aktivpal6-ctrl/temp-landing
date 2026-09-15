"use client";

import Link from "next/link";
import { ArrowUpRight, Compass, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useDrift } from "@/components/atmosphere";

const EXPLORE_LINKS = [
  { href: "/movement", label: "Explore BC activities", icon: Compass },
  { href: "/about", label: "Read our story", icon: Users },
  { href: "/waitlist", label: "Join early access", icon: ArrowUpRight },
];

export function CanadaIntro() {
  const { ref, y } = useDrift(60);
  return (
    <section ref={ref} aria-labelledby="canada-heading" className="relative z-10 overflow-hidden bg-[#F7F7F2] px-6 py-24 md:py-32">
      <motion.span style={{ y }} aria-hidden className="pointer-events-none absolute -right-8 -top-20 font-display text-[17rem] font-black leading-none text-[#0F291E]/[0.045] md:text-[24rem]">BC</motion.span>
      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
        <div className="ap-hero-reveal ap-in-view">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF5C00]/25 bg-[#FF5C00]/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#A63C00]">
            <MapPin aria-hidden="true" size={15} /> Starting in British Columbia
          </div>
          <h2 id="canada-heading" className="mt-6 max-w-xl font-display text-4xl font-black leading-[1.02] tracking-tight text-[#0F291E] md:text-6xl">
            Find people for outdoor activities <span className="text-[#FF5C00]">near you.</span>
          </h2>
        </div>
        <div>
          <div className="ap-hero-reveal ap-in-view [animation-delay:120ms]">
            <p className="max-w-2xl text-base leading-relaxed text-[#4A524A] md:text-lg">
              AKTIVPAL helps people find others who want to hike, trek, trail run, walk, camp,
              ski, kayak or swim together. We are starting in British Columbia—building a
              community around real plans, shared movement and the outdoors.
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {EXPLORE_LINKS.map(({ href, label, icon: Icon }, index) => (
              <motion.div key={href} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 320, damping: 22 }} className="ap-stagger-item ap-in-view" style={{ animationDelay: `${180 + index * 80}ms` }}>
                <Link href={href} className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-[#0F291E]/10 bg-white px-5 py-4 font-display text-sm font-bold text-[#0F291E] shadow-[0_12px_35px_rgba(15,41,30,0.07)] transition-colors hover:border-[#FF5C00]/35 hover:text-[#A63C00]">
                  <span className="flex items-center gap-3"><Icon aria-hidden="true" size={18} className="text-[#FF5C00]" />{label}</span>
                  <ArrowUpRight aria-hidden="true" size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
