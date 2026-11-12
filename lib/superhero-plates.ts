import type { ManagedPiece } from "./cms-types";
import type { Piece } from "./site-data";

const photo = (name: string) => `/images/catalog/${name}.webp`;
const framedDimensions = "Print only: 75 × 53.5 cm; framed art: 82 × 61 cm";

function portrait(id: string, character: string, description: [string, string]): ManagedPiece {
  return {
    id, name: "Super Hero Collection", nameEn: "Super Hero Collection",
    cat: "arte", designer: "", origin: "San Miguel de Allende, México",
    mat: ["Impresión enmarcada", "Framed print"], dim: framedDimensions,
    description, images: [photo(`superhero-${character.toLowerCase().replaceAll(" ", "-")}${id === "superhero-hulk" ? "" : "-studio-v3"}`)],
    published: true, availability: "on-request",
  };
}

export const SUPERHERO_PORTRAITS: ManagedPiece[] = [
  {
    id: "piece-18", name: "Super Hero Collection", nameEn: "Super Hero Collection",
    cat: "arte", designer: "Carlos Gunter", origin: "San Miguel de Allende, México",
    mat: ["Impresión digital", "Digital print"], dim: "101.6 × 152.4 cm",
    description: [
      "Un rostro de mirada firme y cabello plateado, vestido en azul y rojo, evoca la fortaleza y el paso del tiempo. Una obra de Carlos Gunter para Super Hero Collection, procedente de San Miguel de Allende, México.",
      "A silver-haired figure with a steady gaze, dressed in blue and red, evokes strength and the passage of time. A work by Carlos Gunter for Super Hero Collection, from San Miguel de Allende, Mexico.",
    ], images: [photo("superhero-superman-elder")], published: true, availability: "on-request",
  },
  portrait("superhero-wonder-woman", "Wonder Woman", [
    "Un retrato femenino de porte sereno, con vestido de época y detalles dorados, evoca elegancia, fuerza y determinación. Su marco dorado complementa la composición. Parte de Super Hero Collection, de San Miguel de Allende, México.",
    "A poised female portrait in period dress with gold-tone details evokes elegance, strength, and determination. A gold-tone frame complements the composition. Part of Super Hero Collection, from San Miguel de Allende, Mexico.",
  ]),
  portrait("superhero-batman", "Batman", [
    "Una figura sentada, de silueta oscura y gorguera clara, reúne misterio y solemnidad en un retrato de inspiración histórica. Un marco oscuro con detalles dorados realza sus tonos cálidos. Parte de Super Hero Collection, de San Miguel de Allende, México.",
    "A seated figure in a dark silhouette and pale ruff collar brings mystery and solemnity to a portrait inspired by historical painting. A dark frame with gold-tone details enhances its warm tones. Part of Super Hero Collection, from San Miguel de Allende, Mexico.",
  ]),
  portrait("superhero-hulk", "Hulk", [
    "Un retrato de presencia poderosa combina una figura sentada, una gorguera y tonos terrosos. El contraste entre la fuerza de la figura y la formalidad de su atuendo aporta un matiz inesperado a la composición. Parte de Super Hero Collection, de San Miguel de Allende, México.",
    "A commanding portrait combines a seated figure, a ruff collar, and earthy tones. The contrast between the figure’s strength and the formality of the attire brings an unexpected note to the composition. Part of Super Hero Collection, from San Miguel de Allende, Mexico.",
  ]),
  {
    ...portrait("superhero-classical-portrait", "Classical Portrait", [
      "Un retrato de mirada firme, con gorguera clara y un atuendo de inspiración histórica, evoca fortaleza y serenidad. Los tonos cálidos y el marco oscuro con detalles dorados completan la composición. Parte de Super Hero Collection, de San Miguel de Allende, México.",
      "A portrait with a steady gaze, a pale ruff collar, and attire inspired by historical dress evokes strength and composure. Warm tones and a dark frame with gold-tone details complete the composition. Part of Super Hero Collection, from San Miguel de Allende, Mexico.",
    ]),
    dim: "No especificadas", images: [photo("superhero-portrait-studio-v3")],
  },
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
