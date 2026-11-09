import { buttonClass } from "./button-class";
import { Label, Reveal } from "./shared";

export function Pricing() {
  return (
    <section id="precio" aria-labelledby="precio-title" className="scroll-mt-8 bg-azul px-4 py-24 text-hueso sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-end gap-12 lg:grid-cols-[1fr_1fr]">
        <Reveal onScroll>
          <Label className="text-hielo">(05) Precio</Label>
          <h2 id="precio-title" className="mt-5 text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] font-extrabold tracking-[-0.05em]">
            Empezá sin pagar nada.
          </h2>
          <p className="mt-6 max-w-md text-[17px] leading-[1.5] text-hielo">
            Probá SOCIO con tus primeras facturas. Si te sirve, seguimos; si no, no pasa nada.
          </p>
          <a href="#contacto" className={buttonClass("borde-hueso", "md", "mt-8")}>
            Quiero probarlo
          </a>
        </Reveal>
        <Reveal onScroll delay={0.1} className="flex items-end gap-4 lg:justify-end">
          {/* Ámbar sobre azul: permitido en números grandes. Es lo único en ámbar de esta pantalla. */}
          <span className="text-[clamp(9rem,22vw,16rem)] leading-[0.8] font-extrabold tracking-[-0.06em] text-ambar">5</span>
          <span className="pb-3 text-[clamp(1.75rem,3vw,2.5rem)] leading-[0.95] font-extrabold tracking-[-0.03em]">
            facturas
            <br />
            gratis.
          </span>
        </Reveal>
      </div>
    </section>
  );
}
