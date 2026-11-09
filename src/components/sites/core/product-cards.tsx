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
import {
  BatteryFull,
  Check,
  CheckCheck,
  CircleCheck,
  FileText,
  HandCoins,
  Landmark,
  LoaderCircle,
  Mic,
  UserRound,
  Wifi,
  X,
} from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/utils";
import { CardMedia } from "./card-media";
import { SOCIO_AVATAR, SOCIO_PHOTOS } from "./assets";
import { ConnectedContent } from "./dashboard-section";
import { Reveal, asset, clamp, smoothstep } from "./shared";

/* ---------- Card 1: the voice message ---------- */

function VoiceNote() {
  const reduced = useReducedMotion();
  const bars = [6, 14, 9, 18, 12, 22, 10, 16, 8, 20, 13, 7, 17, 11, 19, 9, 15, 6, 12, 8];
  return (
    <motion.div
      className="w-full max-w-sm rounded-2xl bg-black/45 p-4 text-white shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)] ring-1 ring-white/15 backdrop-blur-xl"
      animate={reduced ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-core-ink">
          <Mic className="size-4" aria-hidden />
        </span>
        <div className="flex h-10 flex-1 items-center gap-[3px]" aria-hidden>
          {bars.map((h, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-white/80"
              style={{ height: h }}
              animate={reduced ? undefined : { scaleY: [1, 0.45, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
            />
          ))}
        </div>
        <span className="font-mono text-xs text-white/70 tabular-nums">0:12</span>
      </div>
      <p className="mt-3 border-t border-white/10 pt-3 text-[15px] leading-snug text-white/90">
        “Le cobré 45 lucas a Martina López por el diseño del logo.”
      </p>
      <p className="mt-2 flex items-center justify-end gap-1 text-xs text-white/55">
        10:41 <CheckCheck className="size-3.5" aria-hidden />
      </p>
    </motion.div>
  );
}

/* ---------- Card 2: live event log ---------- */

const EVENTS = [
  { icon: UserRound, title: "Cliente · Martina López", detail: "Lo saqué de tu mensaje", time: "10:41" },
  { icon: FileText, title: "Concepto · Diseño de logo", detail: "Factura C del monotributo", time: "10:41" },
  { icon: HandCoins, title: "Monto · $45.000", detail: "“45 lucas”, como me dijiste", time: "10:41" },
  { icon: CircleCheck, title: "Borrador listo · ¿La emito?", detail: "Esperando tu confirmación", time: "10:41" },
  { icon: Landmark, title: "Emitida en ARCA · 0001-00000128", detail: "Te mandé el PDF por WhatsApp", time: "10:42" },
];

function EventLog() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(1);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(() => {
      setSettled(false);
      setCount((c) => c + 1);
    }, 2400);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => setSettled(true), 1100);
    return () => window.clearTimeout(id);
  }, [count, reduced]);

  const items = Array.from({ length: Math.min(count, 3) }, (_, i) => {
    const key = count - 1 - i;
    return { key, event: EVENTS[key % EVENTS.length], newest: i === 0 };
  });
  const done = reduced || settled;

  return (
    <div ref={ref} className="w-full max-w-md rounded-2xl bg-black/45 p-4 text-white shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)] ring-1 ring-white/15 backdrop-blur-xl">
      <div className="flex items-center gap-2.5 px-1 pb-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SOCIO_AVATAR} alt="" width={20} height={20} className="size-5 rounded-full" />
        <span className="text-sm font-medium">Armando tu factura</span>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-white/60">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full rounded-full bg-core-green opacity-70 motion-safe:animate-ping" />
            <span className="relative inline-flex size-1.5 rounded-full bg-core-green" />
          </span>
          En vivo
        </span>
      </div>
      <ul className="flex flex-col border-t border-white/10 [&>li:last-child_[data-slot=alert]]:border-b-0">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map(({ key, event, newest }) => {
            const Icon = event.icon;
            return (
              <motion.li
                key={key}
                layout
                initial={{ opacity: 0, y: -16, scale: 0.98 }}
                animate={{ opacity: newest ? 1 : 0.7, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, transition: { duration: 0.25 } }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
              >
                <div
                  data-slot="alert"
                  role="note"
                  className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-x-2 gap-y-0.5 border-b border-white/10 px-1 py-3 text-left text-sm text-white"
                >
                  <Icon className="row-span-2 size-4 translate-y-0.5 text-white/70" />
                  <div className="col-start-2 flex min-w-0 items-center gap-2 font-medium">
                    <span className="truncate">{event.title}</span>
                    <span className="ml-auto flex shrink-0 items-center gap-1 text-xs font-normal text-white/60">
                      {!newest || done ? (
                        <>
                          <Check className="size-3.5" aria-hidden />
                          <span className="hidden sm:inline">Listo</span>
                        </>
                      ) : (
                        <>
                          <LoaderCircle className="size-3.5 animate-spin" aria-hidden />
                          <span className="hidden sm:inline">Leyendo…</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="col-start-2 flex min-w-0 items-center gap-2 text-sm text-white/55">
                    <span className="truncate">{event.detail}</span>
                    <span className="ml-auto shrink-0 font-mono text-[11px] tabular-nums">{event.time}</span>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}

/* ---------- Card 3: phone notifications ---------- */

const ExpandContext = createContext<MotionValue<number> | null>(null);

const ALERTS = [
  { title: "Emitida en ARCA · Martina López", body: "Factura C 0001-00000128. Acá tenés el PDF." },
  { title: "Entró $32.000 de Lucía", body: "Mercado Pago. ¿La facturamos?" },
  { title: "Entró $18.500 de Diego", body: "Transferencia. Ya quedó anotada." },
  { title: "Ojo con el tope", body: "Te falta poco para el tope de tu categoría." },
  { title: "Te deben $120.000", body: "García, López y Taller Ruiz. ¿Les aviso?" },
];
const AGO = ["ahora", "hace 12 min", "hace 42 min"];

function Notification({ alert, ago, showContent }: { alert: (typeof ALERTS)[number]; ago: string; showContent: boolean }) {
  return (
    <div className="relative isolate overflow-hidden rounded-[23px] bg-white/[0.06] py-3 pr-4 pl-3.5 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.55),inset_0_-1px_0_rgb(255_255_255/0.18),inset_1px_0_0_rgb(255_255_255/0.22),inset_-1px_0_0_rgb(255_255_255/0.22),0_10px_30px_-6px_rgb(0_30_70/0.25)] ring-[0.5px] ring-white/25 backdrop-blur-2xl backdrop-brightness-[0.88] backdrop-saturate-[1.25]">
      <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-[radial-gradient(120%_90%_at_20%_0%,rgb(255_255_255/0.28),transparent_55%)]" />
      <div className={"flex items-center gap-[11px] [text-shadow:0_1px_2px_rgb(0_20_50/0.25)] transition-opacity duration-200 " + (showContent ? "opacity-100" : "opacity-0")}>
        <span className="flex size-[38px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SOCIO_AVATAR} alt="" width={38} height={38} className="size-full rounded-[10px] object-cover" />
        </span>
        <div className="min-w-0 flex-1 text-[15px] leading-5">
          <div className="flex items-baseline gap-2">
            <p className="truncate font-semibold">{alert.title}</p>
            <span className="ml-auto shrink-0 text-white/65">{ago}</span>
          </div>
          <p className="truncate">{alert.body}</p>
        </div>
      </div>
    </div>
  );
}

function PhoneAlerts() {
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
    return { key, alert: ALERTS[key % ALERTS.length], depth: i };
  });

  return (
    <div ref={ref} className="absolute inset-0 text-white">
      <motion.div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 pt-4 text-sm font-medium sm:px-8 sm:pt-5" style={{ opacity }}>
        <span>9:45</span>
        <span className="flex items-center gap-1.5">
          <Wifi className="size-4" aria-hidden />
          87%
          <BatteryFull className="size-5" aria-hidden />
        </span>
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <motion.div className="w-[min(92%,420px)] -translate-y-4 lg:w-[min(48%,520px)]" style={{ y, opacity }}>
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="text-lg sm:text-xl">Centro de notificaciones</span>
            <span className="flex size-8 items-center justify-center rounded-full bg-white/90 text-black/40">
              <X className="size-4" aria-hidden />
            </span>
          </div>
          <div className="relative">
            <div aria-hidden className="invisible">
              <Notification alert={ALERTS[0]} ago="ahora" showContent />
            </div>
            <ul className="absolute inset-0">
              <AnimatePresence initial={false}>
                {stack.map(({ key, alert, depth }) => (
                  <motion.li
                    key={key}
                    className="absolute inset-0 origin-bottom transform-gpu will-change-transform"
                    style={{ zIndex: 3 - depth }}
                    initial={{ opacity: 0, y: -56, scale: 1.02 }}
                    animate={{ opacity: 1, y: 8 * depth, scale: 1 - 0.052 * depth }}
                    exit={{ opacity: 0, y: 24, scale: 0.844, transition: { duration: 0.3 } }}
                    transition={{ type: "spring", stiffness: 240, damping: 24, opacity: { duration: 0.15, ease: "easeOut" } }}
                  >
                    <Notification alert={alert} ago={AGO[depth]} showContent={depth === 0} />
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

/* ---------- Scene ---------- */

type Card = {
  title: string;
  text: string;
  side: "left" | "right";
  image: string;
  dither?: boolean;
  drift?: boolean;
  content: ReactNode;
};

const CARDS: Card[] = [
  {
    title: "Me mandás un audio",
    text: "O un mensaje, o una foto. Con tus palabras, como le hablarías a alguien de confianza.",
    side: "left",
    image: SOCIO_PHOTOS.audio,
    content: <VoiceNote />,
  },
  {
    title: "Armo la factura",
    text: "Te la muestro antes de hacer nada: cliente, concepto y monto.",
    side: "right",
    image: SOCIO_PHOTOS.factura,
    content: <EventLog />,
  },
  {
    title: "Con tu confirmación, la emito en ARCA",
    text: "Sin tu confirmación no se emite nada. Te llega el PDF por WhatsApp, listo para mandárselo a tu cliente.",
    side: "left",
    image: asset("/images/producto/cielo.jpg"),
    dither: false,
    drift: true,
    content: <PhoneAlerts />,
  },
];

const RADIUS = "rounded-[28px]";
// Scroll budget, in vh: card transitions, a short hold, the expand, the chat entrance.
const STACK = (CARDS.length - 1) * 100;
const TOTAL = STACK + 35 + 160 + 260;

function CardCopy({ card, className }: { card: Card; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <h3 className="font-display text-2xl leading-[1.08] font-semibold tracking-[-0.02em] text-balance xl:text-3xl">{card.title}</h3>
      <p className="text-base text-pretty text-muted-foreground">{card.text}</p>
    </div>
  );
}

type Edge = "top" | "left" | "right" | "bottom";

function StackCard({
  card,
  index,
  pos,
  vh,
  expand,
  box,
  scene,
}: {
  card: Card;
  index: number;
  pos: MotionValue<number>;
  vh: RefObject<number>;
  expand: MotionValue<number>;
  box: RefObject<HTMLDivElement | null>;
  scene: RefObject<HTMLDivElement | null>;
}) {
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
    <motion.div
      className={cn("absolute inset-0 origin-bottom overflow-hidden", RADIUS)}
      style={{ y, scale, opacity, top, left, right, bottom, borderRadius, zIndex: CARDS.length - index }}
    >
      <CardMedia src={card.image} dither={card.dither} drift={card.drift} />
      <div className="absolute inset-0 flex items-center justify-center p-6">{card.content}</div>
    </motion.div>
  );
}

function SideCopy({
  card,
  index,
  pos,
  enter,
  expand,
}: {
  card: Card;
  index: number;
  pos: MotionValue<number>;
  enter: MotionValue<number>;
  expand: MotionValue<number>;
}) {
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
  // After the last card, it grows to fill the screen and the chat + panel come in over the sky.
  const expand = useTransform(scrollYProgress, (p) => smoothstep(clamp((p * TOTAL - STACK - 35) / 160)));
  const reveal = useTransform(scrollYProgress, (p) => smoothstep(clamp((p * TOTAL - STACK - 35 - 120) / 110)));
  const revealY = useTransform(reveal, [0, 1], [60, 0]);
  const [active, setActive] = useState(false);
  useMotionValueEvent(reveal, "change", (v) => setActive(v > 0.6));

  const { scrollYProgress: exit } = useScroll({ target: ref, offset: ["end end", "end start"] });
  const exitP = useTransform(exit, [0, 0.35], [0, 1], { clamp: true });
  const clipPath = useTransform(exitP, (e) => {
    const i = (24 * e).toFixed(1);
    const r = (28 * e).toFixed(1);
    return `inset(${i}px ${i}px ${i}px ${i}px round ${r}px)`;
  });

  return (
    <ExpandContext.Provider value={expand}>
      <div ref={ref} className="-mt-[6vh]" style={{ height: `${TOTAL + 100}vh` }}>
        <motion.div ref={scene} className="sticky top-0 flex h-svh items-center will-change-[clip-path]" style={{ clipPath }}>
          <motion.div
            id="panel"
            className={cn("absolute inset-0 z-20 flex items-center justify-center px-8 pt-4", active ? "pointer-events-auto" : "pointer-events-none")}
            style={{ opacity: reveal, y: revealY }}
          >
            <ConnectedContent active={active} />
          </motion.div>
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-[1fr_min(56vw,900px)_1fr] items-center gap-x-10 px-8">
            <div className="relative h-full w-full max-w-64 justify-self-end">
              {CARDS.map((card, i) =>
                card.side === "left" ? <SideCopy key={card.title} card={card} index={i} pos={pos} enter={enter} expand={expand} /> : null,
              )}
            </div>
            <motion.div ref={box} className="relative z-10 aspect-[1.58] max-h-[72svh] w-full" style={{ scale: boxScale }}>
              {CARDS.map((card, i) => (
                <StackCard key={card.title} card={card} index={i} pos={pos} vh={vh} expand={expand} box={box} scene={scene} />
              ))}
            </motion.div>
            <div className="relative h-full w-full max-w-64 justify-self-start">
              {CARDS.map((card, i) =>
                card.side === "right" ? <SideCopy key={card.title} card={card} index={i} pos={pos} enter={enter} expand={expand} /> : null,
              )}
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
            <div className={cn("relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/11]", RADIUS)}>
              <CardMedia src={card.image} dither={card.dither} drift={card.drift} />
              <div className="absolute inset-0 flex items-center justify-center p-4">{card.content}</div>
            </div>
          </Reveal>
        </div>
      ))}
      <Reveal onScroll>
        <div id="panel" className={cn("relative scroll-mt-8 overflow-hidden px-3 py-12 sm:px-6", RADIUS)}>
          <CardMedia src={asset("/images/producto/cielo.jpg")} dither={false} drift />
          <div className="relative">
            <ConnectedContent compact />
          </div>
        </div>
      </Reveal>
    </div>
  );
}

export function ProductCards() {
  const reduced = useReducedMotion();
  return (
    <section aria-label="Cómo funciona core" className="relative">
      <div className={cn("hidden", !reduced && "lg:block")}>
        <DesktopScene />
      </div>
      <div className={cn(!reduced && "lg:hidden")}>
        <MobileList />
      </div>
    </section>
  );
}
