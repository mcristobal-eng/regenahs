"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { APP_URL, WHATSAPP_URL } from "./assets";
import { ENTER_DURATION, ENTER_EASE } from "./shared";
import { Wordmark } from "./wordmark";

const NAV = [
  { label: "Producto", href: "#producto" },
  { label: "Precio", href: "#precio" },
  { label: "Ayuda", href: "#faq" },
];

function DemoButton({ size = "default", className, onClick }: { size?: "default" | "lg"; className?: string; onClick?: () => void }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-core-orange pr-2.5 pl-2 text-sm font-medium whitespace-nowrap text-noche transition-all hover:brightness-105",
        size === "lg" ? "h-9" : "h-8",
        className,
      )}
    >
      <span className="relative flex size-1.5" aria-hidden>
        <span className="absolute inline-flex size-full rounded-full bg-noche opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex size-1.5 rounded-full bg-noche" />
      </span>
      WhatsApp
    </a>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <MotionConfig reducedMotion="user">
      <header className="absolute inset-x-0 top-0 z-20 w-full px-4 text-white sm:px-6">
        <motion.div
          className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ENTER_DURATION, ease: ENTER_EASE }}
        >
          <div className="flex items-center gap-10">
            <a href="#" aria-label="SOCIO, inicio" className="flex items-center text-white">
              <Wordmark className="text-[28px]" />
            </a>
            <nav aria-label="Principal" className="hidden items-center gap-7 md:flex">
              {NAV.map((item) => (
                <a key={item.href} href={item.href} className="text-[15px] font-medium text-white/90 transition-colors duration-200 hover:text-white">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="hidden items-center md:flex">
            <a href={`${APP_URL}/login`} className="text-[15px] font-medium text-white/90 transition-colors duration-200 hover:text-white">
              Iniciar sesión
            </a>
            <span className="mx-4 h-5 w-px bg-white/30" aria-hidden />
            <DemoButton />
          </div>
          <motion.button
            type="button"
            className="flex items-center md:hidden"
            onClick={() => setOpen((v) => !v)}
            whileTap={{ scale: 0.9 }}
            aria-label="Abrir menú"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu className="size-6 text-white" />
          </motion.button>
        </motion.div>
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menú"
              className="fixed inset-0 z-50 bg-background px-6 pt-24 text-foreground md:hidden"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <motion.button
                type="button"
                className="absolute top-6 right-6 p-2"
                onClick={close}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                aria-label="Cerrar menú"
              >
                <X className="size-6 text-foreground" />
              </motion.button>
              <div className="flex flex-col space-y-6">
                {NAV.map((item, i) => (
                  <motion.div key={item.href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: 0.1 * i + 0.1 }}>
                    <a href={item.href} onClick={close} className="text-base font-medium text-foreground">
                      {item.label}
                    </a>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: 0.4 }}>
                  <a href={`${APP_URL}/login`} onClick={close} className="text-base font-medium text-foreground">
                    Iniciar sesión
                  </a>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ delay: 0.5 }} className="pt-4">
                  <DemoButton size="lg" onClick={close} className="w-full" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </MotionConfig>
  );
}
