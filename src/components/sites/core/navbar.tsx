"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ENTER_DURATION, ENTER_EASE, SOCIALS, asset } from "./shared";

const NAV = [
  { label: "Producto", href: "#producto" },
  { label: "Agentes", href: "#agentes" },
  { label: "Historias", href: "#historias" },
];

function DemoButton({ size = "default", className, onClick }: { size?: "default" | "lg"; className?: string; onClick?: () => void }) {
  return (
    <a
      href="#contacto"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-core-orange pr-2.5 pl-2 text-sm font-medium whitespace-nowrap text-white transition-all hover:bg-core-orange/90",
        size === "lg" ? "h-9" : "h-8",
        className,
      )}
    >
      <span className="relative flex size-1.5" aria-hidden>
        <span className="absolute inline-flex size-full rounded-full bg-white opacity-75 motion-safe:animate-ping" />
        <span className="relative inline-flex size-1.5 rounded-full bg-white" />
      </span>
      Demo
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
            <a href="#" aria-label="core, inicio" className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/brand/logo-poppins.svg")} alt="core" width={77} height={24} className="h-6 w-auto brightness-0 invert" />
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
            <div className="flex items-center gap-1">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-8 items-center justify-center rounded-lg text-white transition-all hover:bg-white/15 [&_svg]:size-4"
                >
                  <Icon />
                </a>
              ))}
            </div>
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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ delay: 0.4 }} className="flex gap-2 pt-2">
                  {SOCIALS.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted [&_svg]:size-4"
                    >
                      <Icon />
                    </a>
                  ))}
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
