import { cn } from "@/lib/utils";
import { WHATSAPP_URL } from "./assets";

type Props = {
  className?: string;
  variant?: "glass" | "light";
  hint?: string;
  label?: string;
  href?: string;
};

/** Misma pastilla que el formulario original, pero como acceso directo a WhatsApp. */
export function WhatsAppPill({
  className,
  variant = "glass",
  hint = "Probás gratis con 5 facturas",
  label = "Escribime por WhatsApp",
  href = WHATSAPP_URL,
}: Props) {
  const light = variant === "light";
  return (
    <div className={cn("flex w-full", light ? "justify-start" : "justify-center", className)}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group flex h-11 max-w-full items-center gap-3 rounded-lg border pr-1.5 pl-3.5 transition-[border-color,box-shadow] duration-300 outline-none focus-visible:ring-3",
          light
            ? "border-input text-muted-foreground hover:border-ring focus-visible:ring-ring/50"
            : "border-white/30 bg-white/15 text-white/80 backdrop-blur-md hover:border-white/60 focus-visible:ring-white/25",
        )}
      >
        <span className="min-w-0 truncate text-sm">{hint}</span>
        <span
          className={cn(
            "inline-flex h-8 shrink-0 items-center rounded-lg px-2.5 text-sm font-medium whitespace-nowrap transition-colors",
            light ? "bg-primary text-primary-foreground group-hover:bg-primary/80" : "bg-white text-core-ink group-hover:bg-white/90",
          )}
        >
          {label}
        </span>
      </a>
    </div>
  );
}
