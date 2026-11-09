"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { CheckCheck, FileText, Mic, Plus } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CARPINCHO } from "./assets";

type Convo = { prompt: string; intro: string; card: ReactNode; question: string; answer?: string; done: ReactNode };

function Card({ title, amount, rows }: { title: string; amount: string; rows?: [string, string][] }) {
  return (
    <div className="rounded-2xl border border-azul/15 bg-hueso p-3.5">
      <p className="font-mono text-[11px] tracking-[0.08em] text-azul/70 uppercase">{title}</p>
      <p className="mt-1 text-[28px] leading-none font-extrabold tracking-[-0.03em]">{amount}</p>
      {rows && (
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-azul/15 pt-2.5 text-[13px]">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-azul/70">{k}</dt>
              <dd className="truncate text-right font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function Pdf({ name }: { name: string }) {
  return (
    <span className="flex items-center gap-2.5 rounded-xl bg-hueso px-3 py-2.5">
      <span className="flex size-9 items-center justify-center rounded-lg bg-azul text-hueso">
        <FileText className="size-4" aria-hidden />
      </span>
      <span className="font-mono text-[13px]">{name}</span>
    </span>
  );
}

const CONVOS: Convo[] = [
  {
    prompt: "Le cobré $45.000 a Taller Ramírez, service completo",
    intro: "Armé esta factura:",
    card: <Card title="Factura C · Taller Ramírez" amount="$45.000" rows={[["Concepto", "Service completo"], ["Fecha", "Hoy"]]} />,
    question: "¿La emito en ARCA?",
    answer: "Sí",
    done: (
      <>
        <p>Listo, emitida en ARCA.</p>
        <Pdf name="Factura_C.pdf" />
      </>
    ),
  },
  {
    prompt: "¿Cuánto facturé en octubre?",
    intro: "Este es tu resumen de octubre:",
    card: <Card title="Resumen · Octubre" amount="$612.300" rows={[["Facturas", "14"], ["Cliente principal", "Estudio Prado"]]} />,
    question: "¿Te mando el detalle en PDF?",
    answer: "Dale",
    done: <Pdf name="Resumen_octubre.pdf" />,
  },
  {
    prompt: "Haceme un presupuesto para Lucía Gómez: pintura de living, $120.000",
    intro: "Preparé el presupuesto:",
    card: <Card title="Presupuesto · Lucía Gómez" amount="$120.000" rows={[["Trabajo", "Pintura de living"], ["Validez", "15 días"]]} />,
    question: "¿Se lo mando a Lucía?",
    answer: "Sí, mandalo",
    done: <p>Enviado. Te aviso cuando lo vea.</p>,
  },
  {
    prompt: "Recordame cobrarle a Pérez el viernes",
    intro: "Anotado:",
    card: <Card title="Recordatorio · Viernes 9:00" amount="Cobrar a Pérez" />,
    question: "¿Querés que le mande un mensaje ese día?",
    answer: "No, solo avisame",
    done: <p>Perfecto, el viernes te aviso.</p>,
  },
];

function Bubble({ side, children, className }: { side: "in" | "out"; children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={cn(
        "max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-snug",
        side === "out" ? "self-end rounded-br-md bg-azul text-hueso" : "self-start rounded-bl-md bg-white text-azul",
        className,
      )}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
    >
      {children}
    </motion.div>
  );
}

function Typing() {
  return (
    <motion.div className="flex gap-1 self-start rounded-2xl rounded-bl-md bg-white px-4 py-3.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-azul/50"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </motion.div>
  );
}

/** Conversación de ejemplo con SOCIO, con el estilo de chat del manual. */
export function ChatDemo({ playing, className }: { playing?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  const active = (playing ?? inView) && !reduced;
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) return;
    const t = [
      window.setTimeout(() => setStep(1), 700),
      window.setTimeout(() => setStep(2), 1900),
      window.setTimeout(() => setStep(3), 3600),
      window.setTimeout(() => setStep(4), 4500),
      window.setTimeout(() => {
        setStep(0);
        setIndex((i) => (i + 1) % CONVOS.length);
      }, 9000),
    ];
    return () => t.forEach(window.clearTimeout);
  }, [active, index]);

  const s = reduced ? 4 : step;
  const c = CONVOS[index];
  const av = CARPINCHO.avatar;

  return (
    <div ref={ref} className={cn("flex h-full flex-col overflow-hidden rounded-[28px] bg-hielo text-azul shadow-[0_40px_80px_-30px_rgb(0_0_60/0.55)]", className)}>
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-azul/15 bg-hueso px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={av.src} alt="" width={40} height={40} className="size-10 rounded-full" />
        <div className="leading-tight">
          <p className="text-[15px] font-extrabold tracking-[-0.01em]">SOCIO</p>
          <p className="font-mono text-[11px] text-azul/70">en línea</p>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-4 py-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={index} className="flex flex-col gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -12, transition: { duration: 0.3 } }}>
            <Bubble side="out">
              {c.prompt}
              <CheckCheck className="ml-1.5 inline size-3.5 text-hielo" aria-hidden />
            </Bubble>
            {s === 1 && <Typing />}
            {s >= 2 && (
              <Bubble side="in" className="flex w-[82%] flex-col gap-2.5">
                <p>{c.intro}</p>
                {c.card}
                <p className="font-semibold">{c.question}</p>
                {c.answer && (
                  <span className={cn("self-start rounded-full px-4 py-2 text-sm font-semibold transition-colors", s >= 3 ? "bg-ambar text-noche" : "border-[1.5px] border-azul/30 text-azul")}>
                    {c.answer}
                  </span>
                )}
              </Bubble>
            )}
            {s >= 3 && c.answer && <Bubble side="out">{c.answer}</Bubble>}
            {s >= 4 && <Bubble side="in" className="flex flex-col gap-2">{c.done}</Bubble>}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="m-3 mt-0 flex h-12 shrink-0 items-center gap-2 rounded-full bg-hueso px-2">
        <span className="flex size-8 items-center justify-center text-azul/60">
          <Plus className="size-4" aria-hidden />
        </span>
        <span className="flex-1 truncate text-[15px] text-azul/50">Escribí un mensaje</span>
        <span className="flex size-8 items-center justify-center rounded-full bg-azul text-hueso">
          <Mic className="size-4" aria-hidden />
        </span>
      </div>
    </div>
  );
}
