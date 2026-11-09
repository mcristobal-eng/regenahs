"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Check, LoaderCircle } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/utils";
import { CARPINCHO } from "./assets";
import { ChatDemo } from "./chat-demo";
import { IsoMark, Label, Reveal, clamp, smoothstep } from "./shared";

/* ---------- Tarjeta 1: el mensaje ---------- */

function MessageVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  const full = "Le cobré $45.000 a Taller Ramírez, service completo";
  const [n, setN] = useState(reduced ? full.length : 0);
  useEffect(() => {
    if (!inView || reduced) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setN(i);
      if (i >= full.length) window.clearInterval(id);
    }, 45);
    return () => window.clearInterval(id);
  }, [inView, reduced]);
  const img = CARPINCHO.sentado;
  return (
    <div ref={ref} className="relative flex size-full items-end justify-center gap-6 px-4 pb-0 sm:px-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img.src} alt={img.alt} width={img.w} height={img.h} className="h-[86%] w-auto shrink-0 self-end" />
      <div className="mb-[18%] flex max-w-[340px] flex-1 flex-col gap-2">
        <span className="font-mono text-xs text-azul/70">Vos · ahora</span>
        <p className="min-h-[3.2em] rounded-2xl rounded-br-md bg-azul px-4 py-3 text-[15px] leading-snug text-hueso sm:text-[17px]">
          {full.slice(0, n)}
          {n < full.length && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-hueso" />}
        </p>
      </div>
    </div>
  );
}

/* ---------- Tarjeta 2: SOCIO arma la factura ---------- */

const STEPS = [
  ["Cliente", "Taller Ramírez"],
  ["Concepto", "Service completo"],
  ["Monto", "$45.000"],
  ["Comprobante", "Factura C"],
] as const;

function InvoiceVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  const [done, setDone] = useState(reduced ? STEPS.length : 0);
  useEffect(() => {
    if (!inView || reduced) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setDone(i);
      if (i > STEPS.length + 3) {
        i = 0;
        setDone(0);
      }
    }, 900);
    return () => window.clearInterval(id);
  }, [inView, reduced]);
  return (
    <div ref={ref} className="w-full max-w-[400px] rounded-2xl bg-hueso p-5 text-azul shadow-[0_30px_60px_-24px_rgb(0_0_40/0.6)]">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.08em] uppercase">Borrador · Factura C</span>
        <IsoMark className="size-6" />
      </div>
      <p className="mt-3 text-[40px] leading-none font-extrabold tracking-[-0.04em]">{done >= 3 ? "$45.000" : "$ —"}</p>
      <ul className="mt-4 flex flex-col border-t border-azul/20">
        {STEPS.map(([k, v], i) => (
          <li key={k} className="flex items-center gap-3 border-b border-azul/20 py-2.5 text-sm">
            <span className="w-28 shrink-0 text-azul/70">{k}</span>
            <AnimatePresence mode="wait" initial={false}>
              {done > i ? (
                <motion.span key="v" className="flex-1 truncate font-semibold" initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
                  {v}
                </motion.span>
              ) : (
                <motion.span key="e" className="h-2 flex-1 rounded-full bg-azul/10" exit={{ opacity: 0 }} />
              )}
            </AnimatePresence>
            {done > i ? <Check className="size-4 shrink-0" aria-hidden /> : done === i ? <LoaderCircle className="size-4 shrink-0 animate-spin" aria-hidden /> : <span className="size-4" />}
          </li>
        ))}
      </ul>
      <p className="mt-3 font-mono text-xs text-azul/70">{done >= STEPS.length ? "Listo para revisar" : "Leyendo tu mensaje…"}</p>
    </div>
  );
}

/* ---------- Tarjeta 3: nada se emite sin tu sí ---------- */

const ExpandContext = createContext<MotionValue<number> | null>(null);

const NOTES = [
  { title: "¿La emito en ARCA?", body: "Factura C · Taller Ramírez · $45.000" },
  { title: "Emitida en ARCA", body: "Factura C 0001-00000123 · PDF listo" },
  { title: "¿La emito en ARCA?", body: "Factura C · Estudio Prado · $86.500" },
  { title: "Presupuesto visto", body: "Lucía Gómez abrió tu presupuesto" },
];
const AGO = ["ahora", "hace 5 min", "hace 1 h"];

function ApprovalVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(1);
  const ctx = useContext(ExpandContext);
  const fallback = useMotionValue(0);
  const expand = ctx ?? fallback;
  const opacity = useTransform(expand, [0, 0.45], [1, 0]);
  const y = useTransform(expand, (e) => `${-26 * clamp((e - 0.1) / 0.9)}vh`);
  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(() => setCount((c) => c + 1), 2800);
    return () => window.clearInterval(id);
  }, [inView, reduced]);
  const total = reduced ? 3 : count;
  const stack = Array.from({ length: Math.min(total, 3) }, (_, i) => {
    const key = total - 1 - i;
    return { key, note: NOTES[key % NOTES.length], depth: i };
  });
  return (
    <div ref={ref} className="absolute inset-0 text-hueso">
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <motion.div className="w-[min(92%,420px)]" style={{ y, opacity }}>
          <p className="mb-3 px-1 font-mono text-xs tracking-[0.08em] uppercase">Tu aprobación</p>
          <div className="relative">
            <div aria-hidden className="invisible">
              <Note note={NOTES[0]} ago="ahora" show />
            </div>
            <ul className="absolute inset-0">
              <AnimatePresence initial={false}>
                {stack.map(({ key, note, depth }) => (
                  <motion.li
                    key={key}
                    className="absolute inset-0 origin-bottom"
                    style={{ zIndex: 3 - depth }}
                    initial={{ opacity: 0, y: -56, scale: 1.02 }}
                    animate={{ opacity: 1, y: 8 * depth, scale: 1 - 0.052 * depth }}
                    exit={{ opacity: 0, y: 24, scale: 0.84, transition: { duration: 0.3 } }}
                    transition={{ type: "spring", stiffness: 240, damping: 24, opacity: { duration: 0.15 } }}
                  >
                    <Note note={note} ago={AGO[depth]} show={depth === 0} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Note({ note, ago, show }: { note: (typeof NOTES)[number]; ago: string; show: boolean }) {
  const av = CARPINCHO.avatar;
  return (
    <div className="rounded-[22px] bg-hueso px-3.5 py-3 text-azul shadow-[0_14px_30px_-10px_rgb(0_0_40/0.5)]">
      <div className={cn("flex items-center gap-3 transition-opacity duration-200", show ? "opacity-100" : "opacity-0")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={av.src} alt="" width={40} height={40} className="size-10 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 text-[15px] leading-5">
          <div className="flex items-baseline gap-2">
            <p className="truncate font-extrabold">{note.title}</p>
            <span className="ml-auto shrink-0 font-mono text-xs text-azul/70">{ago}</span>
          </div>
          <p className="truncate">{note.body}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Escena ---------- */

type Card = { label: string; title: string; text: string; side: "left" | "right"; surface: string; content: ReactNode; fill?: boolean };

const CARDS: Card[] = [
  {
    label: "(01) Escribís",
    title: "Le contás qué cobraste",
    text: "Con tus palabras, en el chat que ya usás todos los días. Sin apps, sin planillas.",
    side: "left",
    surface: "bg-hielo",
    content: <MessageVisual />,
    fill: true,
  },
  {
    label: "(02) SOCIO arma",
    title: "Arma la factura y te la muestra",
    text: "Entiende el cliente, el concepto y el monto, y te muestra el borrador antes de hacer nada.",
    side: "right",
    surface: "bg-azul",
    content: <InvoiceVisual />,
  },
  {
    label: "(03) Vos aprobás",
    title: "Nunca emite sin tu aprobación",
    text: "Recién cuando le decís que sí, la emite en ARCA y te manda el PDF.",
    side: "left",
    surface: "bg-noche",
    content: <ApprovalVisual />,
    fill: true,
  },
];

const RADIUS = "rounded-[28px]";
const STACK = (CARDS.length - 1) * 100;
const TOTAL = STACK + 35 + 160 + 260;

function CardCopy({ card }: { card: Card }) {
  return (
    <div className="flex flex-col gap-3">
      <Label className="text-azul/80">{card.label}</Label>
      <h3 className="text-[28px] leading-[1.1] font-extrabold tracking-[-0.03em]">{card.title}</h3>
      <p className="text-[17px] leading-[1.5] text-azul/80">{card.text}</p>
    </div>
  );
}

function ChatHeading() {
  return (
    <div className="flex w-full flex-col items-center text-center text-hueso">
      <Label className="text-hielo">(04) En el chat</Label>
      <h2 className="mt-4 text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] font-extrabold tracking-[-0.05em]">Un mensaje y un sí.</h2>
      <p className="mt-4 max-w-xl text-[17px] leading-[1.5] text-hielo">Facturas, presupuestos, resúmenes y recordatorios, todo desde una conversación.</p>
    </div>
  );
}

type Edge = "top" | "left" | "right" | "bottom";

function StackCard({ card, index, pos, vh, expand, box, scene }: { card: Card; index: number; pos: MotionValue<number>; vh: RefObject<number>; expand: MotionValue<number>; box: RefObject<HTMLDivElement | null>; scene: RefObject<HTMLDivElement | null> }) {
  const y = useTransform(pos, (p) => {
    const d = index - p;
    return d < 0 ? d * (vh.current ?? 900) * 1.05 : 22 * d;
  });
  const scale = useTransform(pos, (p) => {
    const d = index - p;
    return d <= 0 ? 1 : 1 - 0.07 * Math.min(d, 2);
  });
  const opacity = useTransform(pos, (p) => (index - p > 2.2 ? 0 : 1));
  const last = index === CARDS.length - 1;
  const grow = (edge: Edge) => (e: number) => {
    const b = box.current;
    const s = scene.current;
    if (!last || e <= 0 || !b || !s) return 0;
    const br = b.getBoundingClientRect();
    const sr = s.getBoundingClientRect();
    const gaps = { top: br.top - sr.top, left: br.left - sr.left, right: sr.right - br.right, bottom: sr.bottom - br.bottom };
    return -e * gaps[edge];
  };
  const top = useTransform(expand, grow("top"));
  const left = useTransform(expand, grow("left"));
  const right = useTransform(expand, grow("right"));
  const bottom = useTransform(expand, grow("bottom"));
  const borderRadius = useTransform(expand, (e) => (last ? 28 * (1 - e) : 28));
  return (
    <motion.div className={cn("absolute inset-0 origin-bottom overflow-hidden", RADIUS, card.surface)} style={{ y, scale, opacity, top, left, right, bottom, borderRadius, zIndex: CARDS.length - index }}>
      <Pattern />
      <div className={cn("absolute inset-0 flex items-center justify-center", !card.fill && "p-6")}>{card.content}</div>
    </motion.div>
  );
}

/** Anillos concéntricos de la grilla circular del logo, muy sutiles. */
function Pattern() {
  return (
    <svg aria-hidden className="pointer-events-none absolute -right-[12%] -bottom-[30%] h-[120%] opacity-[0.12]" viewBox="0 0 640 640" fill="none">
      {[268, 220, 172, 124].map((r) => (
        <circle key={r} cx="320" cy="320" r={r} stroke="currentColor" strokeWidth="2" className="text-hueso mix-blend-overlay" />
      ))}
    </svg>
  );
}

function SideCopy({ card, index, pos, enter, expand }: { card: Card; index: number; pos: MotionValue<number>; enter: MotionValue<number>; expand: MotionValue<number> }) {
  const opacity = useTransform([pos, enter, expand], ([p, en, ex]: number[]) => {
    const near = 1 - clamp(2.5 * Math.abs(index - p));
    if (index === 0) return near * clamp((en - 0.7) / 0.3);
    if (index === CARDS.length - 1) return near * (1 - clamp(ex / 0.45));
    return near;
  });
  const y = useTransform(pos, (p) => (index - p) * 24);
  return (
    <motion.div className="absolute inset-x-0 top-1/2 -translate-y-1/2" style={{ opacity, y }}>
      <CardCopy card={card} />
    </motion.div>
  );
}

function DesktopScene() {
  const ref = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const vh = useRef(900);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const boxScale = useTransform(enter, (e) => 0.78 + 0.22 * smoothstep(clamp(e)));
  useEffect(() => {
    const onResize = () => {
      vh.current = window.innerHeight;
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const pos = useTransform(scrollYProgress, (p) => {
    const n = CARDS.length - 1;
    const raw = clamp((p * TOTAL) / STACK) * n;
    const i = Math.min(Math.floor(raw), n - 1);
    return i + smoothstep(clamp(raw - i));
  });
  const expand = useTransform(scrollYProgress, (p) => smoothstep(clamp((p * TOTAL - STACK - 35) / 160)));
  const headingOpacity = useTransform(expand, [0.5, 0.85], [0, 1]);
  const headingY = useTransform(expand, [0.5, 0.85], [24, 0]);
  const chat = useTransform(scrollYProgress, (p) => smoothstep(clamp((p * TOTAL - STACK - 35 - 160) / 70)));
  const chatY = useTransform(chat, [0, 1], [80, 0]);
  const { scrollYProgress: exit } = useScroll({ target: ref, offset: ["end end", "end start"] });
  const exitP = useTransform(exit, [0, 0.35], [0, 1], { clamp: true });
  const clipPath = useTransform(exitP, (e) => {
    const i = (24 * e).toFixed(1);
    const r = (28 * e).toFixed(1);
    return `inset(${i}px ${i}px ${i}px ${i}px round ${r}px)`;
  });
  const [playing, setPlaying] = useState(false);
  useMotionValueEvent(chat, "change", (v) => setPlaying(v > 0.6));

  return (
    <ExpandContext.Provider value={expand}>
      <div ref={ref} style={{ height: `${TOTAL + 100}vh` }}>
        <motion.div ref={scene} className="sticky top-0 flex h-svh items-center will-change-[clip-path]" style={{ clipPath }}>
          <div id="ejemplos" className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-7 px-8">
            <motion.div className="w-full" style={{ opacity: headingOpacity, y: headingY }}>
              <ChatHeading />
            </motion.div>
            <motion.div className="h-[min(520px,58svh)] w-full max-w-[460px]" style={{ opacity: chat, y: chatY }}>
              <ChatDemo playing={playing} />
            </motion.div>
          </div>
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-[1fr_min(56vw,900px)_1fr] items-center gap-x-10 px-8">
            <div className="relative h-full w-full max-w-64 justify-self-end">
              {CARDS.map((card, i) => (card.side === "left" ? <SideCopy key={card.title} card={card} index={i} pos={pos} enter={enter} expand={expand} /> : null))}
            </div>
            <motion.div ref={box} className="relative z-10 aspect-[1.58] max-h-[72svh] w-full" style={{ scale: boxScale }}>
              {CARDS.map((card, i) => (
                <StackCard key={card.title} card={card} index={i} pos={pos} vh={vh} expand={expand} box={box} scene={scene} />
              ))}
            </motion.div>
            <div className="relative h-full w-full max-w-64 justify-self-start">
              {CARDS.map((card, i) => (card.side === "right" ? <SideCopy key={card.title} card={card} index={i} pos={pos} enter={enter} expand={expand} /> : null))}
            </div>
          </div>
        </motion.div>
      </div>
    </ExpandContext.Provider>
  );
}

function MobileList() {
  return (
    <div className="flex flex-col gap-20 px-4 pb-24">
      {CARDS.map((card) => (
        <div key={card.title} className="flex flex-col gap-6">
          <Reveal onScroll className="max-w-md">
            <CardCopy card={card} />
          </Reveal>
          <Reveal onScroll delay={0.1}>
            <div className={cn("relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/11]", RADIUS, card.surface)}>
              <Pattern />
              <div className={cn("absolute inset-0 flex items-center justify-center", !card.fill && "p-4")}>{card.content}</div>
            </div>
          </Reveal>
        </div>
      ))}
      <Reveal onScroll>
        <div id="ejemplos" className={cn("relative scroll-mt-8 overflow-hidden bg-noche px-4 py-14 sm:px-8", RADIUS)}>
          <div className="relative flex flex-col items-center gap-8">
            <ChatHeading />
            <ChatDemo className="h-[540px] w-full max-w-[460px]" />
          </div>
        </div>
      </Reveal>
    </div>
  );
}

export function ProductScene() {
  const reduced = useReducedMotion();
  return (
    <section id="como-funciona" aria-label="Cómo funciona SOCIO" className="relative scroll-mt-8 bg-hueso text-azul">
      <div className="flex flex-col items-center px-4 pt-28 pb-4 text-center sm:pt-36">
        <Reveal onScroll>
          <IsoMark className="size-16 sm:size-20" />
        </Reveal>
        <Reveal onScroll delay={0.15} className="mt-8">
          <Label>(02) Cómo funciona</Label>
          <h2 className="mt-4 text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] font-extrabold tracking-[-0.05em]">Del mensaje al PDF.</h2>
        </Reveal>
      </div>
      <div className={cn("hidden", !reduced && "lg:block")}>
        <DesktopScene />
      </div>
      <div className={cn("pt-10", !reduced && "lg:hidden")}>
        <MobileList />
      </div>
    </section>
  );
}
