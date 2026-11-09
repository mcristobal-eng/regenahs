import { cn } from "@/lib/utils";

/** Wordmark de SOCIO con la tipografía display de la página. */
export function Wordmark({ className }: { className?: string }) {
  return <span className={cn("font-display leading-none font-semibold tracking-[-0.04em]", className)}>socio</span>;
}
