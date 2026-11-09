import type { ManagedPiece } from "./cms-types";
import type { Piece } from "./site-data";

const photo = (name: string) => `/images/catalog/${name}.webp`;

const RING: ManagedPiece = {
  id: "gaya-porcelain-ring",
  name: "Anillo de porcelana con detalles dorados",
  nameEn: "Porcelain Ring with Gold-Tone Accents",
  cat: "acc",
  designer: "Gaya Ceramic",
  origin: "Indonesia",
  mat: ["Porcelana con detalles dorados", "Porcelain with gold-tone accents"],
  dim: "No especificadas",
  description: [
    "Anillo de porcelana de forma escultórica, con detalles dorados y un centro de tono ámbar.",
    "A sculptural porcelain ring with gold-tone accents and an amber-colored center.",
  ],
  images: [photo("gaya-porcelain-ring-01")],
  published: true,
  availability: "on-request",
};

export function refineCatalog(pieces: ManagedPiece[]): ManagedPiece[];
export function refineCatalog(pieces: Piece[]): Piece[];
export function refineCatalog(pieces: Piece[]): Piece[] {
  const refined = pieces.map(piece => {
    if (piece.id === "rovithi-avgolemono-framed") return { ...piece, name: "Liquid Gold", nameEn: "Liquid Gold" };
    const additions = piece.id === "piece-08"
      ? [photo("piece-08-studio-color"), photo("piece-08-color-reference")]
      : piece.id === "cynthia-padilla-frida"
        ? [photo("cynthia-padilla-frida-detail-left"), photo("cynthia-padilla-frida-detail-right")]
        : [];
    if (!additions.length) return piece;
    const images = piece.images ?? [];
    const ordered = piece.id === "piece-08" ? [...additions, ...images] : [...images.slice(0, 1), ...additions, ...images.slice(1)];
    return { ...piece, images: [...new Set(ordered)] };
  });
  if (!refined.some(piece => piece.id === RING.id)) refined.push(structuredClone(RING));
  return refined;
}
