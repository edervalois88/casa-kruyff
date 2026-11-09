import type { ManagedPiece } from "./cms-types";
import type { Designer } from "./site-data";

export const CYNTHIA_PADILLA: Designer = {
  id: "cynthia-padilla",
  name: "Cynthia Padilla",
  origin: "México",
  disc: ["Arte e impresiones intervenidas", "Art and hand-embellished prints"],
};

export const CYNTHIA_PRINT: ManagedPiece = {
  id: "cynthia-padilla-frida",
  name: "Retrato de Frida Kahlo con hoja de oro",
  nameEn: "Frida Kahlo Portrait with Gold Leaf",
  cat: "arte",
  designer: CYNTHIA_PADILLA.name,
  origin: CYNTHIA_PADILLA.origin,
  mat: ["Impresión intervenida a mano con acrílico y hoja de oro", "Print hand-embellished with acrylic paint and gold leaf"],
  dim: "180 × 120 cm",
  description: [
    "Retrato enmarcado de Frida Kahlo rodeada de motivos botánicos. Cynthia Padilla intervino la impresión a mano con pintura acrílica en las hojas y detalles de hoja de oro.",
    "A framed portrait of Frida Kahlo surrounded by botanical motifs. Cynthia Padilla embellished the print by hand with acrylic paint on the leaves and accents of gold leaf.",
  ],
  images: ["01", "02", "03", "04"].map(number => `/images/catalog/cynthia-padilla-frida-${number}.webp`),
  published: true,
  availability: "on-request",
};
