import { asset } from "./assets";
import { Reveal } from "./shared";
import { WhatsAppPill } from "./whatsapp-pill";
import { Wordmark } from "./wordmark";

export function Cierre() {
  return (
    <section id="contacto" aria-labelledby="cierre-title" className="scroll-mt-8 px-3 pb-3 sm:px-6 sm:pb-6">
      <div className="relative isolate flex min-h-[min(88svh,860px)] flex-col items-center justify-center overflow-hidden rounded-[28px] px-6 py-20 text-center text-white">
        <div aria-hidden className="absolute inset-0 overflow-hidden rounded-[inherit] bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/cierre/cta.jpg")} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
        </div>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/45" />
        <div className="relative flex flex-col items-center">
          <Reveal onScroll>
            <Wordmark className="text-[40px] sm:text-[52px]" />
          </Reveal>
          <Reveal onScroll delay={0.1}>
            <h2 id="cierre-title" className="mt-8 font-display text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance [text-shadow:0_2px_24px_rgb(0_0_0/0.25)]">
              <span className="block">¿Probamos con tu</span>
              <span className="block">próxima factura?</span>
            </h2>
          </Reveal>
          <Reveal onScroll delay={0.2} className="mt-8 w-full">
            <WhatsAppPill hint="Te muestro cómo funciona en tu negocio" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
