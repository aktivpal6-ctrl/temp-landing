"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Survey } from "@/components/Survey";
import { Logo } from "@/components/primitives";
import { IMAGES } from "@/data/survey";
import { Footer } from "@/components/Footer";

const WAITLIST_PAGE_HIGHLIGHTS = [
  {
    icon: MapPin,
    title: "Be an early member",
    body: "Sign up with your details and we'll invite you to be one of the first to try AKTIVPAL when it launches.",
  },
  {
    icon: ArrowRight,
    title: "Built for active people",
    body: "Whether you hike, trail run, walk, camp, ski, kayak or swim — AKTIVPAL helps you find the right people to do it with.",
  },
  {
    icon: ShieldCheck,
    title: "Starting in British Columbia",
    body: "We're building for Canadian outdoor communities, starting in British Columbia. Your signup helps us build for you.",
  },
];

export const WaitlistPage = () => {
  return (
    <div className="min-h-screen bg-[#F7F7F2]" data-testid="waitlist-page">
      <header
        className="sticky top-0 z-40 border-b border-black/10 bg-[#F7F7F2]/90 backdrop-blur-xl"
        data-testid="waitlist-page-header"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3"
            data-testid="waitlist-page-logo-link"
          >
            <Logo size={38} showWord />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F291E] transition-colors hover:border-[#FF5C00]/40 hover:text-[#FF5C00]"
            data-testid="waitlist-page-back-link"
          >
            <ArrowLeft size={16} /> Back to main page
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12 lg:py-16 grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] items-start">
        <section
          className="lg:sticky lg:top-28 space-y-6"
          data-testid="waitlist-page-overview"
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0F291E] grain text-[#F7F7F2] border border-black/10 shadow-[0_24px_60px_rgba(15,41,30,0.18)]">
            <div className="absolute inset-0" aria-hidden>
              <Image
                src={IMAGES.canada}
                alt="People outdoors in Canada"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0F291E]/70 via-[#0F291E]/80 to-[#0F291E]" />
            </div>

            <div className="relative z-10 p-7 md:p-8">
              <span
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#FF5C00]"
                data-testid="waitlist-page-kicker"
              >
                <BadgeCheck size={14} /> Early member signup
              </span>
              <h1
                className="mt-6 font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-[0.92] tracking-tighter"
                data-testid="waitlist-page-title"
              >
                Be one of the first to try AKTIVPAL.
              </h1>
              <p
                className="mt-6 max-w-xl text-sm md:text-base leading-relaxed text-[#F7F7F2]/80"
                data-testid="waitlist-page-description"
              >
                Sign up now and we'll keep you in the loop. Early members get
                first access as we launch in British Columbia.
              </p>

              <div
                className="mt-8 grid gap-3 sm:grid-cols-3"
                data-testid="waitlist-page-stats"
              >
                {[
                  { label: "Starting in", value: "British Columbia" },
                  { label: "Focus", value: "Real plans" },
                  { label: "Goal", value: "Launch-ready insight" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-4 backdrop-blur-sm"
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#F7F7F2]/50">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-display font-bold text-[#F7F7F2]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3" data-testid="waitlist-page-highlights">
            {WAITLIST_PAGE_HIGHLIGHTS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[1.6rem] border border-black/10 bg-white px-5 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FF5C00]/10 text-[#FF5C00]">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h2
                        className="font-display font-bold text-xl text-[#0F291E]"
                        data-testid={`waitlist-highlight-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      >
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-[#4A524A]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section
          className="rounded-[2rem] border border-black/10 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.08)] overflow-hidden"
          data-testid="waitlist-page-form-shell"
        >
          <Survey standalone />
        </section>
      </main>
      <footer>
        <Footer variant="light" />
      </footer>
    </div>
  );
};
