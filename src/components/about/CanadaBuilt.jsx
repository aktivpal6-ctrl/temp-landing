import { Compass, MapPin, MountainSnow } from "lucide-react";
import { ParallaxImage } from "@/components/about/ParallaxImage";
import { Kicker, MaskedLines, Reveal } from "@/components/about/motion";
import { Numeral } from "@/components/about/Numeral";

const CANADA_IMG = "/images/about/photo-1587381420844-7bc5f4feec02.jpeg";

export const CanadaBuilt = () => (
  <section
    data-testid="canada-built-section"
    className="relative overflow-hidden py-28 md:py-36"
  >
    <Numeral value="05" className="-top-8 right-0 md:right-6" />
    <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
      <div>
        <Reveal>
          <Kicker>Chapter 05 — Rooted Here</Kicker>
        </Reveal>
        <Reveal delay={0.08}>
          <div
            data-testid="canada-built-badge"
            className="mt-7 inline-flex items-center gap-3 rounded-full border border-[#0F291E]/10 bg-white/80 px-4 py-3 shadow-[0_20px_50px_rgba(15,41,30,0.08)] backdrop-blur-sm"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FF5C00] text-white">
              <MountainSnow className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0F291E]/70">
              Rooted in Canada
            </span>
          </div>
        </Reveal>
        <h2
          data-testid="canada-built-heading"
          className="mt-6 font-display text-4xl font-black leading-[1.05] tracking-tight text-[#0F291E] md:text-5xl lg:text-6xl"
        >
          <MaskedLines
            lines={["Homegrown here,", "shaped by the", "Canadian outdoors."]}
          />
        </h2>
        <Reveal delay={0.16}>
          <p
            data-testid="canada-built-copy"
            className="mt-8 max-w-2xl text-base leading-relaxed text-[#4A524A] md:text-lg"
          >
            AKTIVPAL is being shaped right here at home — for people across
            Canada who want to move more, meet real people, and make the outdoors
            feel more open, social, and possible. From British Columbia outward,
            every decision is rooted in the way we explore this country.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div
              data-testid="canada-built-point-local"
              className="rounded-[1.75rem] border border-[#0F291E]/10 bg-white/70 p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 text-[#0F291E]">
                <Compass className="h-5 w-5 text-[#FF5C00]" />
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#0F291E]/60">
                  Local perspective
                </p>
              </div>
              <p className="mt-4 text-base font-medium leading-relaxed text-[#0F291E]">
                Designed around how Canadians actually explore — trails, lakes,
                ski hills, coastlines, and weekend escapes.
              </p>
            </div>
            <div
              data-testid="canada-built-point-community"
              className="rounded-[1.75rem] border border-[#0F291E]/10 bg-[#0F291E] p-6 text-[#F7F7F2] shadow-[0_24px_60px_rgba(15,41,30,0.18)]"
            >
              <div className="flex items-center gap-3 text-[#F7F7F2]">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#FF5C00]/15 text-[#FF5C00]">
                  <MapPin className="h-4 w-4" />
                </span>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#F7F7F2]/65">
                  Homegrown community
                </p>
              </div>
              <p className="mt-4 text-base font-medium leading-relaxed text-[#F7F7F2]">
                Grown from home, with community, safety, and genuine outdoor
                connection at the centre.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.18} className="relative">
        <div
          aria-hidden="true"
          className="absolute -inset-4 rounded-[2.5rem] border border-[#FF5C00]/25"
        />
        <div className="relative overflow-hidden rounded-[2.25rem] bg-[#0F291E] shadow-[0_32px_80px_rgba(15,41,30,0.18)]">
          <ParallaxImage
            src={CANADA_IMG}
            alt="Two people by a turquoise lake in the Canadian Rockies"
            className="aspect-[4/5]"
            speed={8}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0F291E] via-[#0F291E]/75 to-transparent p-6 md:p-7">
            <div
              data-testid="canada-mark"
              className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md"
            >
              <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-[#F7F7F2]">
                <img
                  src="/images/about/ca.png"
                  alt="Flag of Canada"
                  className="h-full w-full object-cover"
                />
              </span>
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#FF5C00]">
                  Canada-first
                </p>
                <p className="font-display text-lg font-extrabold tracking-tight text-[#F7F7F2]">
                  Made for the North
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
