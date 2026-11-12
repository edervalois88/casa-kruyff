import type { Piece } from "./site-data";

type BagDetails = Pick<Piece, "name" | "nameEn" | "mat" | "dim" | "description">;
export const REMAINING_ORRA_BAGS: Record<string, BagDetails> = {
  "accessory-06": {
    name: "Marigold Leather Bag", nameEn: "Marigold Leather Bag",
    mat: ["Piel; forro de algodón", "Leather; cotton lining"], dim: "H 21 × W 35 × D 14 cm; handle drop 16 cm; strap drop 145 cm",
    description: ["Bolso de piel con asas circulares y panel central negro. Para llevar en la mano o cruzado, con cierre superior de cremallera, correa de piel ajustable y desmontable, bolsillo interior de cremallera y forro de algodón.", "A leather bag with circular handles and a black central panel. Designed for hand or crossbody carrying, with a top zip closure, removable adjustable leather shoulder strap, internal zip pocket and cotton lining."],
  },
  "accessory-03": {
    name: "Antonia Leather Bag — Black", nameEn: "Antonia Leather Bag — Black",
    mat: ["Piel negra lisa; forro de algodón", "Smooth black leather; cotton lining"], dim: "H 21 × W 35 × D 14 cm; handle drop 16 cm; strap drop 145 cm",
    description: ["Bolso Antonia de piel negra lisa con silueta geométrica compacta y asas triangulares. Asa superior de piel, cierre superior de cremallera, correa de piel ajustable y desmontable para llevar cruzado, bolsillo interior de cremallera y forro de algodón.", "The Antonia handbag in smooth black leather, with a compact geometric silhouette and triangular handles. Features a leather top handle, top zip closure, removable adjustable leather crossbody strap, internal zip pocket and cotton lining."],
  },
  "accessory-09": {
    name: "Market Raffia Croco Suede Bag", nameEn: "Market Raffia Croco Suede Bag",
    mat: ["Rafia y ante con textura croco; forro de algodón", "Raffia and croco-textured suede; cotton lining"], dim: "H 35 × W 35 × D 4 cm",
    description: ["Clutch artesanal de rafia y ante con textura croco y solapa plegable. Cierre magnético superior, bolsillo interior de cremallera y forro de algodón.", "A handcrafted fold-over raffia and croco suede clutch with a top magnetic clasp, internal zip pocket and cotton lining."],
  },
  "accessory-07": {
    name: "Market Croco Suede Bag", nameEn: "Market Croco Suede Bag",
    mat: ["Ante con textura croco; forro de algodón", "Croco-textured suede; cotton lining"], dim: "H 35 × W 35 × D 4 cm",
    description: ["Clutch artesanal de ante con textura croco y solapa plegable. Cierre magnético superior, bolsillo interior de cremallera y forro de algodón.", "A handcrafted fold-over croco suede clutch with a top magnetic clasp, internal zip pocket and cotton lining."],
  },
  "accessory-04": {
    name: "Anastasia Raffia Bag", nameEn: "Anastasia Raffia Bag",
    mat: ["Rafia y piel de becerro; forro de algodón", "Raffia and calf leather; cotton lining"], dim: "H 21 × W 35 × D 14 cm; handle drop 18 cm; strap drop 145 cm",
    description: ["Bolso artesanal mini de rafia tipo zempili con detalles y asa superior de piel. Correa de piel ajustable y desmontable para llevar cruzado, cierre superior de cremallera, bolsillo interior de cremallera y forro de algodón.", "A handcrafted mini zempili-style raffia handbag with calf leather details and a leather top handle. Features a removable, adjustable leather crossbody strap, top zip closure, internal zip pocket and cotton lining."],
  },
  "accessory-18": {
    name: "Ananeosi Raffia Bag", nameEn: "Ananeosi Raffia Bag",
    mat: ["Rafia y piel de becerro; forro de algodón", "Raffia and calf leather; cotton lining"], dim: "H 39 × W 59 × D 19.5 cm; handle drop 21 cm; strap drop 90 cm",
    description: ["Bolso artesanal de rafia tipo zempili con detalles de piel de becerro y asas circulares de piel. Cierre metálico superior, correa interior integrada de piel para el hombro, bolsa interior desmontable de piel de cordero con cordón y forro de algodón.", "A handcrafted zempili-style raffia bag with calf leather details and circular leather handles. Features a top metal clasp, integrated internal leather shoulder strap, detachable lamb leather drawstring pouch and cotton lining."],
  },
};

export function updateRemainingOrraBags<T extends Piece>(pieces: T[]): T[] {
  return pieces.map(piece => REMAINING_ORRA_BAGS[piece.id] ? { ...piece, ...structuredClone(REMAINING_ORRA_BAGS[piece.id]), designer: "ORRA", origin: "Grecia" } : piece);
}
