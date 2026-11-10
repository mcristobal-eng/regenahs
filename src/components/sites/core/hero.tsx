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
import { SOCIO_PHOTOS } from "./assets";
import { Reveal } from "./shared";
import { WhatsAppPill } from "./whatsapp-pill";

/** Fondo del hero: foto con un zoom lento y el mismo recorte con bordes redondeados al hacer scroll. */
const HERO_VIDEOS: Record<string, string> = {
  a: "a-contable",
  b: "b-comercio",
  c: "c-oficina",
  d: "d-mix",
};

/** Test switch: ?hero=a, b, c or d plays one of the hero videos; no param keeps the photo. */
function useHeroVideo() {
  const [name, setName] = useState<string | null>(null);
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("hero") ?? "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(HERO_VIDEOS[v] ?? null);
  }, []);
  return name;
}

function HeroVideo({ name }: { name: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.load();
    v.play().catch(() => {});
  }, [name]);
  const base = `/sites/socio/hero/${name}`;
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${base}-poster.jpg`} alt="" className="absolute inset-0 size-full object-cover" />
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="auto"
        poster={`${base}-poster.jpg`}
        onPlaying={() => setPlaying(true)}
        className={cn("absolute inset-0 size-full object-cover transition-opacity duration-700", playing ? "opacity-100" : "opacity-0")}
      >
        <source media="(max-width: 767px)" src={`${base}-720.mp4`} type="video/mp4" />
        <source src={`${base}-1080.mp4`} type="video/mp4" />
      </video>
    </>
  );
}

function HeroBackground() {
  const video = useHeroVideo();
  const ref = useRef<HTMLDivElement>(null);
  const inset = useRef(24);
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

  return (
    <div ref={ref} className="absolute inset-0 -z-10" aria-hidden>
      <motion.div
        className="absolute inset-0 overflow-hidden bg-core-ink will-change-[clip-path]"
        style={reduced ? undefined : { clipPath }}
      >
        {video ? (
          <HeroVideo name={video} />
        ) : (
          <motion.img
            src={SOCIO_PHOTOS.hero}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 size-full object-cover object-[60%_40%]"
            initial={reduced ? false : { scale: 1.08 }}
            animate={reduced ? undefined : { scale: 1 }}
            transition={{ duration: 8, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
        <div className="absolute inset-0 bg-noche/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/55" />
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
      <HeroBackground />
      <div className="flex w-full flex-1 flex-col items-center justify-center pt-[4vh]">
        <Reveal delay={0.1}>
          <h1 className="max-w-6xl font-display text-[clamp(2.5rem,6vw,5.75rem)] leading-[1.02] font-semibold tracking-[-0.03em] [text-shadow:0_2px_24px_rgb(0_0_0/0.3)]">
            <span className="block">Vos atendés el negocio.</span>
            <span className="block text-balance">SOCIO factura.</span>
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
