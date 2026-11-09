"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { CardMedia } from "./card-media";
import { asset } from "./shared";

export type SectionBackground = "cielo" | "aurora" | "puntos" | "lineas" | "malla";

/** Whether text on top of each background should be light or dark. */
export const BACKGROUND_TONE: Record<SectionBackground, "light" | "dark"> = {
  cielo: "light",
  aurora: "light",
  puntos: "dark",
  lineas: "light",
  malla: "light",
};

/** 1. Aurora: soft blurred lights drifting over noche. */
function Aurora() {
  const reduced = useReducedMotion();
  const blobs = [
    { c: "#0000c8", x: "10%", y: "15%", s: "60%", d: 18 },
    { c: "#dce3ff", x: "55%", y: "5%", s: "45%", d: 22 },
    { c: "#ffa800", x: "70%", y: "60%", s: "35%", d: 20 },
    { c: "#3b3bff", x: "20%", y: "65%", s: "50%", d: 24 },
  ];
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden rounded-[inherit] bg-noche">
      {blobs.map((b, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full opacity-60 mix-blend-screen blur-[90px]"
          style={{ background: b.c, left: b.x, top: b.y, width: b.s, aspectRatio: "1" }}
          animate={reduced ? undefined : { x: ["0%", i % 2 ? "-18%" : "16%", "0%"], y: ["0%", i % 2 ? "12%" : "-14%", "0%"], scale: [1, 1.15, 1] }}
          transition={{ duration: b.d, ease: "easeInOut", repeat: Infinity }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent,rgb(0_0_60/0.55))]" />
    </div>
  );
}

/** 2. Puntos: dot grid on hueso, fading out from the center, with a slow glow. */
function Puntos() {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden rounded-[inherit] bg-hielo">
      <div className="absolute inset-0 bg-[radial-gradient(rgb(0_0_200/0.28)_1.2px,transparent_1.2px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,#000_40%,transparent_100%)]" />
      <motion.span
        className="absolute top-1/3 left-1/2 h-[60%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-hueso blur-[80px]"
        animate={reduced ? undefined : { opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
      />
    </div>
  );
}

/** 3. Líneas: flowing curves drawn across noche, like signals moving. */
function Lineas() {
  const ref = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();
  // Curves that sweep from the lower left to the upper right, fanned out.
  const paths = Array.from({ length: 22 }, (_, i) => {
    const o = (i - 11) * 16;
    return `M-60 ${300 + o}C 160 ${300 + o} 220 ${120 + o * 0.6} 360 ${150 + o * 0.5}S 600 ${30 + o * 0.3} 760 ${10 + o * 0.25}`;
  });
  useEffect(() => {
    if (reduced) return;
    const svg = ref.current;
    if (!svg) return;
    const els = [...svg.querySelectorAll("path")];
    const anims = els.map((el, i) => {
      const len = el.getTotalLength();
      el.style.strokeDasharray = `${len * 0.35} ${len * 0.65}`;
      return el.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 9000 + i * 420, iterations: Infinity, easing: "linear" });
    });
    return () => anims.forEach((a) => a.cancel());
  }, [reduced]);
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden rounded-[inherit] bg-noche">
      <svg ref={ref} className="absolute inset-0 size-full" viewBox="0 0 696 316" preserveAspectRatio="xMidYMid slice" fill="none">
        {paths.map((d, i) => (
          <path key={i} d={d} stroke={i % 7 === 3 ? "#ffa800" : "#dce3ff"} strokeOpacity={0.18 + (i / paths.length) * 0.4} strokeWidth={0.6 + i * 0.04} />
        ))}
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_40%,transparent,rgb(0_0_60/0.6))]" />
    </div>
  );
}

/** 4. Malla: animated mesh gradient shader in the brand colors, with grain. */
function Malla() {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden rounded-[inherit] bg-azul">
      <MeshGradient
        colors={["#00006b", "#0000c8", "#3d4bff", "#dce3ff", "#ffa800"]}
        distortion={0.8}
        swirl={0.35}
        grainMixer={0.1}
        grainOverlay={0.12}
        speed={reduced ? 0 : 0.25}
        className="absolute inset-0 size-full"
        style={{ width: "100%", height: "100%" }}
      />
      <div className="absolute inset-0 bg-noche/25" />
    </div>
  );
}

export function SectionBackdrop({ variant }: { variant: SectionBackground }) {
  switch (variant) {
    case "aurora":
      return <Aurora />;
    case "puntos":
      return <Puntos />;
    case "lineas":
      return <Lineas />;
    case "malla":
      return <Malla />;
    default:
      return <CardMedia src={asset("/images/producto/cielo.jpg")} dither={false} drift />;
  }
}
