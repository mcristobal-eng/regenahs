"use client";

import { ImageDithering } from "@paper-design/shaders-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

const DITHER = {
  colorBack: "#000000",
  colorFront: "#ffffff",
  colorHighlight: "#ffffff",
  originalColors: true,
  inverted: false,
  type: "8x8",
  size: 1.2,
  colorSteps: 7,
  scale: 1,
  fit: "cover",
  speed: 0,
  frame: 0,
} as const;

export function CardMedia({ src, dither = true, drift = false }: { src: string; dither?: boolean; drift?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });
  const reduced = useReducedMotion();
  const drifting = drift && !reduced;
  return (
    <div ref={ref} aria-hidden className="absolute inset-0 overflow-hidden rounded-[inherit] bg-muted">
      <motion.img
        src={src}
        alt=""
        loading="lazy"
        className="absolute inset-0 size-full object-cover"
        initial={drifting ? { scale: 1.06 } : false}
        animate={drifting ? { x: ["-1.2%", "1.2%", "-1.2%"], y: ["0.4%", "-0.4%", "0.4%"], scale: 1.06 } : undefined}
        transition={drifting ? { duration: 16, ease: "easeInOut", repeat: Infinity } : undefined}
      />
      {dither && inView && (
        <ImageDithering {...DITHER} image={src} className="absolute inset-0 size-full" style={{ width: "100%", height: "100%" }} />
      )}
    </div>
  );
}
