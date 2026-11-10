"use client";

import { GlassIconReveal } from "@/components/ui/liquid-glass-logo-reveal";

/** SOCIO mark: the S from the brand manual inside its ring, on a 640×640 canvas. */
const SOCIO_MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><circle cx="320" cy="320" r="268" fill="none" stroke="currentColor" stroke-width="44"/><path fill="currentColor" stroke="currentColor" stroke-width="16" transform="translate(167.3 166.4) scale(0.6)" d="M261,512 C410,512 482,447 482,357 C482,274 433,239 346,218 L230,187 C192,178 174,166 174,140 C174,111 207,94 254,94 C310,94 338,118 337,161 L474,161 C469,40 363,3 261,3 C137,3 41,55 41,155 C41,239 94,271 183,293 L279,317 C332,331 348,344 348,370 C348,401 318,421 266,421 C201,421 172,384 170,344 L29,344 C35,440 105,512 261,512 Z"/></svg>`;

/** The SOCIO "S" forming in liquid glass, painted on the page's hueso background. Click replays it. */
export function SLogoReveal({ className }: { className?: string }) {
  return (
    <GlassIconReveal
      logo={SOCIO_MARK}
      label="SOCIO"
      look="light"
      background="#eeeee9"
      logoColor="#0000c8"
      logoScale={0.62}
      finalScale={0.9}
      loop={false}
      className={className}
      tuning={{ startZoom: 2.3 }}
    />
  );
}
