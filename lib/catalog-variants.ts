import type { Piece } from "./site-data";

type Variant = { id: string; es: string; en: string; photos: number[] };
export const PRODUCT_SPLITS: Record<string, Variant[]> = {
  "piece-08": [
    { id: "piece-08", es: "Corazones de colores", en: "Colored Hearts", photos: [1] },
    { id: "piece-08-ivory", es: "Corazón marfil", en: "Ivory Heart", photos: [2, 3] },
  ],
  "piece-09": [
    { id: "piece-09", es: "Venado", en: "Deer", photos: [2, 1] },
    { id: "piece-09-bird", es: "Ave", en: "Bird", photos: [3] },
    { id: "piece-09-owl", es: "Búho", en: "Owl", photos: [4] },
    { id: "piece-09-coyote", es: "Coyote", en: "Coyote", photos: [5] },
  ],
  "piece-10": [
    { id: "piece-10", es: "Matatena blanca", en: "White Jack", photos: [1, 2] },
    { id: "piece-10-black-jack", es: "Matatena negra y dorada", en: "Black and Gold Jack", photos: [4, 3] },
    { id: "piece-10-pear", es: "Pera", en: "Pear", photos: [6, 5] },
    { id: "piece-10-sailboat", es: "Velero", en: "Sailboat", photos: [7, 8] },
    { id: "piece-10-apple", es: "Manzana roja", en: "Red Apple", photos: [9] },
  ],
  "piece-24": [
    { id: "piece-24", es: "Bronce oscuro calado", en: "Dark Openwork Bronze", photos: [1, 2, 3, 4] },
    { id: "piece-24-patina", es: "Pátina verde", en: "Green Patina", photos: [5] },
    { id: "piece-24-painted", es: "Acabado pintado", en: "Painted Finish", photos: [7, 6] },
  ],
};

export const RESIN_COLORS = {
  bear: ["red", "pink", "yellow", "green", "baby-blue", "cobalt-blue", "black", "white"],
  lifesaver: ["green", "red", "pink", "yellow", "cobalt-blue", "black", "white"],
  lollipop: ["pink", "purple", "cobalt-blue", "orange", "white", "silver", "black", "gold"],
};
const photo = (name: string) => `/images/catalog/${name}.webp`;

export function applyProductUpdates<T extends Piece>(pieces: T[]): T[] {
  const multicolor = pieces.find(piece => piece.id === "bear-multicolor");
  return pieces.filter(piece => piece.id !== "bear-multicolor").flatMap(piece => {
    const variants = PRODUCT_SPLITS[piece.id];
    if (variants) return variants.map(variant => {
      const result = { ...structuredClone(piece), id: variant.id,
        name: `${piece.name} — ${variant.es}`, nameEn: `${piece.nameEn ?? piece.name} — ${variant.en}`,
        images: variant.photos.map(n => photo(`${piece.id}-${String(n).padStart(2, "0")}`)),
        description: [
          `${piece.description?.[0] ?? ""}\n\nVariante: ${variant.es}.`,
          `${piece.description?.[1] ?? ""}\n\nVariant: ${variant.en}.`,
        ] as [string, string],
      };
      if (variant.id !== piece.id) { delete result.model; result.availability = "on-request"; }
      return result;
    });
    const next = structuredClone(piece);
    if (next.designer === "Bord de l’Eau") {
      next.name = next.name.replace(/^Bord de l[’']Eau\s+/i, "");
      next.nameEn = next.nameEn?.replace(/^Bord de l[’']Eau\s+/i, "");
    }
    if (next.id === "piece-27") {
      next.images = [...new Set([
        photo("piece-27-smoky"), ...(multicolor?.images ?? [photo("bear-multicolor-01")]),
        ...RESIN_COLORS.bear.map(color => photo(`piece-27-color-${color}`)),
        photo("piece-27-colors-en"), ...(next.images ?? []),
      ])];
      next.description = [
        "Un ícono lúdico reinterpretado como acento escultórico de resina translúcida y acabado brillante. Colores de la carta: rojo, rosa, amarillo, verde, azul claro, azul cobalto, negro y blanco. También se muestran las versiones ahumada y multicolor. Disponibilidad y medidas de cada acabado por confirmar.",
        "A playful icon reimagined as a glossy, translucent resin accent. Palette colors: red, pink, yellow, green, baby blue, cobalt blue, black and white. Smoky and multicolored versions are also pictured. Availability and dimensions for each finish are confirmed on request.",
      ];
    }
    if (next.id === "piece-28") {
      next.images = [...new Set([
        ...RESIN_COLORS.lifesaver.map(color => photo(`piece-28-color-${color}`)),
        photo("piece-28-colors-en"), photo("piece-28-colors-photo"), photo("piece-28-scale-photo"), ...(next.images ?? []),
      ])];
      next.description = [
        "Homenaje lúdico a un dulce clásico, realizado en resina cristal translúcida con acabado brillante. Su formato sobredimensionado y sus letras evocan un objeto nostálgico. Colores: rojo, rosa, amarillo, verde, azul cobalto, negro y blanco. Disponibilidad por confirmar.",
        "A playful tribute to a beloved candy icon, cast in crystal resin with a glossy finish. Its oversized form and nostalgic lettering bring a distinctive accent to a curated display. Colors: red, pink, yellow, green, cobalt blue, black and white. Availability is confirmed on request.",
      ];
    }
    if (next.id === "piece-29") {
      next.images = [...new Set([...(next.images ?? []),
        ...RESIN_COLORS.lollipop.map(color => photo(`piece-29-color-${color}`)), photo("piece-29-colors-photo"),
      ])];
      next.description = [
        "Escultura inspirada en una paleta, con cuerpo de resina, base de silueta derretida y un delgado tallo. Acabados de la referencia: rojo, rosa, morado, azul cobalto, verde, naranja, blanco, plateado, negro y dorado. Disponibilidad por confirmar.",
        "A lollipop-inspired resin sculpture with a melting-shaped base and slender stem. Reference finishes: red, pink, purple, cobalt blue, green, orange, white, silver, black and gold. Availability is confirmed on request.",
      ];
    }
    return [next];
  });
}
