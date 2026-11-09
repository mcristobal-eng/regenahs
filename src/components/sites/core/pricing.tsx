"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { APP_URL, CALENDLY_URL } from "./assets";
import { Reveal } from "./shared";

type Plan = {
  name: string;
  who: string;
  monthly: string | null;
  yearly: string | null;
  yearNote?: string;
  monthNote?: string;
  tag?: string;
  cta: { label: string; href: string };
  features: string[];
  highlight?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Prueba",
    who: "Para ver si SOCIO sirve en tu negocio.",
    monthly: "Gratis",
    yearly: "Gratis",
    monthNote: "Tus primeras 5 facturas. Después elegís Inicio o Negocio.",
    yearNote: "Tus primeras 5 facturas. Después elegís Inicio o Negocio.",
    cta: { label: "Empezar gratis", href: `${APP_URL}/register` },
    features: ["Todo lo de Inicio", "Sin tarjeta", "Sin implementación"],
  },
  {
    name: "Inicio",
    who: "Profesional u oficio que factura poco: una dentista, un electricista, una diseñadora.",
    monthly: "$29.900",
    yearly: "$24.900",
    yearNote: "$298.800 por año · ahorrás $60.000",
    monthNote: "Pagando el año: $24.900 por mes",
    cta: { label: "Contratar Inicio", href: `${APP_URL}/planes` },
    features: [
      "Facturas A, B y C ilimitadas",
      "Texto, foto o audio por WhatsApp",
      "Confirmación antes de emitir",
      "Alerta de tope de categoría",
      "Detecta cobros de Mercado Pago y pregunta si los factura",
      "“¿Cuánto facturé?”",
      "Alta sola, sin implementación",
    ],
  },
  {
    name: "Negocio",
    who: "Factura todos los días o les cobra todos los meses a los mismos: un taller, una cochera, un gimnasio.",
    monthly: "$59.900",
    yearly: "$49.900",
    yearNote: "$598.800 por año · ahorrás $120.000",
    monthNote: "Pagando el año: $49.900 por mes",
    tag: "Lanzamiento",
    cta: { label: "Contratar Negocio", href: `${APP_URL}/planes` },
    highlight: true,
    features: [
      "Todo lo de Inicio",
      "Cobros por transferencia, extractos y efectivo en un solo registro",
      "“¿Quién me debe?” y cuenta corriente por cliente",
      "Facturación en lote de clientes fijos",
      "Puesta en marcha asistida",
    ],
  },
  {
    name: "A tu medida",
    who: "Varios locales o CUIT, consorcios, colegios o integración con tu propio sistema.",
    monthly: null,
    yearly: null,
    monthNote: "Precio según el caso. Agendá una llamada y lo vemos.",
    yearNote: "Precio según el caso. Agendá una llamada y lo vemos.",
    cta: { label: "Agendá una llamada", href: CALENDLY_URL },
    features: ["Todo Negocio, configurado para tu caso", "Relevamiento y migración de datos", "Una persona asignada"],
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(true);
  return (
    <section id="precio" aria-labelledby="precio-title" className="scroll-mt-8 bg-background px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal onScroll className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="precio-title" className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
              Probalo gratis.
              <br />
              Seguí si te sirve.
            </h2>
            <p className="mt-4 max-w-md text-base text-pretty text-muted-foreground">
              Empezás sin tarjeta. Después elegís el plan: el mismo precio para monotributo y responsable inscripto.
            </p>
          </div>
          <div role="group" aria-label="Forma de pago" className="flex rounded-full bg-muted p-1 text-sm font-medium">
            {[
              [false, "Mensual"],
              [true, "Anual · ahorrás 2 meses"],
            ].map(([value, label]) => (
              <button
                key={String(value)}
                type="button"
                aria-pressed={yearly === value}
                onClick={() => setYearly(value as boolean)}
                className={cn("rounded-full px-4 py-2 transition-colors", yearly === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
              >
                {label as string}
              </button>
            ))}
          </div>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, i) => {
            const price = yearly ? plan.yearly : plan.monthly;
            const note = yearly ? plan.yearNote : plan.monthNote;
            return (
              <Reveal key={plan.name} onScroll delay={0.05 * i} className="h-full">
                <div className={cn("flex h-full flex-col rounded-[28px] border p-6", plan.highlight ? "border-core-ink bg-core-ink text-white" : "border-border bg-background")}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.02em]">{plan.name}</h3>
                    {plan.tag && <span className="rounded-full bg-core-orange px-2 py-0.5 text-xs font-medium text-white">{plan.tag}</span>}
                  </div>
                  <p className={cn("mt-2 min-h-[4.5em] text-sm text-pretty", plan.highlight ? "text-white/70" : "text-muted-foreground")}>{plan.who}</p>
                  <p className="mt-6 flex items-baseline gap-1">
                    <span className="font-display text-[40px] leading-none font-semibold tracking-[-0.03em]">{price ?? "Hablemos"}</span>
                    {price && price !== "Gratis" && <span className={cn("text-sm", plan.highlight ? "text-white/70" : "text-muted-foreground")}>/ mes</span>}
                  </p>
                  <p className={cn("mt-2 min-h-[2.5em] text-xs", plan.highlight ? "text-white/70" : "text-muted-foreground")}>{note}</p>
                  <a
                    href={plan.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "mt-5 inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors",
                      plan.highlight ? "bg-core-orange text-white hover:bg-core-orange/90" : "bg-primary text-primary-foreground hover:bg-primary/80",
                    )}
                  >
                    {plan.cta.label}
                  </a>
                  <ul className={cn("mt-6 flex flex-col gap-2.5 border-t pt-5 text-sm", plan.highlight ? "border-white/15" : "border-border")}>
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className={cn("mt-0.5 size-4 shrink-0", plan.highlight ? "text-core-green" : "text-foreground")} aria-hidden />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-6 max-w-3xl text-sm text-muted-foreground">
          Negocio tiene precio de lanzamiento: después pasa a $69.900 por mes ($57.900 en anual). Precios finales en pesos, con ajuste cada tres meses. El anual es un compromiso de 12 meses: pagás 10 y usás 12.
        </p>
      </div>
    </section>
  );
}
