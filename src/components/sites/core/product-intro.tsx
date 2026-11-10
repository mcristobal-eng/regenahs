"use client";

import { Reveal } from "./shared";
import { SLogoReveal } from "./s-logo-reveal";

export function ProductIntro() {
  return (
    <section id="producto" className="flex scroll-mt-8 flex-col items-center px-4 pt-32 pb-4 text-center sm:pt-40">
      <SLogoReveal className="w-28 sm:w-36" />
      <Reveal onScroll delay={0.4} className="mt-10">
        <h2 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
          <span className="block">Un mensaje, una</span>
          <span className="block">confirmación y listo</span>
        </h2>
      </Reveal>
    </section>
  );
}
