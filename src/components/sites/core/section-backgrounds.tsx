"use client";

import { motion, useReducedMotion } from "motion/react";
import { RadialLines } from "@/components/ui/radial-lines";

/** Aurora: soft blurred blue lights drifting over noche, with a small amber glow. */
export function AuroraBackdrop() {
  const reduced = useReducedMotion();
  const blobs = [
    { c: "#0a3cff", x: "5%", y: "10%", s: "60%", d: 18, o: 0.75 },
    { c: "#3f9bff", x: "52%", y: "0%", s: "48%", d: 22, o: 0.55 },
    { c: "#dce3ff", x: "35%", y: "40%", s: "30%", d: 26, o: 0.25 },
    { c: "#0057ff", x: "18%", y: "62%", s: "52%", d: 24, o: 0.6 },
    { c: "#ffa800", x: "74%", y: "64%", s: "26%", d: 20, o: 0.35 },
  ];
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden rounded-[inherit] bg-[#000a5c]">
      {blobs.map((b, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full mix-blend-screen blur-[90px]"
          style={{ background: b.c, left: b.x, top: b.y, width: b.s, aspectRatio: "1", opacity: b.o }}
          animate={reduced ? undefined : { x: ["0%", i % 2 ? "-18%" : "16%", "0%"], y: ["0%", i % 2 ? "12%" : "-14%", "0%"], scale: [1, 1.15, 1] }}
          transition={{ duration: b.d, ease: "easeInOut", repeat: Infinity }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent,rgb(0_8_70/0.55))]" />
    </div>
  );
}

/** Radial lines: a fan of fine hielo lines over azul, fading toward the edges. */
export function RadialLinesBackdrop() {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden rounded-[inherit] bg-[radial-gradient(120%_90%_at_50%_0%,#0a1fd6_0%,#0000c8_35%,#00006b_100%)]">
      <motion.div
        className="absolute inset-[-25%]"
        animate={reduced ? undefined : { rotate: [0, 6, 0] }}
        transition={{ duration: 40, ease: "easeInOut", repeat: Infinity }}
      >
        <RadialLines lineCount={120} lineColor="#dce3ff" lineThickness={1} opacity={0.14} containerWidth="100%" containerHeight="100%" />
      </motion.div>
      <span className="absolute top-[38%] left-1/2 h-[45%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3f9bff] opacity-25 blur-[100px]" />
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_40%,transparent_30%,rgb(0_0_60/0.7))]" />
    </div>
  );
}
