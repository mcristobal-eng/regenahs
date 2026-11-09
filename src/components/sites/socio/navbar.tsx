"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { WHATSAPP_URL, asset } from "./assets";
import { ENTER_EASE, buttonClass } from "./shared";

const NAV = [
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Ejemplos", href: "#ejemplos" },
  { label: "Precio", href: "#precio" },
  { label: "Preguntas", href: "#preguntas" },
];

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
      <header className="absolute inset-x-0 top-0 z-20 w-full px-4 text-azul sm:px-6">
        <motion.div
          className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: ENTER_EASE }}
        >
          <a href="#" aria-label="SOCIO, inicio" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/brand/logo.svg")} alt="SOCIO" width={858} height={260} className="h-9 w-auto" />
          </a>
          <div className="hidden items-center gap-7 md:flex">
            <nav aria-label="Principal" className="flex items-center gap-6">
              {NAV.map((item) => (
                <a key={item.href} href={item.href} className="text-[15px] font-semibold transition-opacity hover:opacity-70">
                  {item.label}
                </a>
              ))}
            </nav>
            {/* El botón de la barra queda en azul: el ámbar es solo para el hero. */}
            <a href={WHATSAPP_URL} className={buttonClass("azul", "sm")}>
              Escribime por WhatsApp
            </a>
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
            <Menu className="size-7" />
          </motion.button>
        </motion.div>
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menú"
              className="fixed inset-0 z-50 flex flex-col bg-azul px-6 pt-24 pb-10 text-hueso md:hidden"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
            >
              <button type="button" className="absolute top-6 right-5 p-2" onClick={close} aria-label="Cerrar menú">
                <X className="size-7" />
              </button>
              <nav className="flex flex-col gap-5">
                {NAV.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className="text-[34px] leading-none font-extrabold tracking-[-0.03em]"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * i + 0.1 }}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>
              <a href={WHATSAPP_URL} onClick={close} className={buttonClass("hueso", "md", "mt-auto w-full")}>
                Escribime por WhatsApp
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </MotionConfig>
  );
}
