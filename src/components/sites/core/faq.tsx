"use client";

import { Accordion } from "@base-ui/react/accordion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Reveal } from "./shared";
import { WhatsAppPill } from "./whatsapp-pill";

const FAQS = [
  {
    q: "¿Cómo hago una factura C del monotributo sin entrar a ARCA?",
    a: "Le escribís a SOCIO por WhatsApp lo que cobraste, por ejemplo “Facturale $50.000 a Juan Pérez por arreglo”. Arma la factura C, te la muestra y, cuando se lo confirmás, la emite en ARCA y te manda el PDF. No tenés que entrar a la página de ARCA ni buscar la clave.",
  },
  {
    q: "¿Puedo facturar con un mensaje, un audio o una foto?",
    a: "Sí. Todo pasa en el WhatsApp que ya usás: le escribís, le mandás un audio o la foto de un comprobante, y SOCIO arma la factura. No hay que instalar ninguna app.",
  },
  {
    q: "¿SOCIO hace facturas A y B si soy responsable inscripto?",
    a: "Sí. Hace facturas A, B y C. Para una factura A necesita el CUIT de tu cliente: si no lo tiene, te lo pide antes de emitir.",
  },
  {
    q: "¿SOCIO emite sin que yo lo apruebe?",
    a: "No. Siempre te muestra la factura antes y espera tu confirmación. Si algo está mal, se lo decís y la corrige antes de emitir.",
  },
  {
    q: "¿La factura es válida? ¿Es seguro con ARCA?",
    a: "Sí. Las facturas se emiten en ARCA, el sistema oficial que antes se llamaba AFIP, con su CAE. Valen lo mismo que las que hacés vos desde la página, y te llega el PDF por WhatsApp.",
  },
  {
    q: "¿Cómo sé quién me debe plata?",
    a: "Le preguntás “¿Quién me debe?” por WhatsApp y te contesta con la lista y cuánto debe cada uno. SOCIO lleva la cuenta de cada cliente con las facturas y los cobros que va anotando.",
  },
  {
    q: "¿Puedo anotar cobros en efectivo o por transferencia?",
    a: "Sí. Le escribís “Me pagó Juan en efectivo” o le reenviás el comprobante de la transferencia. También lee el extracto del banco. Todo queda en un solo registro, junto con lo de Mercado Pago.",
  },
  {
    q: "¿SOCIO me avisa si me acerco al tope del monotributo?",
    a: "Sí, te avisa cuando te estás acercando al tope de tu categoría, antes de que te pases. Y si le preguntás cuánto facturaste, te lo dice al momento.",
  },
  {
    q: "¿Se conecta con Mercado Pago?",
    a: "Sí. Lo conectás una vez desde el panel y cada cobro entra solo: si coincide con una factura, la marca como cobrada, y si no, lo anota como ingreso. Los pagos que hacés vos no los cuenta como ingresos.",
  },
  {
    q: "¿Puedo consultar mis números desde ChatGPT o Claude?",
    a: "Sí. El panel de SOCIO se integra con ChatGPT o Claude, así podés preguntarle por tus facturas, tus cobros o quién te debe desde ahí.",
  },
  {
    q: "¿Tengo que darle mi clave fiscal?",
    a: "Elegís vos. Podés autorizar a SOCIO desde ARCA para que facture en tu nombre, sin compartir la clave, o hacerlo con nuestra ayuda: lo conectamos nosotros con tu CUIT y tu clave fiscal.",
  },
  {
    q: "Ya tengo contador. ¿Para qué me sirve?",
    a: "SOCIO no lo reemplaza. Tu contador sigue con las declaraciones. SOCIO se ocupa de lo de todos los días: facturar y anotar lo que cobrás, sin que tengas que llamarlo por cada venta.",
  },
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-8 bg-background px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal onScroll className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="faq-title" className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
            Preguntas comunes
          </h2>
          <p className="mt-4 max-w-sm text-base text-pretty text-muted-foreground">
            SOCIO nunca emite una factura sin tu confirmación, y las facturas salen por ARCA, igual que si las hicieras vos. ¿Te quedó alguna duda? Escribinos.
          </p>
          <WhatsAppPill variant="light" hint="¿Otra consulta?" label="Escribinos" className="mt-6" />
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
