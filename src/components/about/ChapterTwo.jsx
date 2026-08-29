import { Kicker, MaskedLines, Reveal } from "@/components/about/motion";
import { Numeral } from "@/components/about/Numeral";

export const ChapterTwo = () => (
  <section data-testid="chapter-02" className="relative overflow-hidden py-28 md:py-36">
    <Numeral value="02" className="-top-8 left-0 md:-left-4" />
    <div className="relative z-10 mx-auto w-full max-w-4xl px-6">
      <Reveal>
        <Kicker>Chapter 02 — The Problem</Kicker>
      </Reveal>
      <h2 className="mt-6 font-display text-4xl font-black leading-[1.05] tracking-tight text-[#0F291E] md:text-5xl">
        <MaskedLines
          lines={["Making friends as", "an adult is hard."]}
        />
      </h2>
      <Reveal delay={0.1}>
        <p className="mt-8 text-base leading-relaxed text-[#4A524A] md:text-lg">
          Friends have their own lives. They&rsquo;re busy, unavailable, or
          simply don&rsquo;t share the same interests. And I realized something:
          making meaningful friendships as an adult is hard — especially when
          you&rsquo;re new to a place.
        </p>
      </Reveal>
      <Reveal delay={0.18}>
        <p className="mt-6 text-base leading-relaxed text-[#4A524A] md:text-lg">
          I looked everywhere. Facebook groups, communities, social platforms and
          different apps helped me find people or information, but everything
          felt scattered.
        </p>
      </Reveal>
      <Reveal delay={0.26}>
        <blockquote className="mt-12 border-l-4 border-[#FF5C00] pl-6 md:pl-8">
          <p className="font-display text-2xl font-extrabold leading-snug tracking-tight text-[#0F291E] md:text-4xl">
            I didn&rsquo;t need another place to scroll.{" "}
            <span className="text-[#FF5C00]">
              I needed a place to go.
            </span>
          </p>
        </blockquote>
      </Reveal>
    </div>
  </section>
);
