"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

export type AgentShape = "squircle" | "sphere" | "pill" | "hexagon";

type CharacterProps = {
  shape: AgentShape;
  color: string;
  label: string;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  breathe?: number;
  className?: string;
};

const SHAPE_INDEX: Record<AgentShape, number> = {
  squircle: 0,
  sphere: 1,
  pill: 2,
  hexagon: 3,
};
const SHAPE_BOTTOM: Record<AgentShape, number> = {
  squircle: 0.8,
  sphere: 0.82,
  pill: 0.54,
  hexagon: 0.84,
};
const EYES: Record<AgentShape, { x: number; y: number; gap: number }> = {
  squircle: { x: 100, y: 96, gap: 30 },
  sphere: { x: 100, y: 94, gap: 28 },
  pill: { x: 100, y: 100, gap: 30 },
  hexagon: { x: 100, y: 96, gap: 28 },
};

const VERTEX = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform int uShape;
uniform vec3 uColor;
uniform vec2 uLook;
uniform float uBlink;
uniform float uSquash;
uniform float uBottom;
out vec4 o;

const float VIEW = 1.18;

float sdRoundBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}
// Hexagonal prism SDF (Inigo Quilez, iquilezles.org)
float sdHex(vec3 p, vec2 h) {
  const vec3 k = vec3(-0.8660254, 0.5, 0.57735);
  p = abs(p);
  p.xy -= 2.0 * min(dot(k.xy, p.xy), 0.0) * k.xy;
  vec2 d = vec2(length(p.xy - vec2(clamp(p.x, -k.z * h.x, k.z * h.x), h.x)) * sign(p.y - h.x), p.z - h.y);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}
float sdRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }

vec3 toBody(vec3 p) {
  p = rotX(-uLook.y * 0.22) * (rotY(-uLook.x * 0.38) * p);
  float sy = 1.0 + uSquash;
  float sx = 1.0 - uSquash * 0.6;
  p.y = (p.y + uBottom) / sy - uBottom;
  p.xz /= sx;
  return p;
}
float body(vec3 q) {
  if (uShape == 0) return sdRoundBox(q, vec3(0.78, 0.78, 0.62), 0.4);
  if (uShape == 1) return length(q) - 0.82;
  if (uShape == 2) return sdRoundBox(q, vec3(0.98, 0.54, 0.52), 0.52);
  return sdHex(vec3(q.y, q.x, q.z), vec2(0.70, 0.46)) - 0.16;
}
float map(vec3 p) { return body(toBody(p)) * 0.85; }
vec3 normalAt(vec3 p) {
  vec2 e = vec2(0.0015, 0.0);
  return normalize(vec3(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx)));
}

void main() {
  float px = VIEW * 2.0 / min(uRes.x, uRes.y);
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) * px;
  vec3 ro = vec3(uv, 4.0);
  vec3 rd = vec3(0.0, 0.0, -1.0);

  float t = 0.0;
  float minD = 1e3;
  bool hit = false;
  for (int i = 0; i < 90; i++) {
    float d = map(ro + rd * t);
    minD = min(minD, d);
    if (d < 0.0006) { hit = true; break; }
    t += d;
    if (t > 8.0) break;
  }
  float alpha = hit ? 1.0 : 1.0 - smoothstep(0.0, px * 1.3, minD);
  if (alpha <= 0.0) { o = vec4(0.0); return; }
  if (!hit) t = 4.0 - 0.3;

  vec3 p = ro + rd * t;
  vec3 n = normalAt(p);
  vec3 q = toBody(p);

  vec3 base = pow(uColor, vec3(2.2));
  vec3 L = normalize(vec3(-0.55, 0.75, 0.65));
  float wrap = clamp((dot(n, L) + 0.45) / 1.45, 0.0, 1.0);
  vec3 sky = vec3(1.0, 1.0, 1.03);
  vec3 ground = vec3(0.56, 0.52, 0.5);
  vec3 amb = mix(ground, sky, 0.5 + 0.5 * n.y);

  vec3 col = base * (0.32 * amb + 0.92 * wrap * vec3(1.0, 0.98, 0.95));
  col *= mix(0.7, 1.0, smoothstep(-uBottom, 0.15, q.y));
  float fres = pow(1.0 - max(n.z, 0.0), 2.5);
  col += base * fres * 0.2;
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  col += vec3(1.0) * pow(max(dot(n, H), 0.0), 26.0) * 0.2;

  if (q.z > 0.0) {
    float gap = 0.15;
    float ey = uShape == 2 ? 0.02 : 0.05;
    vec2 off = vec2(uLook.x * 0.1, -uLook.y * 0.07);
    vec2 hs = vec2(0.058, 0.13 * max(0.08, 1.0 - uBlink));
    float aa = px * 1.4;
    float de = min(
      sdRect(q.xy - vec2(-gap, ey) - off, hs, 0.058),
      sdRect(q.xy - vec2(gap, ey) - off, hs, 0.058));
    float eye = 1.0 - smoothstep(-aa, aa, de);
    col = mix(col, pow(vec3(0.17, 0.145, 0.13), vec3(2.2)), eye);
    float dh = min(
      sdRect(q.xy - vec2(-gap - 0.018, ey + 0.05) - off, vec2(0.016, 0.026 * (1.0 - uBlink)), 0.016),
      sdRect(q.xy - vec2(gap - 0.018, ey + 0.05) - off, vec2(0.016, 0.026 * (1.0 - uBlink)), 0.016));
    col = mix(col, vec3(0.85), (1.0 - smoothstep(-aa, aa, dh)) * eye);
  }

  col = pow(clamp(col, 0.0, 1.0), vec3(1.0 / 2.2));
  o = vec4(col * alpha, alpha);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function ShapePath({ shape, fill }: { shape: AgentShape; fill: string }) {
  switch (shape) {
    case "squircle":
      return <rect x="30" y="30" width="140" height="140" rx="58" fill={fill} />;
    case "sphere":
      return <circle cx="100" cy="100" r="74" fill={fill} />;
    case "pill":
      return <rect x="12" y="52" width="176" height="96" rx="48" fill={fill} />;
    default:
      return (
        <path
          d="M100 24 L166 62 L166 138 L100 176 L34 138 L34 62 Z"
          fill={fill}
          stroke={fill}
          strokeWidth="22"
          strokeLinejoin="round"
        />
      );
  }
}

