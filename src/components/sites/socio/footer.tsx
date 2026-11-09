import { asset, CARPINCHO, WHATSAPP_URL } from "./assets";

const LINK = "text-base transition-opacity hover:opacity-70";

export function Footer() {
  const img = CARPINCHO.curioso;
  return (
    <footer className="overflow-hidden bg-hueso px-4 pt-20 text-azul sm:px-8 sm:pt-28">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.1fr_1.4fr] lg:gap-20">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/brand/logo.svg")} alt="SOCIO" width={858} height={260} className="h-12 w-auto" />
          <p className="mt-5 max-w-sm text-[17px] leading-[1.5] text-azul/80">Un socio que entiende de números y habla tu idioma.</p>
        </div>
        <nav aria-label="Pie de página" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <p className="label-mono text-azul/70">Producto</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li><a href="#como-funciona" className={LINK}>Cómo funciona</a></li>
              <li><a href="#ejemplos" className={LINK}>Ejemplos</a></li>
              <li><a href="#precio" className={LINK}>Precio</a></li>
            </ul>
          </div>
          <div>
            <p className="label-mono text-azul/70">Ayuda</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li><a href="#preguntas" className={LINK}>Preguntas</a></li>
              <li><a href={WHATSAPP_URL} className={LINK}>WhatsApp</a></li>
              <li><a href="mailto:soysocio2026@gmail.com" className={LINK}>soysocio2026@gmail.com</a></li>
            </ul>
          </div>
          <div>
            <p className="label-mono text-azul/70">SOCIO</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-base">
              <li>soysocio.app</li>
              <li>Hecho en Argentina</li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="relative mx-auto mt-32 max-w-[1400px] sm:mt-44">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/brand/palabra.svg")} alt="" width={560} height={192} className="block h-auto w-full" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.src}
          alt={img.alt}
          width={img.w}
          height={img.h}
          loading="lazy"
          className="absolute right-[2%] bottom-full w-[14%] min-w-[72px] transition-transform duration-500 hover:-translate-y-3"
        />
      </div>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 border-t border-azul py-6 font-mono text-[13px] sm:flex-row sm:justify-between">
        <p>© 2026 SOCIO. Todos los derechos reservados.</p>
        <p>Hecho en Argentina</p>
      </div>
    </footer>
  );
}
