"use client";

import { cn } from "@/lib/utils";
import { MercadoPagoLogo, WhatsAppLogo } from "./brand-logos";
import { ChatDemo } from "./chat-demo";
import { asset } from "./shared";
import { SocioDashboard } from "./socio-dashboard";

function WhatsAppMark() {
  return (
    <span className="flex size-7 items-center justify-center rounded-full bg-[#25d366] text-white">
      <WhatsAppLogo className="size-4" />
    </span>
  );
}

function MercadoPagoMark() {
  return (
    <span className="flex size-7 items-center justify-center rounded-full bg-white text-[#00b1ea]">
      <MercadoPagoLogo className="size-5" />
    </span>
  );
}

function ImgMark({ src }: { src: string }) {
  return (
    <span className="flex size-7 items-center justify-center rounded-full bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={16} height={16} className="size-4" />
    </span>
  );
}

const INTEGRATIONS = [
  { name: "WhatsApp", note: "Facturás y anotás cobros desde el chat", mark: <WhatsAppMark /> },
  { name: "Mercado Pago", note: "Cada cobro entra solo", mark: <MercadoPagoMark /> },
  { name: "ChatGPT", note: "Consultás tus números", mark: <ImgMark src={asset("/brand/openai.svg")} /> },
  { name: "Claude", note: "Consultás tus números", mark: <ImgMark src={asset("/brand/claude.svg")} /> },
];

/** Integrations, WhatsApp chat and dashboard, laid out over the sky card. */
export function ConnectedContent({ active, compact = false }: { active?: boolean; compact?: boolean }) {
  return (
    <div className="mx-auto flex w-full max-w-[1320px] min-w-0 flex-col items-center">
      <div className="text-center text-white">
        <h2 className="font-display text-[clamp(1.75rem,3vw,3rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance [text-shadow:0_2px_24px_rgb(0_40_90/0.25)]">
          Lo de todos los días en un chat, y todo a la vista en tu panel
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-pretty text-white/90 [@media(max-height:860px)]:hidden [text-shadow:0_1px_12px_rgb(0_40_90/0.3)] sm:text-base">
          Le escribís a SOCIO por WhatsApp y todo queda ordenado en tu panel. Conectás Mercado Pago para que cada cobro entre solo, y ChatGPT o Claude para preguntarle por tus números.
        </p>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center">
        {INTEGRATIONS.map((it) => (
          <li key={it.name} className="flex items-center gap-2 rounded-full bg-white/90 py-1 pr-3.5 pl-1 text-azul shadow-[0_6px_20px_-10px_rgb(0_30_70/0.45)] backdrop-blur-md">
            {it.mark}
            <span className="text-sm font-semibold">{it.name}</span>
          </li>
        ))}
      </ul>
      <div className={cn("mt-4 grid w-full grid-cols-1 gap-4", !compact && "lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]")}>
        <div className={cn("min-w-0", compact ? "h-[520px]" : "h-[520px] lg:h-[min(640px,68svh)]")}>
          <ChatDemo playing={active} className="h-full" />
        </div>
        <div className={cn("min-w-0", !compact && "lg:h-[min(640px,68svh)]")}>
          <SocioDashboard active={active} />
        </div>
      </div>
    </div>
  );
}
