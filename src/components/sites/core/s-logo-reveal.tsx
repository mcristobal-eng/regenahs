"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/** SOCIO "S", from the brand manual (viewBox 0 0 510 520). */
const S_PATH =
  "M261,512 C410,512 482,447 482,357 C482,274 433,239 346,218 L230,187 C192,178 174,166 174,140 C174,111 207,94 254,94 C310,94 338,118 337,161 L474,161 C469,40 363,3 261,3 C137,3 41,55 41,155 C41,239 94,271 183,293 L279,317 C332,331 348,344 348,370 C348,401 318,421 266,421 C201,421 172,384 170,344 L29,344 C35,440 105,512 261,512 Z";

/* One 4 s timeline, shared by every layer:
   0–0.6 s  a milky glass droplet grows
   0.6–1.4 s it spreads into the rounded blue tile and the S appears
   1.4–2.6 s a light sweeps across the glass
   2.6–3.4 s the glass melts away, the S turns brand blue and the ring draws around it */
const CSS = `
.slr { --d: 4s; --e: cubic-bezier(.22,1,.36,1); }
.slr-tile { opacity: 0; transform: scale(.18); border-radius: 50%; }
.slr-milk { opacity: .9; }
.slr-sweep { transform: translateX(-70%) rotate(24deg); }
.slr-s { opacity: 0; transform: scale(.6); fill: #fff; stroke: #fff; }
.slr-ring { stroke-dasharray: 1700; stroke-dashoffset: 1700; }
.slr.play .slr-tile { animation: slr-tile var(--d) var(--e) forwards; }
.slr.play .slr-milk { animation: slr-milk var(--d) ease-out forwards; }
.slr.play .slr-sweep { animation: slr-sweep var(--d) ease-in-out forwards; }
.slr.play .slr-s { animation: slr-s var(--d) var(--e) forwards; }
.slr.play .slr-ring { animation: slr-ring var(--d) var(--e) forwards; }
@keyframes slr-tile {
  0%   { opacity: 0; transform: scale(.18); border-radius: 50%; filter: blur(4px); }
  14%  { opacity: 1; transform: scale(.62); border-radius: 50%; filter: blur(0); }
  34%  { opacity: 1; transform: scale(1);   border-radius: 28%; filter: blur(0); }
  64%  { opacity: 1; transform: scale(1);   border-radius: 28%; filter: blur(0); }
  84%  { opacity: 0; transform: scale(1.08); border-radius: 36%; filter: blur(12px); }
  100% { opacity: 0; transform: scale(1.08); border-radius: 36%; filter: blur(12px); }
}
@keyframes slr-milk { 0% { opacity: .9; } 30% { opacity: .35; } 45%, 100% { opacity: 0; } }
@keyframes slr-sweep {
  0%, 36% { transform: translateX(-70%) rotate(24deg); }
  64%, 100% { transform: translateX(70%) rotate(24deg); }
}
@keyframes slr-s {
  0%, 20% { opacity: 0; transform: scale(.6); fill: #fff; stroke: #fff; }
  36%     { opacity: 1; transform: scale(1);  fill: #fff; stroke: #fff; }
  66%     { opacity: 1; transform: scale(1);  fill: #fff; stroke: #fff; }
  80%, 100% { opacity: 1; transform: scale(1); fill: #0000c8; stroke: #0000c8; }
}
@keyframes slr-ring { 0%, 66% { stroke-dashoffset: 1700; } 92%, 100% { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) {
  .slr .slr-tile { animation: none !important; opacity: 0; }
  .slr .slr-s { animation: none !important; opacity: 1; transform: none; fill: #0000c8; stroke: #0000c8; }
  .slr .slr-ring { animation: none !important; stroke-dashoffset: 0; }
}
`;

/** The SOCIO mark forming: glass droplet → blue tile with the S → glass melts, ring draws. */
export function SLogoReveal({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <div ref={ref} className={cn("slr relative aspect-square", inView && "play", className)} role="img" aria-label="SOCIO">
      <style>{CSS}</style>
      <div
        aria-hidden
        className="slr-tile absolute inset-[6%] overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 90% at 28% 18%, rgb(255 255 255 / 0.55), transparent 42%), linear-gradient(150deg, #3d4bff 0%, #0000c8 48%, #00006b 100%)",
          boxShadow:
            "inset 0 2px 0 rgb(255 255 255 / 0.6), inset 0 -10px 24px rgb(0 0 60 / 0.55), inset 3px 0 6px rgb(255 120 120 / 0.35), inset -3px 0 6px rgb(120 200 255 / 0.45), 0 30px 60px -24px rgb(0 0 120 / 0.55)",
        }}
      >
        <span className="slr-milk absolute inset-0 bg-white/60" />
        <span className="slr-sweep absolute -inset-1/2 bg-[linear-gradient(90deg,transparent_42%,rgb(255_255_255/0.55)_50%,transparent_58%)]" />
      </div>
      <svg viewBox="0 0 640 640" className="absolute inset-0 size-full overflow-visible" aria-hidden>
        <circle className="slr-ring" cx="320" cy="320" r="268" fill="none" stroke="#0000c8" strokeWidth="44" strokeLinecap="round" transform="rotate(-90 320 320)" />
        <g className="slr-s" style={{ transformOrigin: "320px 320px" }}>
          <path d={S_PATH} strokeWidth="16" transform="translate(167.3 166.4) scale(0.6)" />
        </g>
      </svg>
    </div>
  );
}
