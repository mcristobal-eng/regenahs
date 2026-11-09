"use client";

import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUp, Check, FileText, Home, Plus, Receipt, Search, Send, Sparkles, Users, Wallet, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { SOCIO_AVATAR } from "./assets";
import { asset } from "./shared";

type View = "Inicio" | "Facturas" | "Cobranza" | "Clientes" | "Costos";
type Status = "Cobrada" | "Pendiente" | "Vencida";
type Invoice = { id: number; who: string; what: string; status: Status; amount: number; date: string };

const NAV: { icon: typeof Home; label: View }[] = [
  { icon: Home, label: "Inicio" },
  { icon: FileText, label: "Facturas" },
  { icon: Wallet, label: "Cobranza" },
  { icon: Users, label: "Clientes" },
  { icon: Receipt, label: "Costos" },
];

const START: Invoice[] = [
  { id: 128, who: "Logística Sur", what: "Abono mensual de octubre", status: "Cobrada", amount: 285000, date: "30 oct" },
  { id: 127, who: "Distribuidora Norte SRL", what: "Service de flota", status: "Pendiente", amount: 640000, date: "28 oct" },
  { id: 126, who: "Martina Gómez", what: "Cochera fija", status: "Cobrada", amount: 95000, date: "27 oct" },
  { id: 125, who: "Café del Parque", what: "Mantenimiento", status: "Vencida", amount: 180000, date: "12 oct" },
  { id: 124, who: "Estudio Prado", what: "Revisión mensual", status: "Pendiente", amount: 320000, date: "10 oct" },
  { id: 123, who: "Juan Pérez", what: "Arreglo de frenos", status: "Cobrada", amount: 272000, date: "8 oct" },
  { id: 122, who: "Gimnasio Fuerza", what: "Mantenimiento", status: "Vencida", amount: 208000, date: "2 oct" },
];

const COSTS = [
  { what: "Repuestos", who: "Autopartes Norte", amount: 820000 },
  { what: "Alquiler del taller", who: "Inmobiliaria Sur", amount: 380000 },
  { what: "Servicios", who: "Luz, gas e internet", amount: 120000 },
  { what: "Herramientas", who: "Ferretería Central", amount: 80000 },
];

// Facturado / cobrado per month, in thousands of pesos.
const MONTHS = [
  { m: "may", f: 1100, c: 850 },
  { m: "jun", f: 1260, c: 980 },
  { m: "jul", f: 1180, c: 1050 },
  { m: "ago", f: 1520, c: 1160 },
  { m: "sept", f: 1690, c: 1300 },
  { m: "oct", f: 2000, c: 652 },
];


const SUGGESTIONS = ["¿Quién me debe?", "¿Cuánto facturé en octubre?", "¿Me acerco al tope?"];

const STATUS_STYLE: Record<Status, string> = {
  Cobrada: "bg-hielo text-azul",
  Pendiente: "bg-ambar/25 text-noche",
  Vencida: "bg-noche text-hueso",
};

