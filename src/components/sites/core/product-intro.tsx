"use client";

import { Reveal } from "./shared";
import { SLogoReveal } from "./s-logo-reveal";

export function ProductIntro() {
  return (
    <section id="producto" className="flex scroll-mt-8 flex-col items-center px-4 pt-12 pb-4 text-center sm:pt-16">
      <SLogoReveal className="h-72 w-full max-w-md sm:h-[28rem]" />
      <Reveal onScroll delay={0.4} className="relative z-10 -mt-6 sm:-mt-10">
        <h2 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
          <span className="block">Un mensaje, una</span>
          <span className="block">confirmación y listo</span>
        </h2>
      </Reveal>
    </section>
  );
}
