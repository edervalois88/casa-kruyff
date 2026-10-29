import { CATALOG_PIECES } from "./catalog-products";

// Content and data extracted from the Casa Kruyff design (Casa Kruyff Sitio.dc.html).

export type Lang = "es" | "en";

export const CONTACT_PHONE = "+1 (346) 413-1203";
export const CONTACT_TEL = "tel:+13464131203";

export function whatsappLink(message: string) {
  return `https://wa.me/13464131203?text=${encodeURIComponent(message)}`;
}

function unsplash(id: string, name: string, handle: string) {
  return {
    src: `https://images.unsplash.com/photo-${id}?w=1600&q=70&auto=format&fit=crop`,
    credit: `Photo by ${name} on Unsplash`,
    href: `https://unsplash.com/@${handle}`,
  };
}

function localImage(name: string) {
  return { src: `/images/${name}.webp`, credit: "", href: "" };
}

export const IMG: Record<string, { src: string; credit: string; href: string }> = {
  esc: { src: "/images/catalog/piece-38-01.webp", credit: "", href: "" },
  cer: { src: "/images/catalog/piece-01-01.webp", credit: "", href: "" },
  arte: { src: "/images/catalog/piece-40-01.webp", credit: "", href: "" },
  pop: { src: "/images/catalog/piece-09-02.webp", credit: "", href: "" },
  acc: { src: "/images/catalog/accessory-01-01.webp", credit: "", href: "" },
  sala: unsplash("1618221195710-dd6b41faaea6", "Spacejoy", "spacejoy"),
  comedor: unsplash("1690489965043-ec15758cce71", "Francesco Liotti", "francesco_liotti"),
  recamara: unsplash("1616594039964-ae9021a400a0", "Spacejoy", "spacejoy"),
  estudio: unsplash("1598928506311-c55ded91a20c", "Lotus Design N Print", "lotusdnp"),
  j1: localImage("interior-fireplace"),
  j2: localImage("interior-dining"),
  j3: localImage("interior-study"),
  j4: localImage("interior-fireplace"),
  a1: localImage("materials"),
  a2: localImage("interior-study"),
  a3: unsplash("1505693416388-ac5ce068fe85", "Quilia", "heyquilia"),
};

export const HERO_A = localImage("hero-horse");
export const HERO_INTERIOR = localImage("interior-fireplace");
export const HERO_B = unsplash("1616047006789-b7af5afb8c20", "Spacejoy", "spacejoy");
export const HERO_B_CAT = unsplash("1572048572872-2394404cf1f3", "Angela Bailey", "angelabaileyy");
export const HERO_INT = localImage("interior-dining");
export const HERO_CASA = localImage("interior-study");
export const HERO_JOURNAL = localImage("materials");
export const HERO_CONTACTO = localImage("interior-fireplace");

export const CATS: [string, string, string][] = [
  ["esc", "Objetos decorativos", "Decorative Objects"],
  ["cer", "Cerámica y alfarería", "Ceramics & Pottery"],
  ["arte", "Arte y obra gráfica", "Art & Prints"],
  ["pop", "Artesanía y arte popular", "Folk Art & Craft"],
  ["acc", "Accesorios", "Accessories"],
  ["holiday", "The Holiday Edit", "The Holiday Edit"],
];

export interface Piece {
  id: string;
  name: string;
  cat: string;
  designer: string;
  origin: string;
  mat: [string, string];
  dim: string;
  model?: { glb: string; usdz?: string };
  nameEn?: string;
  description?: [string, string];
  images?: string[];
  published?: boolean;
  availability?: "available" | "on-request" | "sold";
}

export const PIECES: Piece[] = CATALOG_PIECES;

export const COLLECTIONS = CATS;

export interface ProjectItem {
  id: string;
  name: string;
  place: string;
  type: [string, string];
}

export const PROJECTS: ProjectItem[] = [
  { id: "j1", name: "Residencia Virreyes", place: "CDMX", type: ["Residencial", "Residential"] },
  { id: "j2", name: "Hotel boutique", place: "Valle de Bravo", type: ["Hospitalidad", "Hospitality"] },
  { id: "j3", name: "Departamento Polanco", place: "CDMX", type: ["Residencial", "Residential"] },
  { id: "j4", name: "Club privado", place: "Monterrey", type: ["Hospitalidad", "Hospitality"] },
];

export interface Designer {
  id: string;
  name: string;
  origin: string;
  disc: [string, string];
}

export const DESIGNERS: Designer[] = [
  { id: "caroline-rovithi", name: "Caroline Rovithi", origin: "No especificado", disc: ["Arte y publicaciones", "Art and publications"] },
  { id: "d1", name: "Artesanos de San José de Gracia", origin: "Michoacán, México", disc: ["Alfarería tradicional","Traditional pottery"] },
  { id: "d2", name: "Alfareros purépechas de Pambatán", origin: "Michoacán, México", disc: ["Cerámica pintada y esculpida","Painted and sculpted pottery"] },
  { id: "d3", name: "Artistas Wixárika", origin: "México", disc: ["Talla, chaquira y arte popular","Carving, chaquira, and folk art"] },
  { id: "d4", name: "Artesanos balineses", origin: "Bali, Indonesia", disc: ["Objetos tallados y fundidos","Carved and cast objects"] },
  { id: "d5", name: "Gaya Ceramic", origin: "Indonesia", disc: ["Cerámica contemporánea","Contemporary ceramics"] },
  { id: "d6", name: "Bord de l’Eau", origin: "No especificado", disc: ["Objetos decorativos Mati","Mati decorative objects"] },
  { id: "d7", name: "Galatiss Art Gallery", origin: "No especificado", disc: ["Objetos de cristal","Crystal objects"] },
  { id: "d8", name: "Carlos Gunther Maier · House Armida", origin: "No especificado", disc: ["Impresión digital","Digital prints"] },
];

export function langIndex(lang: Lang) {
  return lang === "es" ? 0 : 1;
}

export function catName(lang: Lang, id: string, allLabel: string) {
  const c = CATS.find((c) => c[0] === id);
  return c ? c[langIndex(lang) + 1] : allLabel;
}
