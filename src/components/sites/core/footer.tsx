"use client";

import { useEffect, useRef } from "react";
import { AgentCharacter, usePointer, type AgentShape } from "./agent-character";
import { APP_URL, CALENDLY_URL, WHATSAPP_URL } from "./assets";
import { clamp } from "./shared";
import { WhatsAppPill } from "./whatsapp-pill";

type FooterAgent = {
  name: string;
  shape: AgentShape;
  color: string;
  breathe: number;
  x: number;
  y: number;
  size: number;
  mx: number;
  my: number;
  msize: number;
  rotation: number;
  response: number;
};

const FOOTER_AGENTS: FooterAgent[] = [
  { name: "Facturá", shape: "squircle", color: "#0000c8", breathe: 3.2, x: 12, y: 47, size: 17, mx: 14, my: 57, msize: 27, rotation: -8, response: 0.9 },
  { name: "Cobrá", shape: "hexagon", color: "#ffa800", breathe: 3.8, x: 37, y: 40, size: 14, mx: 39, my: 47, msize: 22, rotation: 10, response: 1.1 },
  { name: "¿Quién me debe?", shape: "pill", color: "#dce3ff", breathe: 3.5, x: 63, y: 52, size: 17, mx: 64, my: 62, msize: 27, rotation: -6, response: 1 },
  { name: "Tu tope del monotributo", shape: "sphere", color: "#00006b", breathe: 4.1, x: 88, y: 41, size: 13, mx: 88, my: 50, msize: 21, rotation: 0, response: 1.2 },
];

