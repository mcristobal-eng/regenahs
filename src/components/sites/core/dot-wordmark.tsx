"use client";

import { useEffect, useRef } from "react";
import { APP_URL, WHATSAPP_URL } from "./assets";

type Props = {
  word?: string;
  background?: string;
  ink?: string;
  warm?: string;
  gap?: number;
  radius?: number;
};

const parseHex = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/**
 * Cierre de página: la palabra "socio" dibujada con puntos. Los puntos se corren
 * al pasar el cursor, se tiñen de ámbar mientras están desplazados y vuelven
 * con un resorte; un clic manda una onda.
 */
export function DotWordmark({
  word = "socio",
  background = "#00006b",
  ink = "#eeeee9",
  warm = "#ffa800",
  gap = 6,
  radius = 90,
}: Props) {
  const wrapRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const inkRGB = parseHex(ink);
    const warmRGB = parseHex(warm);
    // Per dot: x, y, vx, vy, homeX, homeY, size
    let dots = new Float32Array(0);
    let count = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let pointer = { x: -1e5, y: -1e5 };
    let wave = { x: 0, y: 0, start: -1 };
    let raf = 0;
    let visible = true;

    const layout = () => {
      const rect = wrap.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      // Rasterize the word off-screen and sample its coverage on a grid.
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;
      const family = getComputedStyle(wrap).getPropertyValue("--font-bricolage").trim() || "sans-serif";
      o.font = `700 100px ${family}`;
      const size = (100 * w * 1.0) / Math.max(1, o.measureText(word).width);
      o.font = `700 ${size}px ${family}`;
      const m = o.measureText(word);
      const ascent = m.actualBoundingBoxAscent || size * 0.72;
      o.fillStyle = "#000";
      // Sit the word on the bottom edge, with its lower fifth cut off.
      o.fillText(word, (w - m.width) / 2, h + ascent * 0.18);
      const data = o.getImageData(0, 0, w, h).data;

      const cols = Math.ceil(w / gap);
      const rows = Math.ceil(h / gap);
      const out: number[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let cover = 0;
          for (let sy = 0; sy < 2; sy++) {
            for (let sx = 0; sx < 2; sx++) {
              const px = Math.min(w - 1, Math.floor(c * gap + ((sx + 0.5) * gap) / 2));
              const py = Math.min(h - 1, Math.floor(r * gap + ((sy + 0.5) * gap) / 2));
              cover += data[(py * w + px) * 4 + 3];
            }
          }
          cover /= 4 * 255;
          if (cover < 0.08) continue;
          const x = c * gap + gap / 2;
          const y = r * gap + gap / 2;
          out.push(x, y, 0, 0, x, y, Math.sqrt(cover) * gap * 0.55);
        }
      }
      dots = new Float32Array(out);
      count = out.length / 7;
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, w, h);
      const since = wave.start < 0 ? Infinity : now - wave.start;
      const front = since * 0.9;
      let moving = false;
      for (let i = 0; i < count; i++) {
        const k = i * 7;
        let x = dots[k];
        let y = dots[k + 1];
        let vx = dots[k + 2];
        let vy = dots[k + 3];
        const hx = dots[k + 4];
        const hy = dots[k + 5];
        if (!reduced) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < radius * radius) {
            const d = Math.sqrt(d2) + 0.001;
            const push = (1 - d / radius) * 2.4;
            vx += (dx / d) * push;
            vy += (dy / d) * push;
          }
          if (since < 900) {
            const wx = hx - wave.x;
            const wy = hy - wave.y;
            const wd = Math.sqrt(wx * wx + wy * wy) + 0.001;
            const ring = 1 - Math.min(1, Math.abs(wd - front) / 28);
            if (ring > 0) {
              const kick = 3 * ring * (1 - since / 900);
              vx += (wx / wd) * kick;
              vy += (wy / wd) * kick;
            }
          }
          vx = (vx + (hx - x) * 0.05) * 0.85;
          vy = (vy + (hy - y) * 0.05) * 0.85;
          x += vx;
          y += vy;
          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) moving = true;
          else {
            x = hx;
            y = hy;
            vx = 0;
            vy = 0;
          }
          dots[k] = x;
          dots[k + 1] = y;
          dots[k + 2] = vx;
          dots[k + 3] = vy;
        }
        const off = Math.min(1, Math.hypot(x - hx, y - hy) / 24);
        ctx.fillStyle =
          off > 0.02
            ? `rgb(${Math.round(inkRGB[0] + (warmRGB[0] - inkRGB[0]) * off)},${Math.round(inkRGB[1] + (warmRGB[1] - inkRGB[1]) * off)},${Math.round(inkRGB[2] + (warmRGB[2] - inkRGB[2]) * off)})`
            : ink;
        ctx.beginPath();
        ctx.arc(x, y, dots[k + 6], 0, Math.PI * 2);
        ctx.fill();
      }
      return moving || since < 900 || pointer.x > -1e4;
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible) return;
      if (draw(now)) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };
    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      pointer = local(e);
      kick();
    };
    const onLeave = () => {
      pointer = { x: -1e5, y: -1e5 };
      kick();
    };
    const onDown = (e: PointerEvent) => {
      if (reduced || (e.target as HTMLElement).closest("a,button")) return;
      const p = local(e);
      wave = { x: p.x, y: p.y, start: performance.now() };
      kick();
    };

    layout();
    draw(performance.now());
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerdown", onDown);
    const ro = new ResizeObserver(() => {
      layout();
      draw(performance.now());
    });
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(wrap);
    let alive = true;
    document.fonts?.ready.then(() => {
      if (!alive) return;
      layout();
      draw(performance.now());
    });
    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerdown", onDown);
    };
  }, [word, background, ink, warm, gap, radius]);

  return (
    <section
      ref={wrapRef}
      aria-label="SOCIO"
      className="relative isolate h-[clamp(320px,42vw,560px)] w-full overflow-hidden bg-noche text-hueso"
    >
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
      <div className="relative z-[1] flex flex-wrap items-start justify-between gap-6 px-[clamp(20px,3.4vw,44px)] pt-[clamp(22px,3.4vw,40px)] font-mono text-[10.5px] tracking-[0.18em] uppercase">
        <p>
          <strong className="block font-medium">SOCIO</strong>
          <span className="opacity-50">©2026 · Hecho en Argentina</span>
        </p>
        <div className="flex gap-6">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="opacity-80 transition-opacity hover:opacity-100">
            WhatsApp
          </a>
          <a href={`${APP_URL}/register`} className="opacity-80 transition-opacity hover:opacity-100">
            Crear cuenta
          </a>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="uppercase opacity-80 transition-opacity hover:opacity-100">
            Volver arriba ↑
          </button>
        </div>
      </div>
    </section>
  );
}
