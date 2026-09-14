import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import { MaskedLines, Reveal } from "@/components/about/motion";

const LAKE_IMG = "/images/about/photo-1464822759023-fed622ff2c3b.jpeg";

export const Closing = () => (
  <section
    data-testid="closing-cta"
    className="relative overflow-hidden bg-[#0F291E] py-28 md:py-40"
  >
    <Image
      src={LAKE_IMG}
      alt=""
      aria-hidden="true"
      fill
      sizes="100vw"
      className="object-cover opacity-[0.15]"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-[#0F291E] via-[#0F291E]/70 to-[#0F291E]" />
    <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center">
      <h2 className="font-display text-5xl font-black leading-[1.02] tracking-tight text-[#F7F7F2] sm:text-6xl md:text-7xl">
        <MaskedLines lines={["Movement is", "better together."]} />
      </h2>
      <Reveal delay={0.2} className="mt-10">
        <Link
          data-testid="join-movement-cta"
          href="/waitlist"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF5C00] px-7 py-4 font-display text-sm font-bold tracking-tight text-white transition-colors hover:bg-[#e64f00] focus:outline-none focus:ring-2 focus:ring-[#FF5C00]/50 md:text-base"
        >
          JOIN THE MOVEMENT
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Reveal>
      <Reveal delay={0.3}>
        <p className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#F7F7F2]/60">
          <MapPin className="h-4 w-4 text-[#FF5C00]" />
          Starting in British Columbia, Canada
        </p>
      </Reveal>
    </div>
  </section>
);
