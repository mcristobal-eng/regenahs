"use client";

import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "motion/react";
import { BellRing, FileText, HandCoins, Home, MessageCircle, Receipt, Search, Sparkles, Users, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SOCIO_AVATAR } from "./assets";
import { ChatDemo } from "./chat-demo";
import { CardMedia } from "./card-media";
import { PhoneAlerts } from "./product-cards";
import { AuroraBackdrop, RadialLinesBackdrop } from "./section-backgrounds";
import { Reveal, asset } from "./shared";

const NAV = [
  { icon: Home, label: "Inicio", active: true },
  { icon: FileText, label: "Facturas" },
  { icon: Wallet, label: "Cobranza", badge: 4 },
  { icon: Users, label: "Clientes" },
  { icon: Receipt, label: "Costos" },
];

const KPIS = [
  { label: "Facturado", value: 2, prefix: "$", suffix: " M", decimals: 0, note: "octubre" },
  { label: "Cobrado", value: 652, prefix: "$", suffix: " mil", decimals: 0, note: "32 % de lo facturado" },
  { label: "Te deben", value: 1.4, prefix: "$", suffix: " M", decimals: 1, note: "4 facturas" },
  { label: "Costos", value: 1.4, prefix: "$", suffix: " M", decimals: 1, note: "te quedan $672 mil" },
];

// Facturado / cobrado, may → oct (relative heights).
const MONTHS = [
  { m: "may", f: 0.52, c: 0.4 },
  { m: "jun", f: 0.6, c: 0.46 },
  { m: "jul", f: 0.56, c: 0.5 },
  { m: "ago", f: 0.72, c: 0.55 },
  { m: "sept", f: 0.8, c: 0.62 },
  { m: "oct", f: 0.95, c: 0.34 },
];

const INVOICES = [
  { who: "Logística Sur", what: "Abono mensual de octubre", status: "Cobrada", amount: "$ 285.000" },
  { who: "Distribuidora Norte SRL", what: "Service de flota", status: "Pendiente", amount: "$ 640.000" },
  { who: "Martina Gómez", what: "Cochera fija", status: "Cobrada", amount: "$ 95.000" },
  { who: "Café del Parque", what: "Mantenimiento", status: "Vencida", amount: "$ 180.000" },
];

const STATUS: Record<string, string> = {
  Cobrada: "bg-hielo text-azul",
  Pendiente: "bg-ambar/25 text-noche",
  Vencida: "bg-noche text-hueso",
};

const TOASTS = [
  { title: "Entró $32.000 de Lucía", body: "Mercado Pago · ¿La facturamos?" },
  { title: "Entró $45.000 de García", body: "Factura 0001-128 · cobrada" },
  { title: "Entró $18.500 de Diego", body: "Transferencia · anotado" },
];

const QUESTIONS = [
  { q: "¿Quién me debe?", a: "Te deben $1,4 M en 4 facturas. La más vieja es de Café del Parque." },
  { q: "¿Cuánto facturé en octubre?", a: "$2 M. Cobraste $652 mil, el 32 %." },
  { q: "¿Me acerco al tope de mi categoría?", a: "Vas bien: te queda margen hasta fin de año." },
];

function Counter({ value, prefix, suffix, decimals, run }: { value: number; prefix: string; suffix: string; decimals: number; run: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (v: number) => `${prefix}${v.toFixed(decimals).replace(".", ",")}${suffix}`;
    if (!run) {
      el.textContent = fmt(value);
      return;
    }
    const controls = animate(0, value, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => (el.textContent = fmt(v)) });
    return () => controls.stop();
  }, [value, prefix, suffix, decimals, run]);
  return <span ref={ref} />;
}

function Dashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35, once: true });
  const live = useInView(ref, { amount: 0.35 });
  const reduced = useReducedMotion();
  const run = inView && !reduced;
  const [toast, setToast] = useState(-1);
  const [qi, setQi] = useState(0);
  const [typed, setTyped] = useState(0);
  const [answered, setAnswered] = useState(false);

  // Mercado Pago cobros popping in: show one, hide it, show the next.
  useEffect(() => {
    if (!live || reduced) return;
    let i = 0;
    let hideTimer = 0;
    const show = () => {
      setToast(i % TOASTS.length);
      i += 1;
      hideTimer = window.setTimeout(() => setToast(-1), 2800);
    };
    const first = window.setTimeout(show, 1600);
    const id = window.setInterval(show, 4200);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(hideTimer);
      window.clearInterval(id);
    };
  }, [live, reduced]);

  // Question typed into the ChatGPT / Claude bar, then answered.
  useEffect(() => {
    if (!live || reduced) return;
    const q = QUESTIONS[qi].q;
    const timers: number[] = [];
    for (let i = 1; i <= q.length; i++) timers.push(window.setTimeout(() => setTyped(i), 600 + i * 45));
    timers.push(window.setTimeout(() => setAnswered(true), 600 + q.length * 45 + 700));
    timers.push(
      window.setTimeout(() => {
        setAnswered(false);
        setTyped(0);
        setQi((v) => (v + 1) % QUESTIONS.length);
      }, 600 + q.length * 45 + 5200),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [live, reduced, qi]);

  const question = QUESTIONS[qi];
  const shownTyped = reduced ? question.q.length : typed;
  const shownAnswer = reduced || answered;

  return (
    <div ref={ref} className="relative flex h-full overflow-hidden rounded-[28px] bg-hueso text-azul shadow-[0_40px_80px_-30px_rgb(0_0_60/0.5)] ring-1 ring-noche/5">
      {/* Sidebar */}
      <aside className="hidden w-44 shrink-0 flex-col border-r border-border p-4 xl:flex">
        <div className="flex items-center gap-2 px-2 pb-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SOCIO_AVATAR} alt="" width={24} height={24} className="size-6 rounded-full" />
          <span className="font-display text-lg font-semibold tracking-[-0.03em]">socio</span>
        </div>
        <nav className="flex flex-col gap-0.5 text-sm">
          {NAV.map(({ icon: Icon, label, active, badge }) => (
            <span key={label} className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-2", active ? "bg-hielo font-medium" : "text-azul/70")}>
              <Icon className="size-4" aria-hidden />
              {label}
              {badge && <span className="ml-auto rounded-full bg-ambar px-1.5 text-[11px] font-medium text-noche">{badge}</span>}
            </span>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-azul/70">
          <span className="flex size-6 items-center justify-center rounded-full bg-azul text-[11px] font-medium text-hueso">T</span>
          <span className="leading-tight">
            Taller Ruiz
            <br />
            Plan activo
          </span>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-5">
          <div className="leading-tight">
            <p className="text-sm font-semibold">Inicio</p>
            <p className="text-xs text-azul/60">Jueves 30 de octubre</p>
          </div>
          <span className="ml-auto hidden items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-azul/60 sm:flex">
            <Search className="size-3.5" aria-hidden />
            Buscar
          </span>
          <span className="rounded-lg bg-azul px-3 py-1.5 text-xs font-medium text-hueso">Nueva factura</span>
        </div>

        <div className="min-h-0 flex-1 p-4 sm:p-5 lg:overflow-hidden">
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {KPIS.map((k) => (
              <div key={k.label} className="rounded-2xl border border-border bg-white/60 p-3">
                <p className="text-xs text-azul/60">{k.label}</p>
                <p className="mt-1 font-display text-xl leading-none font-semibold tracking-[-0.03em] tabular-nums sm:text-2xl">
                  <Counter value={k.value} prefix={k.prefix} suffix={k.suffix} decimals={k.decimals} run={run} />
                </p>
                <p className="mt-1 truncate text-[11px] text-azul/60">{k.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0 rounded-2xl border border-border bg-white/60 p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
                <span className="font-medium">Evolución mensual</span>
                <span className="flex items-center gap-3 text-azul/60">
                  <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-azul" />Facturado</span>
                  <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-hielo ring-1 ring-azul/20" />Cobrado</span>
                </span>
              </div>
              <div className="mt-3 flex items-end gap-3">
                {MONTHS.map((mo, i) => (
                  <div key={mo.m} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className="flex h-24 w-full items-end justify-center gap-1 sm:h-28">
                      {[
                        { v: mo.f, cls: "bg-azul" },
                        { v: mo.c, cls: "bg-hielo ring-1 ring-azul/15" },
                      ].map((bar, j) => (
                        <motion.span
                          key={j}
                          className={cn("w-1/2 max-w-3 origin-bottom rounded-t-sm", bar.cls)}
                          style={{ height: `${bar.v * 100}%` }}
                          initial={{ scaleY: reduced ? 1 : 0 }}
                          animate={{ scaleY: run || reduced ? 1 : 0 }}
                          transition={{ duration: 0.8, delay: 0.25 + i * 0.07 + j * 0.04, ease: [0.22, 1, 0.36, 1] }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-azul/60">{mo.m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0 rounded-2xl border border-border bg-white/60 p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">Últimas facturas</span>
                <span className="text-azul/60">Ver todas</span>
              </div>
              <ul className="mt-2 divide-y divide-border text-xs">
                {INVOICES.map((inv, i) => (
                  <motion.li
                    key={inv.who}
                    className="flex items-center gap-2 py-2"
                    initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 6 }}
                    animate={run || reduced ? { opacity: 1, y: 0 } : undefined}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{inv.who}</span>
                      <span className="block truncate text-azul/60">{inv.what}</span>
                    </span>
                    <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", STATUS[inv.status])}>{inv.status}</span>
                    <span className="shrink-0 text-right font-medium tabular-nums sm:w-20">{inv.amount}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ChatGPT / Claude bar */}
        <div className="m-3 mt-0 rounded-2xl border border-border bg-white px-3 py-2.5 shadow-[0_2px_8px_-4px_rgb(0_0_60/0.15)] sm:m-4 sm:mt-0">
          <div className="flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-hielo">
              <Sparkles className="size-3.5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm">
              {shownTyped > 0 ? question.q.slice(0, shownTyped) : <span className="text-azul/50">Preguntale a ChatGPT o Claude sobre tus números…</span>}
              {shownTyped > 0 && shownTyped < question.q.length && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-azul" />}
            </span>
            <span className="hidden shrink-0 items-center gap-1 text-[11px] text-azul/60 sm:flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/brand/openai.svg")} alt="" width={12} height={12} className="size-3" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/brand/claude.svg")} alt="" width={12} height={12} className="size-3" />
              conectado
            </span>
          </div>
          <AnimatePresence initial={false}>
            {shownAnswer && (
              <motion.p
                key={qi}
                className="mt-2 border-t border-border pt-2 text-sm text-azul/80"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {question.a}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mercado Pago toast */}
      <AnimatePresence>
        {toast >= 0 && (
          <motion.div
            key={toast}
            className="absolute top-16 right-3 z-10 flex sm:right-6 lg:top-auto lg:bottom-24 w-[min(78%,300px)] items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_18px_40px_-14px_rgb(0_0_60/0.45)] ring-1 ring-noche/5"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-hielo">
              <HandCoins className="size-4" aria-hidden />
            </span>
            <span className="min-w-0 text-sm leading-tight">
              <span className="block truncate font-semibold">{TOASTS[toast].title}</span>
              <span className="block truncate text-xs text-azul/60">{TOASTS[toast].body}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WhatsAppMark() {
  return (
    <span className="flex size-7 items-center justify-center rounded-full bg-[#25d366] text-white">
      <MessageCircle className="size-4" aria-hidden />
    </span>
  );
}

function MercadoPagoMark() {
  return (
    <span className="flex size-7 items-center justify-center rounded-full bg-[#00b1ea] text-white">
      <HandCoins className="size-4" aria-hidden />
    </span>
  );
}

function ImgMark({ src }: { src: string }) {
  return (
    <span className="flex size-7 items-center justify-center rounded-full bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={16} height={16} className="size-4" />
    </span>
  );
}

const INTEGRATIONS = [
  { name: "WhatsApp", note: "Facturás y anotás cobros desde el chat", mark: <WhatsAppMark /> },
  { name: "Mercado Pago", note: "Cada cobro entra solo", mark: <MercadoPagoMark /> },
  { name: "ChatGPT", note: "Consultás tus números", mark: <ImgMark src={asset("/brand/openai.svg")} /> },
  { name: "Claude", note: "Consultás tus números", mark: <ImgMark src={asset("/brand/claude.svg")} /> },
];

export function DashboardSection({ background = "lineas" }: { background?: "lineas" | "aurora" }) {
  return (
    <section id="panel" aria-labelledby="panel-title" className="scroll-mt-8 px-3 py-3 sm:px-6 sm:py-6">
      <div className="relative isolate overflow-hidden rounded-[28px] px-4 py-16 sm:px-8 sm:py-24">
        {background === "aurora" ? <AuroraBackdrop /> : <RadialLinesBackdrop />}
        <div className="relative mx-auto flex max-w-7xl flex-col items-center">
          <Reveal onScroll className="text-center text-white">
            <h2 id="panel-title" className="font-display text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance">
              <span className="block">Lo de todos los días en un chat,</span>
              <span className="block">y todo a la vista en tu panel</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-pretty text-white/85 sm:text-lg">
              Le escribís a SOCIO por WhatsApp y todo queda ordenado en tu panel. Conectás Mercado Pago para que cada cobro entre solo, y ChatGPT o Claude para preguntarle por tus números.
            </p>
          </Reveal>

          <Reveal onScroll delay={0.05} className="mt-8 w-full">
            <p className="text-center font-mono text-[11px] tracking-[0.18em] text-white/60 uppercase">Se conecta con</p>
            <ul className="mx-auto mt-3 grid max-w-4xl grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-2.5">
              {INTEGRATIONS.map((it) => (
                <li key={it.name} className="flex items-center gap-2.5 rounded-full bg-white/10 py-1.5 pr-4 pl-1.5 text-white ring-1 ring-white/20 backdrop-blur-md">
                  {it.mark}
                  <span className="leading-tight">
                    <span className="block text-sm font-semibold">{it.name}</span>
                    <span className="hidden text-[11px] text-white/65 sm:block">{it.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-12 grid w-full items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-10">
            <Reveal onScroll className="text-white">
              <p className="flex items-center gap-2 text-sm font-medium">
                <span className="flex size-7 items-center justify-center rounded-full bg-white text-azul">
                  <BellRing className="size-4" aria-hidden />
                </span>
                En tu celular
              </p>
              <h3 className="mt-4 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance">
                Con tu confirmación, la emito en ARCA
              </h3>
              <p className="mt-3 max-w-md text-base text-pretty text-white/80">
                Sin tu confirmación no se emite nada. Te llega el PDF por WhatsApp, y te avisa al instante cuando entra un cobro de Mercado Pago o te acercás al tope.
              </p>
            </Reveal>
            <Reveal onScroll delay={0.1}>
              <div className="relative h-[340px] overflow-hidden rounded-[28px] sm:h-[380px]">
                <CardMedia src={asset("/images/producto/cielo.jpg")} dither={false} drift />
                <PhoneAlerts />
              </div>
            </Reveal>
          </div>

          <div className="mt-10 grid w-full gap-4 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-stretch">
            <Reveal onScroll delay={0.1} className="flex flex-col">
              <p className="mb-2 flex items-center gap-2 px-1 text-sm font-medium text-white">
                <WhatsAppMark />
                En WhatsApp
              </p>
              <div className="h-[520px] lg:h-[560px]">
                <ChatDemo className="h-full" />
              </div>
            </Reveal>
            <Reveal onScroll delay={0.18} className="flex min-w-0 flex-col">
              <p className="mb-2 flex items-center gap-2 px-1 text-sm font-medium text-white">
                <span className="flex size-7 items-center justify-center rounded-full bg-white text-azul">
                  <Home className="size-4" aria-hidden />
                </span>
                En tu panel web
              </p>
              <div className="lg:h-[560px]">
                <Dashboard />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
