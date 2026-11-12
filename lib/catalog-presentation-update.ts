import type { Piece } from "./site-data";
import { CATALOG_ADDITIONS } from "./catalog-additions";

const multicolorPhoto = "/images/catalog/bear-multicolor-01.webp";
const orangePhoto = "/images/catalog/piece-29-color-orange.webp";

export function separateMulticolorBear<T extends Piece>(pieces: T[]): T[] {
  const next = structuredClone(pieces);
  const bear = next.find(piece => piece.id === "piece-27");
  const multicolor = next.find(piece => piece.id === "bear-multicolor");
  if (bear) {
    bear.images = (bear.images ?? []).filter(src => src !== multicolorPhoto && !multicolor?.images?.includes(src));
    bear.description = [
      "Un ícono lúdico reinterpretado como acento escultórico de resina translúcida y acabado brillante. Colores: rojo, rosa, amarillo, verde, azul claro, azul cobalto, negro y blanco. También se muestra el acabado ahumado. Disponibilidad y medidas de cada acabado por confirmar.",
      "A playful icon reimagined as a glossy, translucent resin accent. Colors: red, pink, yellow, green, baby blue, cobalt blue, black and white. A smoky finish is also pictured. Availability and dimensions for each finish are confirmed on request.",
    ];
  }
  if (!multicolor) {
    const source = CATALOG_ADDITIONS.find(piece => piece.id === "bear-multicolor")!;
    next.push({ ...structuredClone(source), name: "Gummy Bear multicolor", nameEn: "Multicolored Gummy Bear",
      mat: ["Resina translúcida con acabado brillante", "Translucent resin with a glossy finish"],
      dim: "No especificadas", published: true, availability: "on-request",
      description: [
        "Escultura de oso en resina translúcida que contiene pequeñas figuras de osos en azul, rosa, rojo, violeta, amarillo y verde. Una composición multicolor de acabado brillante. Medidas y disponibilidad por confirmar.",
        "A translucent resin bear sculpture containing smaller bear figures in blue, pink, red, violet, yellow and green. A multicolored composition with a glossy finish. Dimensions and availability are confirmed on request.",
      ],
    } as T);
  }
  const lollipop = next.find(piece => piece.id === "piece-29");
  if (lollipop?.images?.includes(orangePhoto)) lollipop.images = [orangePhoto, ...lollipop.images.filter(src => src !== orangePhoto)];
  const frida = next.find(piece => piece.id === "cynthia-padilla-frida");
  if (frida) frida.images = (frida.images ?? []).filter(src => ![
    "/images/catalog/cynthia-padilla-frida-02.webp",
    "/images/catalog/cynthia-padilla-frida-03.webp",
    "/images/catalog/cynthia-padilla-frida-04.webp",
  ].includes(src));
  return next;
}
