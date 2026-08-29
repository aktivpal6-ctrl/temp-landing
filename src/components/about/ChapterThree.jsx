import { ParallaxImage } from "@/components/about/ParallaxImage";
import { Kicker, MaskedLines, Reveal } from "@/components/about/motion";
import { Numeral } from "@/components/about/Numeral";

const RIDE_IMG = "/images/about/photo-1541625602330-2277a4c46182.jpeg";

export const ChapterThree = () => (
  <section data-testid="chapter-03" className="relative overflow-hidden py-28 md:py-36">
    <Numeral value="03" className="-top-8 right-0 md:-right-4" />
    <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
      <Reveal className="relative order-2 lg:order-1">
        <div
          aria-hidden="true"
          className="absolute -inset-3 rounded-[2.25rem] border border-[#0F291E]/15"
        />
        <ParallaxImage
          src={RIDE_IMG}
          alt="Cyclists riding together outdoors"
          className="aspect-[4/3] rounded-[2rem] shadow-2xl"
        />
        <span className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-[#0F291E]/60 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F7F7F2]/85 backdrop-blur-sm">
          Try something new
        </span>
      </Reveal>
      <div className="order-1 lg:order-2">
        <Reveal>
          <Kicker>Chapter 03 — The Idea</Kicker>
        </Reveal>
        <h2 className="mt-6 font-display text-4xl font-black leading-[1.05] tracking-tight text-[#0F291E] md:text-5xl">
          <MaskedLines
            lines={[
              "What if finding someone",
              "was as easy as finding",
              "the thing itself?",
            ]}
          />
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-8 text-lg font-semibold text-[#0F291E]">
            That&rsquo;s where AKTIVPAL began.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="mt-5 text-base leading-relaxed text-[#4A524A] md:text-lg">
            But the more I thought about it, the more I realized this
            wasn&rsquo;t just my problem. People move to new cities. Friends get
            busy. Interests don&rsquo;t always align. Travellers arrive somewhere
            knowing nobody. And sometimes, you simply want someone who&rsquo;s up
            for the same adventure.
          </p>
        </Reveal>
        <Reveal delay={0.26}>
          <p className="mt-10 border-l-4 border-[#FF5C00] pl-6 font-display text-xl font-extrabold leading-snug tracking-tight text-[#0F291E] md:text-2xl">
            We all have things we want to do. Sometimes, we just don&rsquo;t
            have someone to do them with.
          </p>
        </Reveal>
      </div>
    </div>
  </section>
);
