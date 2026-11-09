"use client";

import { Accordion } from "@base-ui/react/accordion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Reveal } from "./shared";
import { WaitlistForm } from "./waitlist-form";

const FAQS = [
  {
    q: "¿Qué es core?",
    a: "Es un bolo que vive en el rumen de cada animal y mide sus signos vitales todo el día, más una plataforma con agentes de IA que interpreta esos datos y te avisa qué hacer.",
  },
  {
    q: "¿Cómo se coloca el bolo? ¿Es seguro para el animal?",
    a: "Se administra por vía oral con un aplicador, como cualquier bolo ruminal, y queda alojado en el retículo-rumen. No requiere cirugía y el animal sigue su rutina normal.",
  },
  {
    q: "¿Qué datos mide?",
    a: "Temperatura interna, actividad y rumia. Con eso la plataforma detecta fiebre, celos, caídas de consumo y cambios de comportamiento de cada animal.",
  },
  {
    q: "¿Necesito internet en el campo?",
    a: "Los bolos envían sus datos a una antena que se instala en el campo y los sube a la nube. Te contamos qué opción de conexión conviene según tu establecimiento.",
  },
  {
    q: "¿Cuánto dura la batería?",
    a: "El bolo está pensado para acompañar al animal durante años sin mantenimiento. La duración exacta depende de la frecuencia de medición que elijas.",
  },
  {
    q: "¿Sirve para cría, invernada y tambo?",
    a: "Sí. Las alertas y los agentes se adaptan a cada sistema: celos y preñez en cría, ganancia de peso en invernada y salud y producción en tambo.",
  },
  {
    q: "¿Cómo lo conecto con ChatGPT o Claude?",
    a: "Desde la plataforma activás la integración con tu cuenta y listo: ya podés pedirle informes, consultas sobre tu rodeo u órdenes de compra desde el chat.",
  },
  {
    q: "¿Cuánto cuesta y cuándo puedo empezar?",
    a: "Estamos sumando los primeros establecimientos. Dejanos tu email y te contactamos con una propuesta según el tamaño de tu rodeo.",
  },
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-8 bg-background px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal onScroll className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="faq-title" className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
            Preguntas frecuentes
          </h2>
          <p className="mt-4 max-w-sm text-base text-pretty text-muted-foreground">
            Lo que más nos preguntan los productores antes de empezar. ¿Te quedó alguna duda? Escribinos.
          </p>
          <WaitlistForm variant="light" className="mt-6" />
        </Reveal>
        <Reveal onScroll delay={0.1}>
          <Accordion.Root className="flex w-full flex-col border-t">
            {FAQS.map((item) => (
              <Accordion.Item key={item.q} className="border-b">
                <Accordion.Header className="flex">
                  <Accordion.Trigger className="group/trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-5 text-left text-base font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-lg">
                    {item.q}
                    <ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground group-data-[panel-open]/trigger:hidden" aria-hidden />
                    <ChevronUp className="ml-auto hidden size-4 shrink-0 text-muted-foreground group-data-[panel-open]/trigger:inline" aria-hidden />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel className="h-[var(--accordion-panel-height)] overflow-hidden text-base text-muted-foreground transition-[height] duration-200 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
                  <p className="max-w-xl pb-5 text-pretty">{item.a}</p>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Reveal>
      </div>
    </section>
  );
}
