export const asset = (path: string) => `/sites/socio${path}`;

/** Destino de los botones "Escribime por WhatsApp". Reemplazar por https://wa.me/<número> cuando esté definido. */
export const WHATSAPP_URL = "#contacto";

export const CARPINCHO = {
  pensando: { src: asset("/carpincho/pensando.webp"), w: 676, h: 760, alt: "Socio, el carpincho de anteojos y corbata, pensando con un ticket en la mano" },
  sentado: { src: asset("/carpincho/sentado.webp"), w: 460, h: 783, alt: "Socio sentado, mirando el celular" },
  lupa: { src: asset("/carpincho/lupa.webp"), w: 520, h: 651, alt: "Socio revisando una factura con una lupa" },
  contento: { src: asset("/carpincho/contento.webp"), w: 460, h: 537, alt: "Socio contento" },
  curioso: { src: asset("/carpincho/curioso.webp"), w: 460, h: 536, alt: "Socio curioso" },
  alarmado: { src: asset("/carpincho/alarmado.webp"), w: 460, h: 533, alt: "Socio alarmado" },
  avatar: { src: asset("/carpincho/avatar.png"), w: 480, h: 480, alt: "Avatar de Socio" },
} as const;
