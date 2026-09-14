import { Kicker, MaskedLines, Reveal } from "@/components/about/motion";
import { Numeral } from "@/components/about/Numeral";
import Image from "next/image";

const FOREST_IMG = "/images/about/photo-1470071459604-3b5ec3a7fe05.jpeg";

export const Mission = () => (
  <section
    data-testid="chapter-04"
    className="relative overflow-hidden bg-[#0F291E] py-28 md:py-40"
  >
    <Image
      src={FOREST_IMG}
      alt=""
      aria-hidden="true"
      fill
      sizes="100vw"
      className="object-cover opacity-[0.12]"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[#0F291E] via-[#0F291E]/80 to-[#0F291E]" />
    <Numeral dark value="04" className="-top-6 left-0 opacity-70 md:left-6" />
    <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
      <Reveal>
        <Kicker>Chapter 04 — The Mission</Kicker>
      </Reveal>
      <h2 className="mt-6 font-display text-4xl font-black leading-[1.05] tracking-tight text-[#F7F7F2] md:text-5xl lg:text-6xl">
        <MaskedLines
          lines={["AKTIVPAL exists", "to change that."]}
        />
      </h2>
      <Reveal delay={0.1}>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-[#F7F7F2]/80 md:text-lg">
          We&rsquo;re building a place where you can find the right people to
          move, explore, play and experience more with — whether you&rsquo;re
          new to a city, travelling somewhere new, or simply looking for someone
          who&rsquo;s up for it.
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
          From &ldquo;we should&rdquo; to &ldquo;let&rsquo;s go.&rdquo;
        </span>
      </Reveal>
    </div>
  </section>
);
