"use client";

import { CardMedia } from "./card-media";

/** Marker used in CARDS to render the section background instead of a fixed photo. */
export const SKY = "__sky__";

/** Diagonal Norte al atardecer, with a navy tint so white text stays legible. */
export function SkyBackdrop() {
  return (
    <>
      <CardMedia src="/sites/socio/fondos/diagonal-sol.webp" dither={false} drift />
      <div aria-hidden className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,rgb(0_0_60/0.55)_0%,rgb(0_0_60/0.25)_45%,rgb(0_0_60/0.45)_100%)]" />
    </>
  );
}
