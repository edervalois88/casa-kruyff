import type { Piece } from "./site-data";

export function updateSandraNecklaces<T extends Piece>(pieces: T[]): T[] {
  const ids = new Set(["accessory-14", "accessory-15"]);
  const updated = pieces.map(piece => ids.has(piece.id) ? { ...piece,
    designer: "Sandra Roldán", origin: "Antioquia, Colombia",
    mat: ["Hilo de coser, cristales y filigrana", "Sewing thread, crystals, and filigree"] as [string, string],
    description: [
      "Collar de Sandra Roldán elaborado con hilo de coser, cristales y filigrana. Técnica: tejido a base de nudos, bordado artesanal y filigrana. Hecho por mujeres artesanas mayores de Antioquia, Colombia.",
      "A necklace by Sandra Roldán made with sewing thread, crystals, and filigree. Technique: knot-based weaving, handcrafted embroidery, and filigree. Made by older women artisans from Antioquia, Colombia.",
    ] as [string, string],
  } : piece);
  return [...updated.filter(piece => !ids.has(piece.id)), ...updated.filter(piece => ids.has(piece.id))];
}
