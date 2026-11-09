"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUp, Calendar, Download, Mail, Plus, Tag } from "lucide-react";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { asset } from "./shared";

const HOSTS = {
  chatgpt: { name: "ChatGPT", logo: asset("/brand/openai.svg"), surface: "bg-white", bubble: "bg-[#f4f4f4]" },
  claude: { name: "Claude", logo: asset("/brand/claude.svg"), surface: "bg-[#faf9f5]", bubble: "bg-[#f0eee6]" },
};

function Badge({ children }: { children: ReactNode }) {
  return <span className="shrink-0 rounded-md bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-700">{children}</span>;
}
function GhostAction({ children }: { children: ReactNode }) {
  return <span className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-black/[0.05] px-3.5 text-sm font-medium text-black">{children}</span>;
}
function SolidAction({ children }: { children: ReactNode }) {
  return <span className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-black px-3.5 text-sm font-medium text-white [&_svg]:size-4">{children}</span>;
}
function Widget({ eyebrow, title, badge, children, actions }: { eyebrow: string; title: string; badge: string; children: ReactNode; actions: ReactNode }) {
  return (
    <div className="w-full rounded-2xl border border-black/10 bg-white p-4 text-black shadow-[0_6px_20px_-10px_rgb(0_0_0/0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-black/50">{eyebrow}</p>
          <p className="mt-0.5 truncate text-[15px] font-semibold">{title}</p>
        </div>
        <Badge>{badge}</Badge>
      </div>
      <div className="mt-3">{children}</div>
      <div className="mt-4 flex gap-2 border-t border-black/[0.06] pt-3">{actions}</div>
    </div>
  );
}
function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
      {rows.map(([k, v]) => (
        <Fragment key={k}>
          <dt className="text-black/50">{k}</dt>
          <dd className="truncate text-right">{v}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

const CONVERSATIONS: { host: keyof typeof HOSTS; prompt: string; reply: string; widget: ReactNode }[] = [
  {
    host: "chatgpt",
    prompt: "Armame el informe de rendimiento del rodeo de octubre",
    reply: "¿Querés que te arme la lista de los 4 animales con alertas?",
    widget: (
      <Widget
        eyebrow="Informe de rendimiento · Octubre"
        title="Rodeo La Esperanza · 120 animales"
        badge="Listo"
        actions={
          <>
            <GhostAction>Ver informe</GhostAction>
            <SolidAction>
              <Download aria-hidden />
              Descargar PDF
            </SolidAction>
          </>
        }
      >
        <div className="grid grid-cols-3 gap-2">
          {[
            ["Ganancia diaria", "0,82 kg", "+6 %"],
            ["Preñez", "87 %", "+3 %"],
            ["Con alertas", "4", "de 120"],
          ].map(([label, value, delta]) => (
            <div key={label} className="rounded-xl bg-black/[0.03] p-2.5">
              <p className="truncate text-xs text-black/50">{label}</p>
              <p className="mt-0.5 text-lg leading-tight font-semibold">{value}</p>
              <p className="text-xs text-emerald-700">{delta}</p>
            </div>
          ))}
        </div>
      </Widget>
    ),
  },
  {
    host: "claude",
    prompt: "¿Qué vacas me conviene vender esta semana?",
    reply: "Si querés, busco compradores y te paso precios de referencia del lote.",
    widget: (
      <Widget
        eyebrow="Sugerencia de venta"
        title="3 vacas listas para vender"
        badge="Peso ideal"
        actions={
          <>
            <GhostAction>Ver detalles</GhostAction>
            <SolidAction>
              <Tag aria-hidden />
              Armar lote
            </SolidAction>
          </>
        }
      >
        <ul className="divide-y divide-black/[0.06] text-sm">
          {[
            ["Vaca #233", "512 kg · 6 años", "Rinde bajo"],
            ["Vaca #118", "488 kg · 7 años", "Vacía 2 servicios"],
            ["Vaca #341", "530 kg · 5 años", "Peso ideal"],
          ].map(([name, meta, note]) => (
            <li key={name} className="flex items-center gap-3 py-1.5">
              <span className="font-medium">{name}</span>
              <span className="truncate text-black/50">{meta}</span>
              <span className="ml-auto shrink-0 text-black/70">{note}</span>
            </li>
          ))}
        </ul>
      </Widget>
    ),
  },
  {
    host: "chatgpt",
    prompt: "Haceme una orden de compra de sal mineral y vacunas y mandásela a la veterinaria",
    reply: "Revisala y, si está bien, la mando desde tu mail.",
    widget: (
      <Widget
        eyebrow="Orden de compra #0042 · por mail"
        title="Agroveterinaria San Martín"
        badge="Borrador"
        actions={
          <>
            <GhostAction>Editar</GhostAction>
            <SolidAction>
              <Mail aria-hidden />
              Enviar mail
            </SolidAction>
          </>
        }
      >
        <Rows
          rows={[
            ["Sal mineral 25 kg", "40 bolsas"],
            ["Vacuna antiaftosa", "120 dosis"],
            ["Entrega", "Viernes, en el campo"],
          ]}
        />
      </Widget>
    ),
  },
  {
    host: "claude",
    prompt: "Agendá al veterinario para que revise a la #010 mañana temprano",
    reply: "¿Le mando también el historial de temperatura de la #010?",
    widget: (
      <Widget
        eyebrow="Visita veterinaria"
        title="Mañana · 8:00 · Potrero norte"
        badge="Agendado"
        actions={
          <>
            <GhostAction>Cambiar hora</GhostAction>
            <SolidAction>
              <Calendar aria-hidden />
              Confirmar
            </SolidAction>
          </>
        }
      >
        <Rows
          rows={[
            ["Animal", "Vaca #010"],
            ["Motivo", "Fiebre 40,3 °C hace 3 h"],
            ["Veterinario", "Dr. Pérez"],
          ]}
        />
      </Widget>
    ),
  },
];

export function ChatHeading({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-col items-center text-center text-white", className)}>
      <h2 className="font-display text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance [text-shadow:0_2px_24px_rgb(0_40_90/0.25)]">
        <span className="block">Pedile lo que quieras,</span>
        <span className="block">desde donde quieras</span>
      </h2>
      <p className="mt-4 max-w-xl text-base text-pretty text-white/90 [text-shadow:0_1px_12px_rgb(0_40_90/0.3)] sm:text-lg">
        Conectá core con ChatGPT o Claude y consultá tu rodeo, armá informes o mandá pedidos sin salir del chat.
      </p>
      <span aria-hidden className="mx-auto mt-8 block h-px w-48 bg-white/70" />
    </div>
  );
}

function Shimmer({ children }: { children: ReactNode }) {
  return (
    <motion.span
      className="bg-[linear-gradient(90deg,rgb(0_0_0/0.35)_0%,rgb(0_0_0/0.85)_50%,rgb(0_0_0/0.35)_100%)] bg-[length:200%_100%] bg-clip-text text-[15px] text-transparent"
      animate={{ backgroundPosition: ["100% 0%", "-100% 0%"] }}
      transition={{ duration: 1.6, ease: "linear", repeat: Infinity }}
    >
      {children}
    </motion.span>
  );
}

export function ChatDemo({ playing, className }: { playing?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduced = useReducedMotion();
  const active = (playing ?? inView) && !reduced;
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timers = [
      window.setTimeout(() => setStep(1), 900),
      window.setTimeout(() => setStep(2), 2300),
      window.setTimeout(() => {
        setStep(0);
        setIndex((i) => (i + 1) % CONVERSATIONS.length);
      }, 8000),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [active, index]);

  const shown = reduced ? 2 : step;
  const convo = CONVERSATIONS[index];
  const host = HOSTS[convo.host];

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[28px] font-[system-ui,-apple-system,'Segoe_UI',sans-serif] text-black shadow-[0_40px_80px_-30px_rgb(0_30_70/0.45)] ring-1 ring-black/5 transition-colors duration-500",
        host.surface,
        className,
      )}
    >
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-black/[0.06] px-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={convo.host}
            className="flex items-center gap-2 text-sm font-medium"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={host.logo} alt="" width={16} height={16} className="size-4" />
            {host.name}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-5 py-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.3 } }}
          >
            <motion.p
              className={cn("max-w-[80%] self-end rounded-3xl px-4 py-2.5 text-[15px]", host.bubble)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              {convo.prompt}
            </motion.p>
            {shown >= 1 && (
              <motion.div className="flex flex-col gap-2.5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <span className="flex items-center gap-1.5 text-xs text-black/50">
                  <span className="flex size-5 items-center justify-center rounded-md bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset("/brand/logo-poppins.svg")} alt="" width={277} height={86} className="h-auto w-3 brightness-0 invert" />
                  </span>
                  core
                </span>
                {shown === 1 ? (
                  <Shimmer>Consultando los datos de tu rodeo…</Shimmer>
                ) : (
                  <motion.div className="flex flex-col gap-3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 240, damping: 26 }}>
                    {convo.widget}
                    <p className="text-[15px] leading-snug">{convo.reply}</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="m-3 mt-0 flex h-12 shrink-0 items-center gap-2 rounded-full border border-black/10 bg-white px-2 shadow-[0_2px_8px_-4px_rgb(0_0_0/0.12)]">
        <span className="flex size-8 items-center justify-center rounded-full text-black/50">
          <Plus className="size-4" aria-hidden />
        </span>
        <span className="flex-1 truncate text-[15px] text-black/40">Preguntale lo que quieras a core…</span>
        <span className="flex size-8 items-center justify-center rounded-full bg-black text-white">
          <ArrowUp className="size-4" aria-hidden />
        </span>
      </div>
    </div>
  );
}
