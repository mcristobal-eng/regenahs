import { HandCoins, LayoutDashboard, MessageCircle } from "lucide-react";
import { APP_URL, WHATSAPP_URL } from "./assets";
import { Reveal } from "./shared";

const ITEMS = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    text: "Todo el sistema funciona en WhatsApp: facturás, anotás cobros y preguntás quién te debe con un mensaje, un audio o una foto. Sin apps para instalar.",
    cta: { label: "Escribime por WhatsApp", href: WHATSAPP_URL, external: true },
  },
  {
    icon: HandCoins,
    title: "Mercado Pago",
    text: "Lo conectás una vez y cada cobro entra solo: si coincide con una factura la marca como cobrada, y si no, te pregunta si la facturás.",
    cta: { label: "Conectarlo desde el panel", href: `${APP_URL}/login` },
  },
  {
    icon: LayoutDashboard,
    title: "Panel web + ChatGPT o Claude",
    text: "En la compu ves tus facturas, tus cobros y quién te debe. Y el panel se integra con ChatGPT o Claude para consultar tus números desde ahí.",
    cta: { label: "Entrar al panel", href: `${APP_URL}/login` },
  },
];

export function Integrations() {
  return (
    <section id="integraciones" aria-labelledby="integraciones-title" className="scroll-mt-8 bg-background px-4 pt-24 sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-6xl">
        <Reveal onScroll>
          <h2 id="integraciones-title" className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
            Usá SOCIO desde donde estés
          </h2>
          <p className="mt-4 max-w-xl text-base text-pretty text-muted-foreground">
            El día a día pasa en WhatsApp. Tus cobros llegan de Mercado Pago. Y todo queda ordenado en tu panel, conectado con ChatGPT o Claude.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {ITEMS.map(({ icon: Icon, title, text, cta }, i) => (
            <Reveal key={title} onScroll delay={0.06 * i} className="h-full">
              <div className="flex h-full flex-col rounded-[28px] border border-border bg-background p-6">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-hielo text-azul">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.02em]">{title}</h3>
                <p className="mt-2 flex-1 text-sm text-pretty text-muted-foreground">{text}</p>
                <a
                  href={cta.href}
                  {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="mt-6 inline-flex h-10 items-center justify-center self-start rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                >
                  {cta.label}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
