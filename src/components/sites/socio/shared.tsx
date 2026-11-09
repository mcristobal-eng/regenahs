"use client";

import { MotionConfig, motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const ENTER_EASE = [0.22, 1, 0.36, 1] as const;
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const smoothstep = (t: number) => t * t * (3 - 2 * t);

export function Reveal({
  children,
  delay = 0,
  distance = 24,
  onScroll = false,
  className,
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  onScroll?: boolean;
  className?: string;
}) {
  const shown = { opacity: 1, y: 0 };
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: distance }}
        {...(onScroll ? { whileInView: shown, viewport: { once: true, amount: 0.4 } } : { animate: shown })}
        transition={{ delay, duration: 0.8, ease: ENTER_EASE }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}

/** Etiqueta del manual: mono 13 · +8 % · mayúsculas. */
export function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("label-mono", className)}>{children}</span>;
}

export { buttonClass } from "./button-class";

export function IsoMark({ className, tone = "azul" }: { className?: string; tone?: "azul" | "hueso" }) {
  const c = tone === "azul" ? "var(--azul)" : "var(--hueso)";
  return (
    <svg viewBox="0 0 640 640" className={className} aria-hidden>
      <circle cx="320" cy="320" r="268" fill="none" stroke={c} strokeWidth="44" />
      <g transform="translate(167.3 166.4) scale(0.6)">
        <path
          fill={c}
          stroke={c}
          strokeWidth="16"
          d="M261,512 C410,512 482,447 482,357 C482,274 433,239 346,218 L230,187 C192,178 174,166 174,140 C174,111 207,94 254,94 C310,94 338,118 337,161 L474,161 C469,40 363,3 261,3 C137,3 41,55 41,155 C41,239 94,271 183,293 L279,317 C332,331 348,344 348,370 C348,401 318,421 266,421 C201,421 172,384 170,344 L29,344 C35,440 105,512 261,512 Z"
        />
      </g>
    </svg>
  );
}

export function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
