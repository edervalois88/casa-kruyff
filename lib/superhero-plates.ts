import type { ManagedPiece } from "./cms-types";
import type { Piece } from "./site-data";

const photo = (name: string) => `/images/catalog/${name}.webp`;
const framedDimensions = "Print only: 75 × 53.5 cm; framed art: 82 × 61 cm";

function portrait(id: string, character: string, description: [string, string]): ManagedPiece {
  return {
    id, name: `Super Hero Collection — ${character}`, nameEn: `Super Hero Collection — ${character}`,
    cat: "arte", designer: "", origin: "San Miguel de Allende, México",
    mat: ["Impresión enmarcada", "Framed print"], dim: framedDimensions,
    description, images: [photo(`superhero-${character.toLowerCase().replaceAll(" ", "-")}`)],
    published: true, availability: "on-request",
  };
}

export const SUPERHERO_PORTRAITS: ManagedPiece[] = [
  {
    id: "piece-18", name: "Super Hero Collection — Superman abuelo", nameEn: "Super Hero Collection — Elder Superman",
    cat: "arte", designer: "Carlos Gunter", origin: "San Miguel de Allende, México",
    mat: ["Impresión digital", "Digital print"], dim: "101.6 × 152.4 cm",
    description: [
      "Retrato de un Superman de edad avanzada, con traje azul y capa roja, de Carlos Gunter. Forma parte de Super Hero Collection y procede de San Miguel de Allende, México.",
      "A portrait of an older Superman in a blue suit and red cape by Carlos Gunter. Part of Super Hero Collection, from San Miguel de Allende, Mexico.",
    ], images: [photo("superhero-superman-elder")], published: true, availability: "on-request",
  },
  portrait("superhero-wonder-woman", "Wonder Woman", [
    "Wonder Woman reinterpretada en un retrato de inspiración clásica, con vestido largo y marco dorado. Parte de Super Hero Collection, de San Miguel de Allende, México.",
    "Wonder Woman reimagined in a portrait inspired by classical painting, with a flowing gown and gold-tone frame. Part of Super Hero Collection, from San Miguel de Allende, Mexico.",
  ]),
  portrait("superhero-batman", "Batman", [
    "Batman aparece sentado con una gorguera y un traje de inspiración histórica, en un marco oscuro con detalles dorados. Parte de Super Hero Collection, de San Miguel de Allende, México.",
    "Batman appears seated in a ruff collar and a costume inspired by historical portraiture, within a dark frame with gold-tone details. Part of Super Hero Collection, from San Miguel de Allende, Mexico.",
  ]),
  portrait("superhero-hulk", "Hulk", [
    "Hulk reinterpretado en un retrato sentado de tonos cálidos, con gorguera y marco oscuro de detalles dorados. Parte de Super Hero Collection, de San Miguel de Allende, México.",
    "Hulk reimagined in a seated portrait in warm tones, with a ruff collar and a dark frame with gold-tone details. Part of Super Hero Collection, from San Miguel de Allende, Mexico.",
  ]),
];

function plate(id: string, name: string, description: [string, string], images: string[]): ManagedPiece {
  return { id, name, nameEn: name, cat: "cer", designer: "Caroline Rovithi", origin: "Grecia",
    mat: ["Cerámica pintada a mano", "Hand-painted ceramic"], dim: "No especificadas",
    description, images: images.map(photo), published: true, availability: "on-request" };
}

export const ROVITHI_PLATES: ManagedPiece[] = [
  plate("rovithi-texas-plate", "Greek Spirit, Texas Soul", [
    "Plato de cerámica único pintado a mano por Caroline Rovithi que une la tradición griega con el carácter de Texas. Un longhorn, rodeado de franjas azules y blancas, un ojo protector y una pequeña campana, rinde homenaje a ambos lugares y sus identidades. Creado exclusivamente para Casa Kruyff. Pieza única.",
    "Hand-painted by Caroline Rovithi, this one-of-a-kind ceramic plate brings Greek tradition and Texas character together. A spirited longhorn, framed by blue and white stripes, an evil eye, and a small bell, makes this piece a joyful tribute to two places and their distinct identities. Handcrafted exclusively for Casa Kruyff. One of one.",
  ], ["plate-texas-studio", "plate-texas-detail", "plate-texas-reference"]),
  plate("rovithi-solemates-plate", "Solemates: Different Paths, Common Ground", [
    "Plato único pintado a mano por Caroline Rovithi que combina una bota vaquera con un tsarouchi rojo bajo un sol compartido. Sus tonos azules y marfil celebran la individualidad y la conexión. Creado exclusivamente para Casa Kruyff. Pieza única.",
    "Hand-painted by Caroline Rovithi, this one-of-a-kind plate pairs a classic cowboy boot with a bold red tsarouchi beneath a shared radiant sun. Its vivid blue and ivory design celebrates individuality and connection. Handcrafted exclusively for Casa Kruyff. One of one.",
  ], ["plate-solemates-studio", "plate-solemates-detail"]),
  plate("rovithi-viva-plate", "Viva la Vida: A Meeting of Mexico and Greece", [
    "Plato único pintado a mano por Caroline Rovithi que une el simbolismo del Día de Muertos de México con el ftou, ftou griego, gesto tradicional de protección. Una calavera floral se rodea de azules vibrantes y salpicaduras de color. Un homenaje a la vida, la protección y dos ricas tradiciones culturales, creado exclusivamente para Casa Kruyff. Pieza única.",
    "Hand-painted by Caroline Rovithi, this one-of-a-kind plate brings together the festive symbolism of Mexico’s Día de Muertos and Greece’s ftou, ftou, a traditional gesture for warding off misfortune. At its center, a colorful sugar skull blooms with floral details, framed by vibrant blues and playful splashes. A spirited tribute to life, protection, and two rich cultural traditions. Handcrafted exclusively for Casa Kruyff. One of one.",
  ], ["plate-viva-studio", "plate-viva-detail", "plate-viva-reference"]),
  plate("rovithi-made-to-order-plate", "Made to Order Plate", [
    "Celebra una amistad, un momento especial o una conexión significativa con un plato personalizado, pintado a mano por Caroline Rovithi. Caroline dará vida a tu idea con su estilo distintivo. Cada encargo se crea individualmente y es único. La fotografía muestra un ejemplo creado para Casa Kruyff.",
    "Celebrate a friendship, milestone, or meaningful connection with a custom plate, hand-painted by Caroline Rovithi. Caroline will bring your idea to life in her distinctive style. Each commissioned piece is individually created and one of a kind. The photograph shows an example created for Casa Kruyff.",
  ], ["plate-made-to-order-studio", "plate-made-to-order-detail", "plate-made-to-order-reference"]),
];

export const SUPERHERO_PLATE_PRODUCTS = [...SUPERHERO_PORTRAITS, ...ROVITHI_PLATES];

export function addSuperheroPlates(pieces: ManagedPiece[]): ManagedPiece[];
export function addSuperheroPlates(pieces: Piece[]): Piece[];
export function addSuperheroPlates(pieces: Piece[]): Piece[] {
  const next = structuredClone(pieces);
  for (const source of SUPERHERO_PLATE_PRODUCTS) {
    const index = next.findIndex(piece => piece.id === source.id);
    if (index < 0) {
      const necklaces = next.findIndex(piece => piece.id === "accessory-14" || piece.id === "accessory-15");
      next.splice(necklaces < 0 ? next.length : necklaces, 0, structuredClone(source));
    }
    else next[index] = { ...next[index], ...structuredClone(source), availability: next[index].availability ?? source.availability };
  }
  return next;
}