/** SVG fallback for browsers without WebGL2. */
function CharacterSvg({
  shape,
  color,
  label,
  pointerX,
  pointerY,
  breathe = 3.4,
  className,
}: CharacterProps) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const eyeX = useSpring(0, { stiffness: 120, damping: 16 });
  const eyeY = useSpring(0, { stiffness: 120, damping: 16 });
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let timer: number;
    const wander = () => {
      eyeX.set((Math.random() * 2 - 1) * 24);
      eyeY.set((Math.random() * 2 - 1) * 10.5);
      timer = window.setTimeout(wander, 1800 + Math.random() * 2400);
    };
    const follow = () => {
      const el = ref.current;
      const px = pointerX.get();
      const py = pointerY.get();
      if (el && px >= 0) {
        const r = el.getBoundingClientRect();
        const dx = px - (r.left + r.width / 2);
        const dy = py - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 260);
        eyeX.set((dx / d) * 24 * k);
        eyeY.set((dy / d) * 15 * k);
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(wander, 2600);
    };
    const offX = pointerX.on("change", follow);
    const offY = pointerY.on("change", follow);
    timer = window.setTimeout(wander, 1200 + Math.random() * 1500);
    return () => {
      offX();
      offY();
      window.clearTimeout(timer);
    };
  }, [pointerX, pointerY, eyeX, eyeY, reduced]);

  useEffect(() => {
    if (reduced) return;
    let timer: number;
    const schedule = () => {
      timer = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 130);
        if (Math.random() < 0.25) {
          window.setTimeout(() => setBlink(true), 260);
          window.setTimeout(() => setBlink(false), 390);
        }
        schedule();
      }, 2500 + Math.random() * 3500);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [reduced]);

  const eyes = EYES[shape];
  const light = `color-mix(in oklab, ${color} 45%, white)`;
  const dark = `color-mix(in oklab, ${color} 78%, #2b1d14)`;

  return (
    <div ref={ref} role="img" aria-label={label} className={className}>
      <motion.div
        className="relative size-full"
        animate={
          reduced
            ? undefined
            : { y: ["0%", "-3%", "0%"], scaleY: [1, 1.025, 1], scaleX: [1, 0.985, 1] }
        }
        transition={{ duration: breathe, ease: "easeInOut", repeat: Infinity }}
        style={{ transformOrigin: "50% 100%" }}
        whileHover={reduced ? undefined : { y: "-12%", scaleY: 1.06, scaleX: 0.96 }}
      >
        <svg viewBox="0 0 200 200" className="size-full overflow-visible">
          <defs>
            <radialGradient id={`${id}-body`} cx="0.36" cy="0.28" r="0.85">
              <stop offset="0" stopColor={light} />
              <stop offset="0.5" stopColor={color} />
              <stop offset="1" stopColor={dark} />
            </radialGradient>
            <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
            <clipPath id={`${id}-clip`}>
              <ShapePath shape={shape} fill="#000" />
            </clipPath>
          </defs>
          <ellipse cx="100" cy="192" rx="62" ry="7" fill="#00006b" opacity="0.14" filter={`url(#${id}-soft)`} />
          <ShapePath shape={shape} fill={`url(#${id}-body)`} />
          <g clipPath={`url(#${id}-clip)`}>
            <ellipse cx="74" cy="56" rx="38" ry="22" fill="white" opacity="0.5" filter={`url(#${id}-soft)`} />
            <ellipse cx="110" cy="188" rx="70" ry="16" fill="white" opacity="0.18" filter={`url(#${id}-soft)`} />
          </g>
          <motion.g style={{ x: eyeX, y: eyeY }}>
            <motion.g
              animate={{ scaleY: blink ? 0.12 : 1 }}
              transition={{ duration: 0.07 }}
              style={{ transformOrigin: `${eyes.x}px ${eyes.y}px` }}
            >
              {[-1, 1].map((side) => (
                <g key={side}>
                  <rect x={eyes.x + (side * eyes.gap) / 2 - 5.5} y={eyes.y - 12} width="11" height="24" rx="5.5" fill="#2b2522" />
                  <rect x={eyes.x + (side * eyes.gap) / 2 - 2.5} y={eyes.y - 8.5} width="3.5" height="5" rx="1.75" fill="white" opacity="0.85" />
                </g>
              ))}
            </motion.g>
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}