const money = (n: number) => `$ ${n.toLocaleString("es-AR")}`;
const short = (n: number) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1).replace(".0", "").replace(".", ",")} M` : `$${Math.round(n / 1000)} mil`);

function Counter({ value, run }: { value: number; run: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!run) {
      el.textContent = short(value);
      from.current = value;
      return;
    }
    const controls = animate(from.current, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => (el.textContent = short(v)),
    });
    from.current = value;
    return () => controls.stop();
  }, [value, run]);
  return <span ref={ref}>{short(value)}</span>;
}

function StatusPill({ status }: { status: Status }) {
  return <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", STATUS_STYLE[status])}>{status}</span>;
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("min-w-0 rounded-2xl border border-border bg-white/70 p-4", className)}>{children}</div>;
}

/** Interactive SOCIO dashboard: navigable views, live chart, actions and an AI question bar. */
export function SocioDashboard({ active }: { active?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.35, once: true });
  const visible = useInView(ref, { amount: 0.35 });
  const inView = active ?? seen;
  const live = active ?? visible;
  const reduced = useReducedMotion();
  const run = inView && !reduced;

  const [view, setView] = useState<View>("Inicio");
  const [invoices, setInvoices] = useState<Invoice[]>(START);
  const [filter, setFilter] = useState<Status | "Todas">("Todas");
  const [query, setQuery] = useState("");
  const [reminded, setReminded] = useState<number[]>([]);
  const [hoverMonth, setHoverMonth] = useState<number | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<{ q: string; a: string } | null>(null);
  const [touched, setTouched] = useState(false);

  const facturado = useMemo(() => invoices.reduce((s, i) => s + i.amount, 0), [invoices]);
  const cobrado = useMemo(() => invoices.filter((i) => i.status === "Cobrada").reduce((s, i) => s + i.amount, 0), [invoices]);
  const debts = useMemo(() => invoices.filter((i) => i.status !== "Cobrada"), [invoices]);
  const deben = debts.reduce((s, i) => s + i.amount, 0);
  const costos = COSTS.reduce((s, c) => s + c.amount, 0);

  const notify = (t: { title: string; body: string }) => {
    setToast(t);
    window.setTimeout(() => setToast((cur) => (cur === t ? null : cur)), 2600);
  };

  const ask = (q: string) => {
    const t = q.toLowerCase();
    let a: string;
    if (/deb|deud|cobrar/.test(t)) {
      a = debts.length
        ? `Te deben ${short(deben)} en ${debts.length} facturas: ${debts
            .slice(0, 3)
            .map((d) => d.who)
            .join(", ")}${debts.length > 3 ? " y más" : ""}.`
        : "Nadie te debe nada. ¡Todo cobrado!";
    } else if (/tope|categor|monotrib/.test(t)) {
      a = "Vas bien: con lo que facturaste te queda margen hasta fin de año en tu categoría.";
    } else if (/cobr/.test(t)) {
      a = `Cobraste ${short(cobrado)}, el ${Math.round((cobrado / facturado) * 100)} % de lo facturado.`;
    } else if (/cost|gast/.test(t)) {
      a = `Tus costos del mes son ${short(costos)}. Te quedan ${short(facturado - costos)}.`;
    } else if (/factur/.test(t)) {
      a = `Facturaste ${short(facturado)} en ${invoices.length} facturas. Cobraste ${short(cobrado)}.`;
    } else {
      a = "Puedo decirte cuánto facturaste, quién te debe, tus costos o si te acercás al tope.";
    }
    setAnswer({ q, a });
  };

  // Demo: type a question on its own until the visitor interacts.
  useEffect(() => {
    if (!live || reduced || touched) return;
    let qi = 0;
    const timers: number[] = [];
    const cycle = () => {
      const q = SUGGESTIONS[qi % SUGGESTIONS.length];
      qi += 1;
      setAnswer(null);
      for (let i = 1; i <= q.length; i++) timers.push(window.setTimeout(() => setQuestion(q.slice(0, i)), 500 + i * 45));
      timers.push(
        window.setTimeout(() => {
          ask(q);
          setQuestion("");
        }, 500 + q.length * 45 + 600),
      );
      timers.push(window.setTimeout(cycle, 500 + q.length * 45 + 6000));
    };
    timers.push(window.setTimeout(cycle, 1200));
    return () => timers.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, reduced, touched]);

  const interact = () => {
    if (!touched) {
      setTouched(true);
      setQuestion("");
    }
  };

  const onAsk = (e: FormEvent) => {
    e.preventDefault();
    interact();
    if (question.trim()) {
      ask(question.trim());
      setQuestion("");
    }
  };

  const markPaid = (id: number) => {
    setInvoices((list) => list.map((i) => (i.id === id ? { ...i, status: "Cobrada" } : i)));
    notify({ title: "Factura marcada como cobrada", body: "Se actualizó tu cobranza" });
  };

  const remind = (inv: Invoice) => {
    setReminded((r) => [...r, inv.id]);
    notify({ title: `Recordatorio enviado a ${inv.who}`, body: "Por WhatsApp, con el PDF adjunto" });
  };

  const createInvoice = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const amount = Number(String(data.get("monto")).replace(/\D/g, "")) || 0;
    const who = String(data.get("cliente")).trim() || "Cliente";
    const id = Math.max(...invoices.map((i) => i.id)) + 1;
    setInvoices((list) => [{ id, who, what: String(data.get("concepto")).trim() || "Servicio", status: "Pendiente", amount, date: "Hoy" }, ...list]);
    setNewOpen(false);
    setView("Inicio");
    notify({ title: `Factura C 0001-${String(id).padStart(8, "0")} emitida`, body: `${who} · ${money(amount)} · PDF listo` });
  };

  const q = query.trim().toLowerCase();
  const listed = invoices.filter((i) => (filter === "Todas" || i.status === filter) && (!q || `${i.who} ${i.what}`.toLowerCase().includes(q)));
  const clients = Object.values(
    invoices.reduce<Record<string, { who: string; total: number; owed: number; count: number }>>((acc, i) => {
      acc[i.who] ??= { who: i.who, total: 0, owed: 0, count: 0 };
      acc[i.who].total += i.amount;
      acc[i.who].count += 1;
      if (i.status !== "Cobrada") acc[i.who].owed += i.amount;
      return acc;
    }, {}),
  ).filter((c) => !q || c.who.toLowerCase().includes(q));
  const maxMonth = Math.max(...MONTHS.map((m) => m.f));

  const KPIS = [
    { label: "Facturado", value: facturado, note: `${invoices.length} facturas`, go: "Facturas" as View },
    { label: "Cobrado", value: cobrado, note: `${Math.round((cobrado / facturado) * 100)} % de lo facturado`, go: "Facturas" as View },
    { label: "Te deben", value: deben, note: `${debts.length} facturas`, go: "Cobranza" as View },
    { label: "Costos", value: costos, note: `te quedan ${short(facturado - costos)}`, go: "Costos" as View },
  ];

  return (
    <div
      ref={ref}
      onPointerDown={interact}
      className="relative flex h-full min-h-[560px] overflow-hidden rounded-[28px] lg:min-h-0 bg-hueso text-azul shadow-[0_40px_80px_-30px_rgb(0_0_60/0.5)] ring-1 ring-noche/5"
    >
      {/* Sidebar */}
      <aside className="hidden w-48 shrink-0 flex-col border-r border-border p-4 md:flex">
        <div className="flex items-center gap-2 px-2 pb-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SOCIO_AVATAR} alt="" width={26} height={26} className="size-[26px] rounded-full" />
          <span className="font-display text-xl font-semibold tracking-[-0.03em]">socio</span>
        </div>
        <nav className="flex flex-col gap-0.5 text-[15px]">
          {NAV.map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              onClick={() => setView(label)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                view === label ? "bg-hielo font-medium" : "text-azul/70 hover:bg-hielo/60 hover:text-azul",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {label}
              {label === "Cobranza" && debts.length > 0 && (
                <span className="ml-auto rounded-full bg-ambar px-1.5 text-[11px] font-medium text-noche">{debts.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-azul/70">
          <span className="flex size-7 items-center justify-center rounded-full bg-azul text-[11px] font-medium text-hueso">T</span>
          <span className="leading-tight">
            Taller Ruiz
            <br />
            Plan activo
          </span>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-5">
          <div className="leading-tight">
            <p className="text-base font-semibold">{view}</p>
            <p className="text-xs text-azul/60">Jueves 30 de octubre</p>
          </div>
          <label className="ml-auto hidden items-center gap-1.5 rounded-lg border border-border bg-white/60 px-2.5 py-1.5 text-sm focus-within:border-azul sm:flex">
            <Search className="size-4 text-azul/60" aria-hidden />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (view === "Inicio" || view === "Costos") setView("Facturas");
              }}
              placeholder="Buscar cliente"
              className="w-32 bg-transparent text-azul outline-none placeholder:text-azul/50 lg:w-40"
            />
          </label>
          <button
            type="button"
            onClick={() => setNewOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-azul px-3 py-2 text-sm font-medium text-hueso transition-colors hover:bg-noche"
          >
            <Plus className="size-4" aria-hidden />
            <span className="hidden sm:inline">Nueva factura</span>
          </button>
        </div>

        {/* Mobile view switcher */}
        <div className="flex gap-1 overflow-x-auto border-b border-border px-3 py-2 md:hidden">
          {NAV.map(({ label }) => (
            <button
              key={label}
              type="button"
              onClick={() => setView(label)}
              className={cn("shrink-0 rounded-full px-3 py-1 text-xs", view === label ? "bg-azul text-hueso" : "bg-hielo text-azul")}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
              {view === "Inicio" && (
                <>
                  <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                    {KPIS.map((k) => (
                      <button
                        key={k.label}
                        type="button"
                        onClick={() => setView(k.go)}
                        className="group rounded-2xl border border-border bg-white/70 p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-azul/40 hover:shadow-[0_10px_24px_-14px_rgb(0_0_120/0.5)]"
                      >
                        <p className="text-xs text-azul/60">{k.label}</p>
                        <p className="mt-1 font-display text-2xl leading-none font-semibold tracking-[-0.03em] tabular-nums">
                          <Counter value={k.value} run={run} />
                        </p>
                        <p className="mt-1.5 truncate text-[11px] text-azul/60 group-hover:text-azul">{k.note} →</p>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                    <Card>
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs">
                        <span className="text-sm font-medium">Evolución mensual</span>
                        <span className="flex items-center gap-3 text-azul/60">
                          <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-azul" />Facturado</span>
                          <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-hielo ring-1 ring-azul/20" />Cobrado</span>
                        </span>
                      </div>
                      <div className="relative mt-4 flex items-end gap-3" onMouseLeave={() => setHoverMonth(null)}>
                        {MONTHS.map((mo, i) => (
                          <button
                            key={mo.m}
                            type="button"
                            onMouseEnter={() => setHoverMonth(i)}
                            onFocus={() => setHoverMonth(i)}
                            onClick={() => setHoverMonth(i)}
                            className="relative flex flex-1 flex-col items-center gap-1.5 outline-none"
                            aria-label={`${mo.m}: facturado ${mo.f} mil, cobrado ${mo.c} mil`}
                          >
                            <AnimatePresence>
                              {hoverMonth === i && (
                                <motion.span
                                  className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-noche px-2 py-1 text-[11px] whitespace-nowrap text-hueso shadow-lg"
                                  initial={{ opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0 }}
                                >
                                  {short(mo.f * 1000)} · cobrado {short(mo.c * 1000)}
                                </motion.span>
                              )}
                            </AnimatePresence>
                            <div className="flex h-36 w-full items-end justify-center gap-1">
                              {[
                                { v: mo.f / maxMonth, cls: "bg-azul" },
                                { v: mo.c / maxMonth, cls: "bg-hielo ring-1 ring-azul/15" },
                              ].map((bar, j) => (
                                <motion.span
                                  key={j}
                                  className={cn("w-1/2 max-w-4 origin-bottom rounded-t-md transition-opacity", bar.cls, hoverMonth !== null && hoverMonth !== i && "opacity-40")}
                                  style={{ height: `${bar.v * 100}%` }}
                                  initial={{ scaleY: reduced ? 1 : 0 }}
                                  animate={{ scaleY: run || reduced ? 1 : 0 }}
                                  transition={{ duration: 0.8, delay: 0.2 + i * 0.07 + j * 0.04, ease: [0.22, 1, 0.36, 1] }}
                                />
                              ))}
                            </div>
                            <span className={cn("text-[11px]", hoverMonth === i ? "font-semibold text-azul" : "text-azul/60")}>{mo.m}</span>
                          </button>
                        ))}
                      </div>
                    </Card>
                    <Card>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-sm font-medium">Últimas facturas</span>
                        <button type="button" onClick={() => setView("Facturas")} className="text-azul/60 hover:text-azul">
                          Ver todas
                        </button>
                      </div>
                      <ul className="mt-2 divide-y divide-border text-sm">
                        <AnimatePresence initial={false}>
                          {invoices.slice(0, 4).map((inv) => (
                            <motion.li key={inv.id} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 py-2">
                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-medium">{inv.who}</span>
                                <span className="block truncate text-xs text-azul/60">{inv.what}</span>
                              </span>
                              <StatusPill status={inv.status} />
                              <span className="shrink-0 text-right font-medium tabular-nums sm:w-24">{money(inv.amount)}</span>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>
                    </Card>
                  </div>
                </>
              )}

              {view === "Facturas" && (
                <Card>
                  <div className="flex flex-wrap gap-1.5">
                    {(["Todas", "Cobrada", "Pendiente", "Vencida"] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFilter(f)}
                        className={cn("rounded-full px-3 py-1 text-xs transition-colors", filter === f ? "bg-azul text-hueso" : "bg-hielo text-azul hover:bg-hielo/70")}
                      >
                        {f === "Todas" ? "Todas" : `${f}s`}
                      </button>
                    ))}
                    {q && (
                      <button type="button" onClick={() => setQuery("")} className="ml-auto flex items-center gap-1 text-xs text-azul/60 hover:text-azul">
                        “{query}” <X className="size-3" aria-hidden />
                      </button>
                    )}
                  </div>
                  <ul className="mt-3 divide-y divide-border text-sm">
                    {listed.map((inv) => (
                      <li key={inv.id} className="flex items-center gap-3 py-2.5">
                        <span className="hidden w-24 shrink-0 font-mono text-[11px] text-azul/60 sm:block">0001-{String(inv.id).padStart(5, "0")}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{inv.who}</span>
                          <span className="block truncate text-xs text-azul/60">
                            {inv.what} · {inv.date}
                          </span>
                        </span>
                        <StatusPill status={inv.status} />
                        <span className="shrink-0 text-right font-medium tabular-nums sm:w-24">{money(inv.amount)}</span>
                      </li>
                    ))}
                    {listed.length === 0 && <li className="py-6 text-center text-azul/60">No hay facturas con ese filtro.</li>}
                  </ul>
                </Card>
              )}

              {view === "Cobranza" && (
                <Card>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium">Quién te debe</span>
                    <span className="font-display text-xl font-semibold tabular-nums">{short(deben)}</span>
                  </div>
                  <ul className="mt-3 divide-y divide-border text-sm">
                    <AnimatePresence initial={false}>
                      {debts.map((inv) => (
                        <motion.li key={inv.id} layout exit={{ opacity: 0, x: 30 }} className="flex flex-wrap items-center gap-2 py-2.5">
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium">{inv.who}</span>
                            <span className="block truncate text-xs text-azul/60">
                              {inv.what} · {inv.date}
                            </span>
                          </span>
                          <StatusPill status={inv.status} />
                          <span className="w-24 shrink-0 text-right font-medium tabular-nums">{money(inv.amount)}</span>
                          <span className="flex w-full justify-end gap-1.5 sm:w-auto">
                            <button
                              type="button"
                              disabled={reminded.includes(inv.id)}
                              onClick={() => remind(inv)}
                              className="flex items-center gap-1 rounded-full bg-hielo px-2.5 py-1 text-xs transition-colors hover:bg-azul hover:text-hueso disabled:bg-transparent disabled:text-azul/60"
                            >
                              {reminded.includes(inv.id) ? <Check className="size-3" aria-hidden /> : <Send className="size-3" aria-hidden />}
                              {reminded.includes(inv.id) ? "Enviado" : "Recordar"}
                            </button>
                            <button
                              type="button"
                              onClick={() => markPaid(inv.id)}
                              className="rounded-full border border-azul/30 px-2.5 py-1 text-xs transition-colors hover:border-azul hover:bg-azul hover:text-hueso"
                            >
                              Cobrada
                            </button>
                          </span>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                    {debts.length === 0 && <li className="py-6 text-center text-azul/60">Nadie te debe nada. ¡Todo cobrado!</li>}
                  </ul>
                </Card>
              )}

              {view === "Clientes" && (
                <Card>
                  <ul className="divide-y divide-border text-sm">
                    {clients.map((c) => (
                      <li key={c.who} className="flex items-center gap-3 py-2.5">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-hielo text-xs font-semibold">{c.who.charAt(0)}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{c.who}</span>
                          <span className="block text-xs text-azul/60">
                            {c.count} {c.count === 1 ? "factura" : "facturas"} · {money(c.total)}
                          </span>
                        </span>
                        {c.owed > 0 ? (
                          <span className="shrink-0 rounded-full bg-ambar/25 px-2 py-0.5 text-[11px] font-medium text-noche">Debe {short(c.owed)}</span>
                        ) : (
                          <span className="shrink-0 rounded-full bg-hielo px-2 py-0.5 text-[11px] font-medium">Al día</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {view === "Costos" && (
                <Card>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium">Costos de octubre</span>
                    <span className="font-display text-xl font-semibold tabular-nums">{short(costos)}</span>
                  </div>
                  <ul className="mt-3 space-y-3 text-sm">
                    {COSTS.map((c) => (
                      <li key={c.what}>
                        <div className="flex items-center justify-between">
                          <span>
                            <span className="font-medium">{c.what}</span> <span className="text-xs text-azul/60">· {c.who}</span>
                          </span>
                          <span className="font-medium tabular-nums">{money(c.amount)}</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-hielo">
                          <motion.div className="h-full rounded-full bg-azul" initial={{ width: 0 }} animate={{ width: `${(c.amount / costos) * 100}%` }} transition={{ duration: 0.7 }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 rounded-xl bg-hielo px-3 py-2 text-sm">
                    Facturaste {short(facturado)} y gastaste {short(costos)}: <strong>te quedan {short(facturado - costos)}</strong>.
                  </p>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ChatGPT / Claude question bar */}
        <form onSubmit={onAsk} className="m-3 mt-0 rounded-2xl border border-border bg-white px-3 py-2.5 shadow-[0_2px_8px_-4px_rgb(0_0_60/0.15)] sm:m-4 sm:mt-0">
          <div className="flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-hielo">
              <Sparkles className="size-3.5" aria-hidden />
            </span>
            <input
              value={question}
              onChange={(e) => {
                interact();
                setQuestion(e.target.value);
              }}
              onFocus={interact}
              placeholder="Preguntale a ChatGPT o Claude sobre tus números…"
              className="min-w-0 flex-1 bg-transparent text-sm text-azul outline-none placeholder:text-azul/50"
            />
            <span className="hidden shrink-0 items-center gap-1 text-[11px] text-azul/60 lg:flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/brand/openai.svg")} alt="" width={12} height={12} className="size-3" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/brand/claude.svg")} alt="" width={12} height={12} className="size-3" />
              conectado
            </span>
            <button type="submit" aria-label="Preguntar" className="flex size-7 shrink-0 items-center justify-center rounded-full bg-azul text-hueso hover:bg-noche">
              <ArrowUp className="size-4" aria-hidden />
            </button>
          </div>
          <AnimatePresence initial={false} mode="wait">
            {answer && (
              <motion.p
                key={answer.a}
                className="mt-2 border-t border-border pt-2 text-sm text-azul/85"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <span className="text-azul/55">{answer.q} · </span>
                {answer.a}
              </motion.p>
            )}
          </AnimatePresence>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SUGGESTIONS.filter((sg) => sg !== answer?.q).map((sg) => (
              <button
                key={sg}
                type="button"
                onClick={() => {
                  interact();
                  ask(sg);
                }}
                className="rounded-full bg-hielo px-2.5 py-1 text-xs transition-colors hover:bg-azul hover:text-hueso"
              >
                {sg}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* New invoice */}
      <AnimatePresence>
        {newOpen && (
          <motion.div className="absolute inset-0 z-20 flex items-center justify-center bg-noche/30 p-4 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.form
              onSubmit={createInvoice}
              className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
              initial={{ y: 16, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 10, opacity: 0 }}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-lg font-semibold">Nueva factura C</p>
                <button type="button" onClick={() => setNewOpen(false)} aria-label="Cerrar" className="rounded-full p-1 hover:bg-hielo">
                  <X className="size-4" />
                </button>
              </div>
              <p className="mt-1 text-xs text-azul/60">O mandale un audio a SOCIO por WhatsApp y la arma solo.</p>
              {[
                { name: "cliente", label: "Cliente", value: "Juan Pérez" },
                { name: "concepto", label: "Concepto", value: "Arreglo de suspensión" },
                { name: "monto", label: "Monto", value: "50.000" },
              ].map((f) => (
                <label key={f.name} className="mt-3 block text-xs text-azul/60">
                  {f.label}
                  <input
                    name={f.name}
                    defaultValue={f.value}
                    inputMode={f.name === "monto" ? "numeric" : undefined}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm text-azul outline-none focus:border-azul"
                  />
                </label>
              ))}
              <button type="submit" className="mt-4 w-full rounded-lg bg-azul py-2.5 text-sm font-medium text-hueso hover:bg-noche">
                Emitir en ARCA
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toasts */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.title}
            className="absolute right-3 bottom-36 z-30 flex w-[min(80%,320px)] items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_18px_40px_-14px_rgb(0_0_60/0.45)] ring-1 ring-noche/5 sm:right-5"
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-hielo text-azul">
              <Check className="size-4" aria-hidden />
            </span>
            <span className="min-w-0 text-sm leading-tight">
              <span className="block truncate font-semibold">{toast.title}</span>
              <span className="block truncate text-xs text-azul/60">{toast.body}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
