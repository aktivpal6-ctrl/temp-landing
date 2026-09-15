import { ParallaxImage } from "@/components/about/ParallaxImage";
import { Kicker, Reveal } from "@/components/about/motion";
import { Numeral } from "@/components/about/Numeral";

const PEAKS_IMG = "/images/about/photo-1519681393784-d120267933ba.jpeg";

export const ChapterOne = () => (
  <section data-testid="chapter-01" className="relative overflow-hidden py-28 md:py-36">
    <Numeral value="01" className="-top-8 right-0 md:-right-4" />
    <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
      <div>
        <Reveal>
          <Kicker>Chapter 01 — The Beginning</Kicker>
          <h2 className="mt-6 font-display text-3xl font-black tracking-tight text-[#0F291E] md:text-4xl">Why we built AKTIVPAL</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-7 text-lg font-medium leading-relaxed text-[#1A1D1A] md:text-xl">
            Five years ago, I moved to BC, Canada. I came with a love for
            adventure and a curiosity to explore everything this beautiful part of
            the world had to offer.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 text-base leading-relaxed text-[#4A524A] md:text-lg">
            Over the years, I travelled solo along much of the Pacific Coast —
            from Alaska to Mexico — exploring mountains, trails, coastlines and
            countless places across BC and the western United States.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="mt-6 text-base leading-relaxed text-[#4A524A] md:text-lg">
            I loved the freedom of going wherever I wanted and discovering places
            on my own. But there was always one thing I wished I had: someone to
            share it with. Someone to join me for a morning run. Someone who was
            up for a weekend hike.
          </p>
        </Reveal>
        <Reveal delay={0.32}>
          <p className="mt-10 font-display text-2xl font-extrabold tracking-tight text-[#0F291E] md:text-3xl">
            Someone who would say,{" "}
            <span className="text-[#FF5C00]">&ldquo;Let&rsquo;s go.&rdquo;</span>
          </p>
        </Reveal>
      </div>
      <Reveal delay={0.15} className="relative">
        <div
          aria-hidden="true"
          className="absolute -inset-3 rounded-[2.25rem] border border-[#FF5C00]/30"
        />
        <ParallaxImage
          src={PEAKS_IMG}
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
