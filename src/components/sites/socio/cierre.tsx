import { CARPINCHO } from "./assets";
import { ContactForm } from "./contact-form";
import { Label, Reveal } from "./shared";

export function Cierre() {
  const img = CARPINCHO.contento;
  return (
    <section id="contacto" aria-labelledby="cierre-title" className="scroll-mt-8 bg-hueso px-3 pb-3 sm:px-6 sm:pb-6">
      <div className="relative isolate flex min-h-[min(88svh,820px)] flex-col items-center justify-center overflow-hidden rounded-[28px] bg-azul px-6 pt-20 pb-0 text-center text-hueso">
        <svg aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[150%] -translate-x-1/2 -translate-y-1/2 opacity-[0.08]" viewBox="0 0 640 640" fill="none">
          {[300, 250, 200, 150, 100].map((r) => (
            <circle key={r} cx="320" cy="320" r={r} stroke="#eeeee9" strokeWidth="2" />
          ))}
        </svg>
        <Reveal onScroll>
          <Label className="text-hielo">(07) Empezá hoy</Label>
        </Reveal>
        <Reveal onScroll delay={0.1}>
          <h2 id="cierre-title" className="mt-6 max-w-[14ch] text-[clamp(3rem,8vw,7.5rem)] leading-[0.88] font-extrabold tracking-[-0.055em]">
            Tus facturas, en orden.
          </h2>
        </Reveal>
        <Reveal onScroll delay={0.2}>
          <p className="mt-6 max-w-lg text-[17px] leading-[1.5] text-hielo">Dejanos tu WhatsApp y SOCIO te escribe para arrancar con tus primeras facturas.</p>
        </Reveal>
        <Reveal onScroll delay={0.3} className="mt-8 w-full">
          <ContactForm />
        </Reveal>
        {/* Sobre azul, el carpincho va solo en tamaño grande. */}
        <Reveal onScroll delay={0.35} className="mt-12 w-[min(70vw,300px)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.src} alt={img.alt} width={img.w} height={img.h} loading="lazy" className="block h-auto w-full" />
        </Reveal>
      </div>
    </section>
  );
}
