"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CARPINCHO } from "./assets";
import { Label } from "./shared";

type Pose = keyof typeof CARPINCHO;

type Point = { x: number; y: number };
const CREW: { pose: Pose; at: Point; mobile: Point; from: Point; size: number }[] = [
  { pose: "lupa", at: { x: 16, y: 30 }, mobile: { x: 18, y: 12 }, from: { x: -20, y: 10 }, size: 1.05 },
  { pose: "contento", at: { x: 84, y: 26 }, mobile: { x: 80, y: 11 }, from: { x: 120, y: -10 }, size: 0.9 },
  { pose: "curioso", at: { x: 18, y: 78 }, mobile: { x: 20, y: 90 }, from: { x: -15, y: 120 }, size: 0.85 },
  { pose: "alarmado", at: { x: 82, y: 76 }, mobile: { x: 80, y: 90 }, from: { x: 118, y: 118 }, size: 0.85 },
];

const VALUES = [
  ["01", "Cercano", "Habla como vos, en el chat que ya usás todos los días."],
  ["02", "Confiable", "Nada se emite sin tu aprobación. Facturas oficiales."],
  ["03", "Simple", "Un mensaje y un sí. Sin apps, sin planillas."],
] as const;

function Flyer({ item, index, progress, mobile }: { item: (typeof CREW)[number]; index: number; progress: MotionValue<number>; mobile: boolean }) {
  const reduced = useReducedMotion();
  const at = mobile ? item.mobile : item.at;
  const start = 0.28 + 0.07 * index;
  const t = useTransform(progress, (p) => 1 - Math.pow(1 - clamp01((p - start) / 0.32), 3));
  const left = useTransform(t, (v) => `${item.from.x + (at.x - item.from.x) * v}%`);
  const top = useTransform(t, (v) => `${item.from.y + (at.y - item.from.y) * v}%`);
  const rotate = useTransform(t, (v) => (1 - v) * (index % 2 ? 20 : -20));
  const scale = useTransform(t, (v) => 0.75 + 0.25 * v);
  const img = CARPINCHO[item.pose];
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left, top, rotate, scale, width: `calc(clamp(88px, 14vw, 220px) * ${item.size})` }}
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 3.4 + index * 0.4, ease: "easeInOut", repeat: Infinity }}
        whileHover={reduced ? undefined : { y: -16, rotate: index % 2 ? 4 : -4 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.src} alt={img.alt} width={img.w} height={img.h} loading="lazy" className="h-auto w-full" />
      </motion.div>
    </motion.div>
  );
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function MascotSection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const progress = useTransform(scrollYProgress, (p) => (reduced ? 1 : p));
  const opacity = useTransform(progress, [0.12, 0.42], [0, 1]);
  const filter = useTransform(progress, [0.12, 0.42], ["blur(10px)", "blur(0px)"]);
  const y = useTransform(progress, [0.12, 0.42], [30, 0]);
  const valuesOpacity = useTransform(progress, [0.55, 0.8], [0, 1]);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section ref={ref} aria-label="El socio" className="relative h-[240vh] bg-hueso text-azul">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-6">
          <motion.div className="flex flex-col items-center text-center" style={{ opacity, filter, y }}>
            <Label>(03) Tu socio</Label>
            <h2 className="mt-5 max-w-[16ch] text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] font-extrabold tracking-[-0.05em]">
              Un socio que entiende de números y habla tu idioma.
            </h2>
          </motion.div>
          <motion.dl className="grid max-w-3xl gap-3 sm:grid-cols-3 sm:gap-8" style={{ opacity: valuesOpacity }}>
            {VALUES.map(([n, title, text]) => (
              <div key={n} className="border-t border-azul pt-3">
                <dt className="flex items-baseline gap-2">
                  <span className="font-mono text-xs">{n}</span>
                  <span className="text-xl font-extrabold tracking-[-0.02em]">{title}</span>
                </dt>
                <dd className="mt-1 text-[15px] leading-snug text-azul/80">{text}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
        {CREW.map((item, i) => (
          <Flyer key={item.pose} item={item} index={i} progress={progress} mobile={mobile} />
        ))}
      </div>
    </section>
  );
}
