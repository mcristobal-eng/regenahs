"use client";

import { useEffect, useState } from "react";
import { CardMedia } from "./card-media";
import { asset } from "./shared";

/** Marker used in CARDS to render the switchable background instead of a fixed photo. */
export const SKY = "__sky__";

const OPTIONS = {
  cielo: { src: asset("/images/producto/cielo.jpg"), tint: false },
  "diagonal-sol": { src: "/sites/socio/fondos/diagonal-sol.webp", tint: true },
  "diagonal-jacarandas": { src: "/sites/socio/fondos/diagonal-jacarandas.webp", tint: true },
  bolsa: { src: "/sites/socio/fondos/bolsa.webp", tint: true },
} as const;

type Option = keyof typeof OPTIONS;
const BY_NUMBER: Record<string, Option> = { "0": "cielo", "1": "diagonal-sol", "2": "diagonal-jacarandas", "3": "bolsa" };

/** Test switch: ?fondo=1, 2 or 3 picks one of the Buenos Aires photos; no param keeps the sky. */
function useBackground(): Option {
  const [opt, setOpt] = useState<Option>("cielo");
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("fondo") ?? "";
    const pick = BY_NUMBER[v] ?? (v in OPTIONS ? (v as Option) : "cielo");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpt(pick);
  }, []);
  return opt;
}

export function SkyBackdrop() {
  const opt = OPTIONS[useBackground()];
  return (
    <>
      <CardMedia key={opt.src} src={opt.src} dither={false} drift />
      {opt.tint && (
        <div aria-hidden className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,rgb(0_0_60/0.55)_0%,rgb(0_0_60/0.25)_45%,rgb(0_0_60/0.45)_100%)]" />
      )}
    </>
  );
}
