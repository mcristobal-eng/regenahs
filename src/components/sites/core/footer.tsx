"use client";

import { CALENDLY_URL } from "./assets";
import { WhatsAppPill } from "./whatsapp-pill";

export function Footer() {
  return (
    <footer className="overflow-hidden bg-background px-4 pt-24 pb-20 sm:px-8 sm:pt-32 sm:pb-28">
      <div className="mx-auto max-w-6xl">
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
      </div>
    </footer>
  );
}
