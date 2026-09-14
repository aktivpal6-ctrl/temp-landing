import Link from "next/link";

export function CanadaIntro() {
  return (
    <section aria-labelledby="canada-heading" className="relative z-10 bg-[#F7F7F2] px-6 py-14 md:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold text-[#4A524A]">Starting in British Columbia</p>
        <h2 id="canada-heading" className="mt-3 font-display text-3xl font-bold tracking-tight text-[#0F291E] md:text-4xl">
          Find activity partners in Canada.
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#4A524A] md:text-lg">
          AKTIVPAL is building a Canadian outdoor community for people who want to hike, run,
          walk, cycle, climb or ski together. Our starting point is British Columbia.
          Whether you are new to the area or looking for people who share your interests,
          help shape a community built around real plans and shared movement.
        </p>
        <nav aria-label="Explore AKTIVPAL" className="mt-6 flex flex-wrap gap-x-6 gap-y-4 font-semibold text-[#0F291E]">
          <Link className="underline underline-offset-4" href="/movement">Activities in British Columbia</Link>
          <Link className="underline underline-offset-4" href="/about">Why we are building AKTIVPAL</Link>
          <Link className="underline underline-offset-4" href="/waitlist">Join Canada early access</Link>
        </nav>
      </div>
    </section>
  );
}
