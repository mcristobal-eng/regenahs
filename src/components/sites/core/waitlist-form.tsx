"use client";

import { CircleCheck } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

type WaitlistFormProps = {
  className?: string;
  variant?: "glass" | "light";
  contact?: "email" | "email-or-phone";
  purpose?: "pilot" | "newsletter";
};

export function WaitlistForm({
  className,
  variant = "glass",
  contact = "email",
  purpose = "pilot",
}: WaitlistFormProps) {
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const light = variant === "light";
  const id = useId();
  const inputId = `${id}-email`;
  const errorId = `${id}-error`;
  const flexible = contact === "email-or-phone";
  const newsletter = purpose === "newsletter";

  if (state === "done") {
    return (
      <p
        role="status"
        className={cn(
          "flex h-11 items-center gap-2 text-sm",
          light ? "text-foreground" : "justify-center text-white",
          className,
        )}
      >
        <CircleCheck className="size-4" aria-hidden />
        {flexible
          ? "¡Gracias! Te contactamos en breve para charlar."
          : newsletter
            ? "¡Listo! Ya estás suscripto al newsletter."
            : "¡Listo! Te vamos a escribir para sumarte a las pruebas piloto."}
      </p>
    );
  }

  const label = flexible ? "Charlemos" : newsletter ? "Suscribirme" : "Comenzar";
  const hint = flexible
    ? "Te contactamos para contarte más"
    : newsletter
      ? "Recibí las novedades de core por email"
      : "Quiero formar parte de las pruebas piloto";

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
        const value = input.value.trim();
        const valid = flexible
          ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
            (/^[+\d\s()-]+$/.test(value) && value.replace(/\D/g, "").length >= 8)
          : input.checkValidity();
        if (!valid) {
          setState("error");
          input.focus();
          return;
        }
        setState("done");
      }}
      className={cn("flex w-full flex-col", light ? "items-start" : "items-center", className)}
    >
      <label htmlFor={inputId} className="sr-only">
        {flexible ? "Tu email o teléfono" : "Tu email"}
      </label>
      <div
        role="group"
        className={cn(
          "relative flex h-11 max-w-full min-w-0 items-center rounded-lg border border-input transition-[width,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50 has-[[aria-invalid=true]]:border-destructive motion-reduce:transition-none",
          flexible
            ? "w-[18rem] focus-within:w-[21rem] has-[input:not(:placeholder-shown)]:w-[21rem]"
            : newsletter
              ? "w-[15rem] focus-within:w-[19rem] has-[input:not(:placeholder-shown)]:w-[19rem]"
              : "w-[13rem] focus-within:w-[17.3rem] has-[input:not(:placeholder-shown)]:w-[17.3rem]",
          !light &&
            "border-white/30 bg-white/15 backdrop-blur-md has-[input:focus-visible]:border-white/70 has-[input:focus-visible]:ring-white/25",
        )}
      >
        <input
          id={inputId}
          name="email"
          type={flexible ? "text" : "email"}
          required
          autoComplete={flexible ? "on" : "email"}
          placeholder={flexible ? "Email o teléfono" : "Tu email"}
          aria-invalid={state === "error" || undefined}
          aria-describedby={state === "error" ? errorId : undefined}
          onChange={() => state === "error" && setState("idle")}
          className={cn(
            "h-8 w-full min-w-0 flex-1 bg-transparent py-1 pr-2.5 pl-3.5 text-base outline-none placeholder:text-muted-foreground md:text-sm",
            !light && "text-white placeholder:text-white/70",
          )}
        />
        <div className="order-last mr-[-0.3rem] flex items-center py-1.5 pr-2">
          <button
            type="submit"
            title={hint}
            className={cn(
              "inline-flex h-8 shrink-0 items-center gap-2 rounded-lg px-2.5 text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px",
              light
                ? "bg-primary text-primary-foreground hover:bg-primary/80"
                : "bg-white text-core-ink hover:bg-white/90",
            )}
          >
            {label}
          </button>
        </div>
      </div>
      {state === "error" && (
        <p id={errorId} className={cn("mt-2 text-sm", light ? "text-destructive" : "text-center text-white")}>
          {flexible
            ? "Ingresá un email o un teléfono válido, por ejemplo nombre@campo.com o 11 2345 6789"
            : "Ingresá un email válido, por ejemplo nombre@campo.com"}
        </p>
      )}
    </form>
  );
}