/** Ray-marched soft 3D agent with eyes that follow the pointer and blink. */
export function AgentCharacter(props: CharacterProps) {
  const { shape, color, label, pointerX, pointerY, breathe = 3.4, className } = props;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    });
    const vs = gl && compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = gl && compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl && vs && fs ? gl.createProgram() : null;
    if (gl && program && vs && fs) {
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
    }
    if (!gl || !program || !vs || !fs || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
      wrap.dataset.gl = "off";
      return;
    }
    wrap.dataset.gl = "on";

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uLook = gl.getUniformLocation(program, "uLook");
    const uBlink = gl.getUniformLocation(program, "uBlink");
    const uSquash = gl.getUniformLocation(program, "uSquash");
    const hex = parseInt(color.replace("#", ""), 16);
    gl.uniform1i(gl.getUniformLocation(program, "uShape"), SHAPE_INDEX[shape]);
    gl.uniform3fv(gl.getUniformLocation(program, "uColor"), [
      ((hex >> 16) & 255) / 255,
      ((hex >> 8) & 255) / 255,
      (hex & 255) / 255,
    ]);
    gl.uniform1f(gl.getUniformLocation(program, "uBottom"), SHAPE_BOTTOM[shape]);

    let lookX = 0;
    let lookY = 0;
    let targetX = 0;
    let targetY = 0;
    let lastPointer = -1e9;
    let nextWander = 0;
    let nextBlink = performance.now() + 1500 + Math.random() * 3000;
    let blinkAt = -1e9;
    let doubleBlink = false;
    const phase = Math.random() * Math.PI * 2;
    const offX = pointerX.on("change", () => (lastPointer = performance.now()));
    const offY = pointerY.on("change", () => (lastPointer = performance.now()));
    let raf = 0;
    let visible = false;

    const frame = (now: number) => {
      raf = 0;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const px = pointerX.get();
      if (px >= 0 && now - lastPointer < 2600) {
        const r = canvas.getBoundingClientRect();
        const dx = px - (r.left + r.width / 2);
        const dy = pointerY.get() - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 280);
        targetX = (dx / d) * k;
        targetY = (dy / d) * k;
      } else if (now > nextWander) {
        targetX = Math.random() * 2 - 1;
        targetY = (Math.random() * 2 - 1) * 0.6;
        nextWander = now + 1800 + Math.random() * 2400;
      }
      lookX += (targetX - lookX) * 0.12;
      lookY += (targetY - lookY) * 0.12;
      if (now > nextBlink) {
        blinkAt = now;
        doubleBlink = Math.random() < 0.25;
        nextBlink = now + 2500 + Math.random() * 3500;
      }
      const since = now - blinkAt;
      const pulse = (t: number) => (t >= 0 && t < 140 ? Math.sin((t / 140) * Math.PI) : 0);
      const blink = Math.max(pulse(since), doubleBlink ? pulse(since - 260) : 0);
      const squash = reduced ? 0 : 0.03 * Math.sin((now / 1000) * ((2 * Math.PI) / breathe) + phase);

      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      gl.uniform2f(uLook, lookX, lookY);
      gl.uniform1f(uBlink, reduced ? 0 : blink);
      gl.uniform1f(uSquash, squash);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible && !reduced) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);
    raf = requestAnimationFrame(frame);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      offX();
      offY();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [shape, color, breathe, pointerX, pointerY, reduced]);

  const shadowTop = `${50 * (1 + SHAPE_BOTTOM[shape] / 1.18)}%`;

  return (
    <div ref={wrapRef} role="img" aria-label={label} className={`group ${className ?? ""}`}>
      <motion.div
        className="relative size-full"
        whileHover={reduced ? undefined : { y: "-10%" }}
        transition={{ type: "spring", stiffness: 300, damping: 14 }}
      >
        <span
          aria-hidden
          className="absolute left-1/2 h-[7%] w-[58%] -translate-x-1/2 rounded-[50%] bg-noche/20 blur-md group-data-[gl=off]:hidden"
          style={{ top: shadowTop }}
        />
        <canvas ref={canvasRef} aria-hidden className="relative size-full group-data-[gl=off]:hidden" />
        <div className="absolute inset-0 hidden group-data-[gl=off]:block">
          <CharacterSvg {...props} className="size-full" />
        </div>
      </motion.div>
    </div>
  );
}

/** Window-level pointer position shared by a group of characters. */
export function usePointer() {
  const x = useMotionValue(-1);
  const y = useMotionValue(-1);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);
  return { x, y };
}
