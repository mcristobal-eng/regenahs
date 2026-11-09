"use client";

import { APP_URL, CALENDLY_URL, WHATSAPP_URL } from "./assets";
import { WhatsAppPill } from "./whatsapp-pill";

const LINK = "inline-flex items-center gap-2 text-base text-foreground transition-colors hover:text-muted-foreground";

export function Footer() {
  return (
    <footer className="overflow-hidden bg-background px-4 pt-24 pb-20 sm:px-8 sm:pt-32 sm:pb-28">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.1fr_1.4fr] lg:gap-20">
        <div>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
            ¿Necesitás ayuda?
          </h2>
          <p className="mt-3 max-w-sm text-base text-pretty text-muted-foreground">
            Escribinos por WhatsApp y te respondemos, o agendá una llamada y lo vemos juntos.
          </p>
          <WhatsAppPill variant="light" hint="Te respondemos" label="Escribinos por WhatsApp" className="mt-6" />
          <p className="mt-3 text-sm text-muted-foreground">
            O{" "}
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">
              agendá una llamada
            </a>
            .
          </p>
        </div>
        <nav aria-label="Pie de página" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Producto</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li><a href="#producto" className={LINK}>Cómo funciona</a></li>
              <li><a href="#precio" className={LINK}>Precio</a></li>
              <li><a href={`${APP_URL}/login`} className={LINK}>Iniciar sesión</a></li>
              <li><a href={`${APP_URL}/register`} className={LINK}>Crear cuenta</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Guías</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li><a href={`${APP_URL}/facturacion-electronica`} className={LINK}>Facturación electrónica</a></li>
              <li><a href={`${APP_URL}/facturar-por-whatsapp`} className={LINK}>Facturar por WhatsApp</a></li>
              <li><a href={`${APP_URL}/factura-a-y-b`} className={LINK}>Factura A o B</a></li>
              <li><a href={`${APP_URL}/guias`} className={LINK}>Todas las guías</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Contacto</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={LINK}>WhatsApp</a></li>
              <li><a href="mailto:soysocio2026@gmail.com" className={LINK}>soysocio2026@gmail.com</a></li>
              <li><a href={`${APP_URL}/privacidad`} className={LINK}>Privacidad</a></li>
              <li><a href={`${APP_URL}/terminos`} className={LINK}>Términos</a></li>
            </ul>
          </div>
        </nav>
      </div>
    </footer>
  );
}
