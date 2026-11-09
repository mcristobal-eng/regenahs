"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  CircleCheck,
  FileText,
  HandCoins,
  Landmark,
  ListChecks,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Reveal, asset } from "./shared";
import { WhatsAppPill } from "./whatsapp-pill";

const VIDEO_FILTER = "[filter:brightness(1.08)_saturate(1.12)_sepia(0.18)_hue-rotate(-6deg)]";

function HeroVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inset = useRef(24);
  const [load, setLoad] = useState(false);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useTransform(scrollYProgress, [0, 0.35], [0, 1], { clamp: true });
  const clipPath = useTransform(p, (v) => {
    const i = (v * inset.current).toFixed(1);
    const r = (28 * v).toFixed(1);
    return `inset(${i}px ${i}px ${i}px ${i}px round ${r}px)`;
  });

  useEffect(() => {
    const onResize = () => {
      inset.current = window.innerWidth < 640 ? 12 : 24;
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (prefersReduced || saveData) return;
    const start = () => setLoad(true);
    if (document.readyState === "complete") {
      start();
      return;
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (load && video) {
      video.load();
      video.play().catch(() => {});
    }
  }, [load]);

  return (
    <div ref={ref} className="absolute inset-0 -z-10" aria-hidden>
      <motion.div
        className="absolute inset-0 overflow-hidden bg-core-ink will-change-[clip-path]"
        style={reduced ? undefined : { clipPath }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/video/hero-poster.jpg")} alt="" fetchPriority="high" className={cn("absolute inset-0 size-full object-cover", VIDEO_FILTER)} />
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          onPlaying={() => setPlaying(true)}
          className={cn("absolute inset-0 size-full object-cover transition-opacity duration-700", VIDEO_FILTER, playing ? "opacity-100" : "opacity-0")}
        >
          {load && <source media="(max-width: 767px)" src={asset("/video/hero-720.mp4")} type="video/mp4" />}
          {load && <source src={asset("/video/hero-1080.mp4")} type="video/mp4" />}
        </video>
        <div className="absolute inset-0 bg-core-orange/15 mix-blend-soft-light" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/40" />
      </motion.div>
    </div>
  );
}

const TICKER = [
  { icon: FileText, text: "Factura C a Martina López por $45.000 · Emitida en ARCA" },
  { icon: HandCoins, text: "Entró $32.000 de Lucía Gómez · Mercado Pago, ¿la facturamos?" },
  { icon: Landmark, text: "Entró $18.500 de Diego · Transferencia anotada" },
  { icon: CircleCheck, text: "García pagó $45.000 · Factura 0001-128 cobrada" },
  { icon: ListChecks, text: "Te deben $120.000 entre García, López y Taller Ruiz" },
  { icon: TriangleAlert, text: "Te acercás al tope de tu categoría · Te avisamos a tiempo" },
];

function AgentTicker({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % TICKER.length), 4500);
    return () => window.clearInterval(id);
  }, []);
  const item = TICKER[index];
  const Icon = item.icon;
  return (
    <div className={cn("relative flex h-14 w-full items-center justify-center overflow-hidden sm:h-8", className)}>
      <AnimatePresence initial={false}>
        <motion.p
          key={index}
          className="absolute inset-0 mx-auto flex w-fit max-w-full items-center gap-2 text-base sm:text-lg"
          initial={reduced ? { opacity: 0 } : { y: "100%" }}
          animate={reduced ? { opacity: 1 } : { y: "0%" }}
          exit={reduced ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.45, 0, 0.25, 1] }}
        >
          <Icon className="size-[1.1em] shrink-0" aria-hidden />
          <span className="min-w-0 text-left text-balance sm:truncate">{item.text}</span>
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col items-center px-4 pt-20 pb-6 text-center text-white sm:pb-8">
      <HeroVideo />
      <div className="flex w-full flex-1 flex-col items-center justify-center pt-[4vh]">
        <Reveal delay={0.1}>
          <h1 className="max-w-6xl font-display text-[clamp(2.5rem,6vw,5.75rem)] leading-[1.02] font-semibold tracking-[-0.03em] [text-shadow:0_2px_24px_rgb(0_0_0/0.3)]">
            <span className="block">Tus facturas,</span>
            <span className="block text-balance">por WhatsApp</span>
          </h1>
        </Reveal>
        <Reveal delay={0.25} className="mt-10 flex w-full max-w-xl flex-col items-center gap-1 [text-shadow:0_1px_10px_rgb(0_0_0/0.45)]">
          <p className="text-base sm:text-lg">SOCIO, tu asistente de administración en WhatsApp</p>
          <AgentTicker className="text-white/65" />
        </Reveal>
      </div>
      <Reveal delay={0.4} className="mt-12 flex w-full justify-center">
        <WhatsAppPill />
      </Reveal>
    </section>
  );
}
