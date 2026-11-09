"use client";

import { Accordion } from "@base-ui/react/accordion";
import { Plus } from "lucide-react";
import { Label, Reveal } from "./shared";

const FAQS = [
  {
    q: "¿Qué es SOCIO?",
    a: "Un asistente administrativo que funciona dentro de WhatsApp. Le contás qué cobraste y arma la factura, te la muestra y la emite en ARCA solo cuando le decís que sí.",
  },
  {
    q: "¿Tengo que instalar algo?",
    a: "No. SOCIO vive en WhatsApp, el chat que ya usás todos los días. Sin apps y sin planillas.",
  },
  {
    q: "¿Puede emitir una factura sin que me dé cuenta?",
    a: "No. Siempre te muestra el borrador y espera tu aprobación. Nada se emite sin tu sí.",
  },
  {
    q: "¿Las facturas son oficiales?",
    a: "Sí. Se emiten en ARCA y te llega el PDF en el mismo chat, listo para mandar.",
  },
  {
    q: "¿Qué más puede hacer además de facturar?",
    a: "Armar presupuestos, darte resúmenes de lo que facturaste y recordarte cobros pendientes, todo desde la conversación.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Podés empezar con 5 facturas gratis. Escribinos y te contamos los planes.",
  },
];

export function Faq() {
  return (
    <section id="preguntas" aria-labelledby="faq-title" className="scroll-mt-8 bg-hueso px-4 py-24 text-azul sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal onScroll className="lg:sticky lg:top-28 lg:self-start">
          <Label>(06) Preguntas</Label>
          <h2 id="faq-title" className="mt-5 text-[clamp(2.25rem,5vw,4rem)] leading-[0.95] font-extrabold tracking-[-0.05em]">
            Lo que más nos preguntan.
          </h2>
          <p className="mt-5 max-w-sm text-[17px] leading-[1.5] text-azul/80">¿Te quedó alguna duda? Escribinos por WhatsApp y te respondemos.</p>
        </Reveal>
        <Reveal onScroll delay={0.1}>
          <Accordion.Root className="flex w-full flex-col border-t border-azul">
            {FAQS.map((item) => (
              <Accordion.Item key={item.q} className="border-b border-azul">
                <Accordion.Header className="flex">
                  <Accordion.Trigger className="group/t flex flex-1 items-center justify-between gap-4 rounded-lg py-5 text-left text-lg font-semibold tracking-[-0.01em] outline-none focus-visible:ring-3 focus-visible:ring-azul/40 sm:text-xl">
                    {item.q}
                    <Plus className="size-5 shrink-0 transition-transform duration-300 group-data-[panel-open]/t:rotate-45" aria-hidden />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden transition-[height] duration-200 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
                  <p className="max-w-xl pb-5 text-[17px] leading-[1.5] text-azul/80">{item.a}</p>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Reveal>
      </div>
    </section>
  );
}
