"use client";

import { MotionConfig, motion } from "motion/react";
import type { ReactNode } from "react";

export { ASSET, asset } from "./assets";

export const ENTER_DURATION = 0.8;
export const ENTER_EASE = [0.22, 1, 0.36, 1] as const;

export const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));
export const smoothstep = (t: number) => t * t * (3 - 2 * t);

type RevealProps = {
  children: ReactNode;
  from?: "bottom" | "top";
  delay?: number;
  distance?: number;
  onScroll?: boolean;
  className?: string;
};

export function Reveal({
  children,
  from = "bottom",
  delay = 0,
  distance = 24,
  onScroll = false,
  className,
}: RevealProps) {
  const shown = { opacity: 1, y: 0 };
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: from === "top" ? -distance : distance }}
        {...(onScroll
          ? { whileInView: shown, viewport: { once: true, amount: 0.4 } }
          : { animate: shown })}
        transition={{ delay, duration: ENTER_DURATION, ease: ENTER_EASE }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}

export function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/", Icon: InstagramIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/", Icon: LinkedInIcon },
];
