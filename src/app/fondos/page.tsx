import type { Metadata } from "next";
import { DashboardSection } from "@/components/sites/core/dashboard-section";
import type { SectionBackground } from "@/components/sites/core/section-backgrounds";

export const metadata: Metadata = { title: "SOCIO · Opciones de fondo", robots: { index: false } };

const OPTIONS: { id: SectionBackground; label: string }[] = [
  { id: "cielo", label: "Actual · Cielo" },
  { id: "aurora", label: "Opción 1 · Aurora" },
  { id: "puntos", label: "Opción 2 · Puntos" },
  { id: "lineas", label: "Opción 3 · Líneas" },
  { id: "malla", label: "Opción 4 · Malla de color" },
];

/** Página de prueba para comparar fondos de la sección del panel. No se enlaza desde la landing. */
export default function Fondos() {
  return (
    <main className="bg-background py-10">
      {OPTIONS.map((o) => (
        <div key={o.id}>
          <p className="mx-auto max-w-6xl px-6 pt-8 font-mono text-sm tracking-[0.12em] text-azul uppercase">{o.label}</p>
          <DashboardSection background={o.id} id={`fondo-${o.id}`} />
        </div>
      ))}
    </main>
  );
}
