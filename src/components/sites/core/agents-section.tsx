"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { AgentCharacter, usePointer, type AgentShape } from "./agent-character";

type Agent = {
  name: string;
  shape: AgentShape;
  color: string;
  at: { x: number; y: number };
  from: { x: number; y: number };
  size: number;
  breathe: number;
};

const AGENTS: Agent[] = [
  { name: "Facturá", shape: "squircle", color: "#00f790", at: { x: 19, y: 25 }, from: { x: -15, y: 0 }, size: 1, breathe: 3.2 },
  { name: "Cobrá", shape: "hexagon", color: "#f83e00", at: { x: 80, y: 23 }, from: { x: 115, y: -5 }, size: 0.95, breathe: 3.8 },
  { name: "¿Quién me debe?", shape: "pill", color: "#f8ebd7", at: { x: 23, y: 76 }, from: { x: -10, y: 115 }, size: 1.05, breathe: 3.5 },
  { name: "Tu tope del monotributo", shape: "sphere", color: "#0093d8", at: { x: 78, y: 74 }, from: { x: 112, y: 112 }, size: 0.9, breathe: 4.1 },
];

function FlyingAgent({
  agent,
  index,
  progress,
  pointerX,
  pointerY,
}: {
  agent: Agent;
  index: number;
  progress: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  const start = 0.3 + 0.07 * index;
  const t = useTransform(progress, (p) => 1 - Math.pow(1 - Math.min(1, Math.max(0, (p - start) / 0.32)), 3));
  const left = useTransform(t, (v) => `${agent.from.x + (agent.at.x - agent.from.x) * v}%`);
  const top = useTransform(t, (v) => `${agent.from.y + (agent.at.y - agent.from.y) * v}%`);
  const rotate = useTransform(t, (v) => (1 - v) * (index % 2 ? 24 : -24));
  const scale = useTransform(t, (v) => 0.7 + 0.3 * v);
  const size = `calc(clamp(84px, 12.5vw, 190px) * ${agent.size})`;
  return (
    <motion.div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left, top, rotate, scale, width: size, height: size }}>
      <AgentCharacter
        shape={agent.shape}
        color={agent.color}
        label={agent.name}
        pointerX={pointerX}
        pointerY={pointerY}
        breathe={agent.breathe}
        className="size-full"
      />
    </motion.div>
  );
}

export function AgentsSection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const progress = useTransform(scrollYProgress, (p) => (reduced ? 1 : p));
  const opacity = useTransform(progress, [0.12, 0.42], [0, 1]);
  const filter = useTransform(progress, [0.12, 0.42], ["blur(10px)", "blur(0px)"]);
  const y = useTransform(progress, [0.12, 0.42], [30, 0]);
  const pointer = usePointer();

  return (
    <section ref={ref} id="que-hace" aria-label="Qué hace SOCIO" className="relative h-[240vh] bg-background">
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <motion.h2
            className="max-w-[14ch] text-center font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance sm:max-w-[18ch]"
            style={{ opacity, filter, y }}
          >
            Facturá, cobrá y sabé quién te debe, sin salir del chat
          </motion.h2>
        </div>
        {AGENTS.map((agent, i) => (
          <FlyingAgent key={agent.name} agent={agent} index={i} progress={progress} pointerX={pointer.x} pointerY={pointer.y} />
        ))}
      </div>
    </section>
  );
}
