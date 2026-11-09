import { cn } from "@/lib/utils";

export type ButtonVariant = "ambar" | "azul" | "borde" | "hueso" | "borde-hueso";

const VARIANTS: Record<ButtonVariant, string> = {
  // Acción principal: una sola por pantalla, texto en noche.
  ambar: "bg-ambar text-noche hover:brightness-105",
  azul: "bg-azul text-hueso hover:bg-noche",
  borde: "border-[1.5px] border-azul text-azul hover:bg-azul hover:text-hueso",
  hueso: "bg-hueso text-azul hover:bg-hielo",
  "borde-hueso": "border-[1.5px] border-hueso text-hueso hover:bg-hueso hover:text-azul",
};

export function buttonClass(variant: ButtonVariant, size: "md" | "sm" = "md", className?: string) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold leading-none whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-azul/40",
    size === "md" ? "px-[22px] py-[15px] text-base" : "px-4 py-[11px] text-sm",
    VARIANTS[variant],
    className,
  );
}
