"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Check, FileText, Mic, Plus, Send } from "lucide-react";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SOCIO_AVATAR } from "./assets";

function Badge({ children }: { children: ReactNode }) {
  return <span className="shrink-0 rounded-md bg-hielo px-1.5 py-0.5 text-xs font-medium text-azul">{children}</span>;
}
function GhostAction({ children }: { children: ReactNode }) {
  return <span className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-noche/[0.05] px-3.5 text-sm font-medium text-noche">{children}</span>;
}
function SolidAction({ children }: { children: ReactNode }) {
  return <span className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-azul px-3.5 text-sm font-medium text-hueso [&_svg]:size-4">{children}</span>;
}
function Widget({ eyebrow, title, badge, children, actions }: { eyebrow: string; title: string; badge: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="w-full rounded-2xl border border-noche/10 bg-white p-4 text-noche shadow-[0_6px_20px_-10px_rgb(0_0_0/0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-noche/50">{eyebrow}</p>
          <p className="mt-0.5 truncate text-[15px] font-semibold">{title}</p>
        </div>
        <Badge>{badge}</Badge>
      </div>
      <div className="mt-3">{children}</div>
      {actions && <div className="mt-4 flex gap-2 border-t border-noche/[0.06] pt-3">{actions}</div>}
    </div>
  );
}
function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
      {rows.map(([k, v]) => (
        <Fragment key={k}>
          <dt className="text-noche/50">{k}</dt>
          <dd className="truncate text-right">{v}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

const CONVERSATIONS: { prompt: string; reply: string; widget: ReactNode }[] = [
  {
    prompt: "Le cobré 45 lucas a Martina López por el diseño del logo",
    reply: "Listo. ¿La emito?",
    widget: (
      <Widget
        eyebrow="Factura C · Borrador"
        title="Martina López"
        badge="Borrador"
        actions={
          <>
            <GhostAction>Cambiar dato</GhostAction>
            <SolidAction>
              <Check aria-hidden />
              Sí, emitir
            </SolidAction>
          </>
        }
      >
        <Rows
          rows={[
            ["Concepto", "Diseño de logo"],
            ["Monto", "$45.000"],
          ]}
        />
      </Widget>
    ),
  },
  {
    prompt: "¿Quién me debe?",
    reply: "¿Querés que les mande un recordatorio?",
    widget: (
      <Widget eyebrow="Cuenta corriente" title="Te deben $120.000" badge="3 clientes" actions={<><GhostAction>Ver detalle</GhostAction><SolidAction><Send aria-hidden />Recordarles</SolidAction></>}>
        <ul className="divide-y divide-noche/[0.06] text-sm">
          {[
            ["García", "$70.000"],
            ["López", "$35.000"],
            ["Taller Ruiz", "$15.000"],
          ].map(([name, amount]) => (
            <li key={name} className="flex items-center gap-3 py-1.5">
              <span className="font-medium">{name}</span>
              <span className="ml-auto shrink-0 tabular-nums">{amount}</span>
            </li>
          ))}
        </ul>
      </Widget>
    ),
  },
  {
    prompt: "¿Cuánto facturé en octubre?",
    reply: "Vas bien con el tope de tu categoría. ¿Te mando el detalle?",
    widget: (
      <Widget eyebrow="Tu mes de un vistazo · Octubre" title="Facturado y cobrado" badge="Al día">
        <div className="grid grid-cols-3 gap-2">
          {[
            ["Facturado", "$2 M", "octubre"],
            ["Cobrado", "$652 mil", "32 %"],
            ["Te deben", "$1,4 M", "4 facturas"],
          ].map(([label, value, note]) => (
            <div key={label} className="rounded-xl bg-noche/[0.03] p-2.5">
              <p className="truncate text-xs text-noche/50">{label}</p>
              <p className="mt-0.5 text-lg leading-tight font-semibold">{value}</p>
              <p className="text-xs text-azul/70">{note}</p>
            </div>
          ))}
        </div>
      </Widget>
    ),
  },
  {
    prompt: "Me pagó Juan en efectivo, 25 mil",
    reply: "Anotado junto con lo de Mercado Pago y las transferencias.",
    widget: (
      <Widget eyebrow="Cobro anotado" title="Juan Pérez · $25.000" badge="Cobrado" actions={<><GhostAction>Editar</GhostAction><SolidAction><FileText aria-hidden />Facturarlo</SolidAction></>}>
        <Rows
          rows={[
            ["Medio", "Efectivo"],
            ["Fecha", "Hoy"],
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
        <span className="block">Lo de todos los días,</span>
        <span className="block">en un chat</span>
      </h2>
      <p className="mt-4 max-w-xl text-base text-pretty text-white/90 [text-shadow:0_1px_12px_rgb(0_40_90/0.3)] sm:text-lg">
        Facturá, anotá tus cobros y preguntale quién te debe, desde el WhatsApp que ya usás. Sin apps para instalar.
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

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[28px] bg-white font-[system-ui,-apple-system,'Segoe_UI',sans-serif] text-noche shadow-[0_40px_80px_-30px_rgb(0_30_70/0.45)] ring-1 ring-noche/5",
        className,
      )}
    >
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-noche/[0.06] px-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SOCIO_AVATAR} alt="" width={24} height={24} className="size-6 rounded-full" />
        <span className="text-sm font-medium">SOCIO</span>
        <span className="text-xs text-noche/50">en línea</span>
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
              className={"max-w-[80%] self-end rounded-3xl bg-[#f4f4f4] px-4 py-2.5 text-[15px]"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              {convo.prompt}
            </motion.p>
            {shown >= 1 && (
              <motion.div className="flex flex-col gap-2.5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <span className="flex items-center gap-1.5 text-xs text-noche/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={SOCIO_AVATAR} alt="" width={20} height={20} className="size-5 rounded-md" />
                  SOCIO
                </span>
                {shown === 1 ? (
                  <Shimmer>Revisando tus facturas y cobros…</Shimmer>
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
      <div className="m-3 mt-0 flex h-12 shrink-0 items-center gap-2 rounded-full border border-noche/10 bg-white px-2 shadow-[0_2px_8px_-4px_rgb(0_0_0/0.12)]">
        <span className="flex size-8 items-center justify-center rounded-full text-noche/50">
          <Plus className="size-4" aria-hidden />
        </span>
        <span className="flex-1 truncate text-[15px] text-noche/40">Mensaje</span>
        <span className="flex size-8 items-center justify-center rounded-full bg-azul text-hueso">
          <Mic className="size-4" aria-hidden />
        </span>
      </div>
    </div>
  );
}