/** Big wordmark with agents that spring away from a fine pointer. */
function FooterArt() {
  const ref = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const pointer = usePointer();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fineMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const state = FOOTER_AGENTS.map(() => ({ x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0 }));
    let cursor: { x: number; y: number } | null = null;
    let raf = 0;
    let last = 0;

    const step = (now: number) => {
      raf = 0;
      const dt = last ? clamp((now - last) / 1000, 1 / 240, 1 / 30) : 1 / 60;
      last = now;
      const w = root.clientWidth;
      const h = root.clientHeight;
      const mobile = w <= 640;
      const k = clamp(w / 1200, 0.4, 1.5);
      let moving = false;
      state.forEach((s, i) => {
        const a = FOOTER_AGENTS[i];
        let tx = 0;
        let ty = 0;
        let tr = 0;
        if (cursor) {
          const cx = (w * (mobile ? a.mx : a.x)) / 100;
          const cy = (h * (mobile ? a.my : a.y)) / 100;
          let dx = cx - cursor.x;
          let dy = cy - cursor.y;
          const d = Math.hypot(dx, dy);
          const reach = 190 * k;
          if (d < reach) {
            if (d < 0.1) {
              dx = Math.cos(2.4 * i);
              dy = Math.sin(2.4 * i);
            }
            const force = 120 * Math.pow(1 - d / reach, 1.35) * k * a.response;
            const len = d < 0.1 ? 1 : d;
            tx = (dx / len) * force;
            ty = (dy / len) * force;
            tr = 17 * clamp((tx - 0.25 * ty) / (120 * k), -1, 1);
          }
        }
        const damp = Math.exp(-15 * dt);
        s.vx = (s.vx + (tx - s.x) * 115 * dt) * damp;
        s.vy = (s.vy + (ty - s.y) * 115 * dt) * damp;
        s.vr = (s.vr + (tr - s.r) * 115 * dt) * damp;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.r += s.vr * dt;
        const err = Math.abs(tx - s.x) + Math.abs(ty - s.y) + Math.abs(tr - s.r) + Math.abs(s.vx) + Math.abs(s.vy) + Math.abs(s.vr);
        if (err > 0.08) moving = true;
        else Object.assign(s, { x: tx, y: ty, r: tr, vx: 0, vy: 0, vr: 0 });
        const el = items.current[i];
        if (el) {
          el.style.transform = `translate(-50%, -50%) translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) rotate(${a.rotation + s.r}deg)`;
        }
      });
      if (moving) raf = requestAnimationFrame(step);
      else last = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      const r = root.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      const next = inside ? { x: e.clientX - r.left, y: e.clientY - r.top } : null;
      if (next || cursor) {
        cursor = next;
        if (!raf && !reducedMq.matches && fineMq.matches) raf = requestAnimationFrame(step);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={ref} className="relative isolate aspect-[1.65] w-full overflow-visible select-none sm:aspect-[2.4]">
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[-4%] left-1/2 z-[1] -translate-x-1/2 font-display text-[clamp(7rem,30vw,27rem)] leading-[0.8] font-bold tracking-[-0.06em] text-azul select-none"
      >
        socio
      </span>
      {FOOTER_AGENTS.map((a, i) => (
        <div
          key={a.name}
          ref={(el) => {
            items.current[i] = el;
          }}
          className="absolute top-[var(--my)] left-[var(--mx)] w-[var(--ms)] sm:top-[var(--y)] sm:left-[var(--x)] sm:w-[var(--s)]"
          style={
            {
              "--x": `${a.x}%`,
              "--y": `${a.y}%`,
              "--s": `${a.size}%`,
              "--mx": `${a.mx}%`,
              "--my": `${a.my}%`,
              "--ms": `${a.msize}%`,
              zIndex: 2,
              transform: `translate(-50%, -50%) rotate(${a.rotation}deg)`,
            } as React.CSSProperties
          }
        >
          <AgentCharacter
            shape={a.shape}
            color={a.color}
            label={a.name}
            pointerX={pointer.x}
            pointerY={pointer.y}
            breathe={a.breathe}
            className="block aspect-square w-full"
          />
        </div>
      ))}
    </div>
  );
}

const LINK = "inline-flex items-center gap-2 text-base text-foreground transition-colors hover:text-muted-foreground";

export function Footer() {
  return (
    <footer className="overflow-hidden bg-background px-4 pt-24 sm:px-8 sm:pt-32">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.1fr_1.4fr] lg:gap-20">
        <div>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
            ¿Necesitás ayuda?
          </h2>
          <p className="mt-3 max-w-sm text-base text-pretty text-muted-foreground">
            Escribinos por WhatsApp y te respondemos, o agendá una llamada y lo vemos juntos.
          </p>
          <WhatsAppPill variant="light" hint="Te respondemos" label="Escribinos por WhatsApp" className="mt-6" />
          <p className="mt-3 text-sm text-muted-foreground">
            O{" "}
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">
              agendá una llamada
            </a>
            .
          </p>
        </div>
        <nav aria-label="Pie de página" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Producto</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li><a href="#producto" className={LINK}>Cómo funciona</a></li>
              <li><a href="#precio" className={LINK}>Precio</a></li>
              <li><a href={`${APP_URL}/login`} className={LINK}>Iniciar sesión</a></li>
              <li><a href={`${APP_URL}/register`} className={LINK}>Crear cuenta</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Guías</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li><a href={`${APP_URL}/facturacion-electronica`} className={LINK}>Facturación electrónica</a></li>
              <li><a href={`${APP_URL}/facturar-por-whatsapp`} className={LINK}>Facturar por WhatsApp</a></li>
              <li><a href={`${APP_URL}/factura-a-y-b`} className={LINK}>Factura A o B</a></li>
              <li><a href={`${APP_URL}/guias`} className={LINK}>Todas las guías</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Contacto</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={LINK}>WhatsApp</a></li>
              <li><a href="mailto:soysocio2026@gmail.com" className={LINK}>soysocio2026@gmail.com</a></li>
              <li><a href={`${APP_URL}/privacidad`} className={LINK}>Privacidad</a></li>
              <li><a href={`${APP_URL}/terminos`} className={LINK}>Términos</a></li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="mx-auto mt-20 max-w-[1400px] sm:mt-28">
        <FooterArt />
      </div>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 border-t py-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>© 2026 SOCIO. Todos los derechos reservados.</p>
        <p>Hecho en Argentina</p>
      </div>
    </footer>
  );
}
