"use client";

import { MotionConfig, motion } from "motion/react";
import { ENTER_EASE, Reveal, asset } from "./shared";

export function ProductIntro() {
  return (
    <section id="producto" className="flex scroll-mt-8 flex-col items-center px-4 pt-32 pb-4 text-center sm:pt-40">
      <MotionConfig reducedMotion="user">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: ENTER_EASE }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/brand/logo-poppins.svg")} alt="core" width={277} height={86} className="h-10 w-auto sm:h-12" />
        </motion.div>
      </MotionConfig>
      <Reveal onScroll delay={0.25} className="mt-10">
        <h2 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
          <span className="block">IA que gestiona</span>
          <span className="block">tu ganado</span>
        </h2>
      </Reveal>
    </section>
  );
}
