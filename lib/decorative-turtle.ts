import type { ManagedPiece } from "./cms-types";

export const DECORATIVE_TURTLE: ManagedPiece = {
  id: "decorative-turtle",
  name: "Tortuga decorativa con motivos florales",
  nameEn: "Decorative Turtle with Floral Motifs",
  cat: "pop",
  designer: "No especificado",
  origin: "No especificado",
  mat: ["Materiales por confirmar", "Materials to be confirmed"],
  dim: "No especificadas",
  description: [
    "Figura de tortuga con un caparazón marrón decorado con flores de colores y una libélula en relieve. El modelo 3D es una recreación aproximada a partir de fotografías, con escala y detalles orientativos.",
    "A turtle figure with a brown shell decorated with colorful floral motifs and a raised dragonfly. The 3D model is an approximation based on photographs, with illustrative scale and details.",
  ],
  images: [1, 2, 3].map(number => `/images/catalog/decorative-turtle-0${number}.webp`),
  model: { glb: "/models/decorative-turtle.glb", usdz: "/models/decorative-turtle.usdz" },
  published: true,
  availability: "on-request",
};
