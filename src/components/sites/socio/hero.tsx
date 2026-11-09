"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CARPINCHO } from "./assets";
import { ENTER_EASE, Label, Reveal, buttonClass } from "./shared";

const TICKER = [
  "Factura C · Taller Ramírez · $45.000 · emitida en ARCA",
  "Presupuesto · Lucía Gómez · $120.000 · enviado",
  "Factura C · Estudio Prado · $86.500 · esperando tu sí",
  "Resumen de octubre · 14 facturas · $612.300",
  "Recordatorio · cobrarle a Pérez el viernes",
];

function Ticker() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % TICKER.length), 3800);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="relative h-6 w-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.p
          key={i}
          className="absolute inset-0 flex items-center gap-2 font-mono text-[13px] tracking-[0.02em] text-azul/80"
          initial={reduced ? { opacity: 0 } : { y: "100%" }}
          animate={reduced ? { opacity: 1 } : { y: "0%" }}
          exit={reduced ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.45, 0, 0.25, 1] }}
        >
          <span className="size-1.5 shrink-0 rounded-full bg-azul" aria-hidden />
          <span className="truncate">{TICKER[i]}</span>
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mascotY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 120]);
  const img = CARPINCHO.pensando;

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-hueso px-4 pt-28 pb-16 text-azul sm:px-6 lg:min-h-svh lg:pt-32">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:min-h-[calc(100svh-12rem)] lg:grid-cols-[1.25fr_0.75fr]">
        <div className="flex flex-col items-start">
          <Reveal delay={0.05}>
            <Label>Asistente administrativo en WhatsApp</Label>
          </Reveal>
          <Reveal delay={0.12}>
            <h1 className="mt-6 text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.88] font-extrabold tracking-[-0.055em]">
              Tus facturas, por WhatsApp.
            </h1>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="mt-8 max-w-xl text-[17px] leading-[1.5]">
              SOCIO arma tu factura, te la muestra y la emite en ARCA solo cuando vos le decís que sí.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-8 flex flex-wrap gap-3">
            <a href="#contacto" className={buttonClass("ambar")}>
              Empezar gratis
            </a>
            <a href="#como-funciona" className={buttonClass("borde")}>
              Ver cómo funciona
            </a>
          </Reveal>
          <Reveal delay={0.4} className="mt-10 w-full max-w-md border-t border-azul pt-4">
            <Ticker />
          </Reveal>
        </div>
        <motion.div
          className="relative mx-auto w-[min(72vw,360px)] lg:w-full lg:max-w-[440px]"
          initial={{ opacity: 0, y: 40, rotate: -4 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: ENTER_EASE }}
          style={{ y: mascotY }}
        >
          <motion.div
            animate={reduced ? undefined : { y: [0, -10, 0], rotate: [0, -1.5, 0] }}
            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt} width={img.w} height={img.h} fetchPriority="high" className="h-auto w-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
