"use client";

import { CircleCheck } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonClass } from "./shared";

/** Formulario de contacto sobre fondo azul: el botón es la única acción en ámbar. */
export function ContactForm({ className }: { className?: string }) {
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const id = useId();

  if (state === "done") {
    return (
      <p role="status" className={cn("flex h-14 items-center justify-center gap-2 text-[17px] text-hueso", className)}>
        <CircleCheck className="size-5" aria-hidden />
        ¡Listo! Te escribimos por WhatsApp en breve.
      </p>
    );
  }

  return (
    <form
      noValidate
      className={cn("flex w-full flex-col items-center", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem("contacto") as HTMLInputElement;
        const v = input.value.trim();
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || (/^[+\d\s()-]+$/.test(v) && v.replace(/\D/g, "").length >= 8);
        if (!ok) {
          setState("error");
          input.focus();
          return;
        }
        setState("done");
      }}
    >
      <label htmlFor={id} className="sr-only">
        Tu WhatsApp o email
      </label>
      <div className="flex w-full max-w-md items-center gap-2 rounded-full bg-hueso p-1.5 pl-5 has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ambar/60">
        <input
          id={id}
          name="contacto"
          type="text"
          autoComplete="tel"
          placeholder="WhatsApp o email"
          aria-invalid={state === "error" || undefined}
          aria-describedby={state === "error" ? `${id}-err` : undefined}
          onChange={() => state === "error" && setState("idle")}
          className="min-w-0 flex-1 bg-transparent text-base text-azul outline-none placeholder:text-azul/60"
        />
        <button type="submit" className={buttonClass("ambar", "md", "px-5 py-3")}>
          Empezar gratis
        </button>
      </div>
      {state === "error" && (
        <p id={`${id}-err`} className="mt-3 text-sm text-hueso">
          Ingresá un WhatsApp o un email válido, por ejemplo 11 2345 6789 o nombre@mail.com
        </p>
      )}
    </form>
  );
}
