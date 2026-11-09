"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePointer } from "./agent-character";

type Stage = {
  name: string;
  src: string;
  w: number;
  h: number;
  alt: string;
  at: { x: number; y: number };
  mobile: { x: number; y: number };
  from: { x: number; y: number };
  size: number;
  float: number;
};

const C = "/sites/socio/carpincho";

const STAGES: Stage[] = [
  { name: "Facturá", src: `${C}/sentado.webp`, w: 460, h: 783, alt: "El carpincho de SOCIO sentado, mandando un mensaje desde el celular", at: { x: 17, y: 28 }, mobile: { x: 24, y: 19 }, from: { x: -15, y: 0 }, size: 0.8, float: 3.2 },
  { name: "Cobrá", src: `${C}/contento.webp`, w: 460, h: 537, alt: "El carpincho de SOCIO contento", at: { x: 82, y: 25 }, mobile: { x: 76, y: 17 }, from: { x: 115, y: -5 }, size: 1, float: 3.8 },
  { name: "¿Quién me debe?", src: `${C}/lupa.webp`, w: 520, h: 651, alt: "El carpincho de SOCIO revisando una factura con una lupa", at: { x: 20, y: 76 }, mobile: { x: 24, y: 82 }, from: { x: -10, y: 115 }, size: 1, float: 3.5 },
  { name: "Tu tope", src: `${C}/alarmado.webp`, w: 460, h: 533, alt: "El carpincho de SOCIO alarmado", at: { x: 80, y: 75 }, mobile: { x: 76, y: 82 }, from: { x: 112, y: 112 }, size: 0.95, float: 4.1 },
];

function Carpincho({
  stage,
  index,
  progress,
  pointerX,
  pointerY,
  mobile,
}: {
  stage: Stage;
  index: number;
  progress: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  mobile: boolean;
}) {
  const at = mobile ? stage.mobile : stage.at;
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const start = 0.3 + 0.07 * index;
  const t = useTransform(progress, (p) => 1 - Math.pow(1 - Math.min(1, Math.max(0, (p - start) / 0.32)), 3));
  const left = useTransform(t, (v) => `${stage.from.x + (at.x - stage.from.x) * v}%`);
  const top = useTransform(t, (v) => `${stage.from.y + (at.y - stage.from.y) * v}%`);
  const enterRotate = useTransform(t, (v) => (1 - v) * (index % 2 ? 24 : -24));
  const scale = useTransform(t, (v) => 0.7 + 0.3 * v);
  const labelOpacity = useTransform(t, [0.7, 1], [0, 1]);

  // Lean toward the pointer, like the original characters looking at it.
  const tiltTarget = useMotionValue(0);
  const shiftTarget = useMotionValue(0);
  const tilt = useSpring(tiltTarget, { stiffness: 120, damping: 14 });
  const shift = useSpring(shiftTarget, { stiffness: 120, damping: 16 });
  useEffect(() => {
    if (reduced) return;
    const update = () => {
      const el = ref.current;
      const px = pointerX.get();
      if (!el || px < 0) return;
      const r = el.getBoundingClientRect();
      const dx = px - (r.left + r.width / 2);
      const dy = pointerY.get() - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, 320 / d);
      tiltTarget.set((dx / d) * 7 * k);
      shiftTarget.set((dx / d) * 8 * k);
    };
    const offX = pointerX.on("change", update);
    const offY = pointerY.on("change", update);
    return () => {
      offX();
      offY();
    };
  }, [pointerX, pointerY, reduced, tiltTarget, shiftTarget]);
  const rotate = useTransform([enterRotate, tilt], ([a, b]: number[]) => a + b);

  return (
    <motion.div
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 sm:gap-3"
      style={{ left, top, rotate, scale, width: `calc(clamp(84px, 13vw, 200px) * ${stage.size})` }}
    >
      <motion.div
        ref={ref}
        className="w-full"
        style={{ x: shift, transformOrigin: "50% 100%" }}
        animate={reduced ? undefined : { y: ["0%", "-4%", "0%"], scaleY: [1, 1.02, 1] }}
        transition={{ duration: stage.float, ease: "easeInOut", repeat: Infinity }}
        whileHover={reduced ? undefined : { y: "-10%", scale: 1.04 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={stage.src} alt={stage.alt} width={stage.w} height={stage.h} loading="lazy" draggable={false} className="h-auto w-full select-none" />
      </motion.div>
      <motion.span
        className="rounded-full bg-hielo px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap text-azul sm:px-3 sm:py-1 sm:text-sm"
        style={{ opacity: labelOpacity }}
      >
        {stage.name}
      </motion.span>
    </motion.div>
  );
}

export function AgentsSection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const progress = useTransform(scrollYProgress, (p) => (reduced ? 1 : p));
  const opacity = useTransform(progress, [0.12, 0.42], [0, 1]);
  const filter = useTransform(progress, [0.12, 0.42], ["blur(10px)", "blur(0px)"]);
  const y = useTransform(progress, [0.12, 0.42], [30, 0]);
  const pointer = usePointer();
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section ref={ref} id="que-hace" aria-label="Qué hace SOCIO" className="relative h-[240vh] bg-background">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <motion.div className="flex flex-col items-center text-center" style={{ opacity, filter, y }}>
            <h2 className="max-w-[14ch] font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance sm:max-w-[18ch]">
              Facturá, cobrá y sabé quién te debe, sin salir de WhatsApp
            </h2>
            <p className="mt-5 max-w-md text-base text-pretty text-muted-foreground sm:text-lg">
              Todo pasa en el chat que ya usás. Conectás Mercado Pago una vez y cada cobro entra solo.
            </p>
          </motion.div>
        </div>
        {STAGES.map((stage, i) => (
          <Carpincho key={stage.name} stage={stage} index={i} progress={progress} pointerX={pointer.x} pointerY={pointer.y} mobile={mobile} />
        ))}
      </div>
    </section>
  );
}
