"use client";

import { MotionConfig, motion } from "motion/react";
import { ENTER_EASE, Reveal } from "./shared";
import { Wordmark } from "./wordmark";

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
          <Wordmark className="text-[44px] sm:text-[56px]" />
        </motion.div>
      </MotionConfig>
      <Reveal onScroll delay={0.25} className="mt-10">
        <h2 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
          <span className="block">Un mensaje, una</span>
          <span className="block">confirmación y listo</span>
        </h2>
      </Reveal>
    </section>
  );
}
