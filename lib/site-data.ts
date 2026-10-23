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
  esc: localImage("sculpture"),
  cer: localImage("ceramics"),
  arte: localImage("art"),
  acc: localImage("accessories"),
  sala: unsplash("1618221195710-dd6b41faaea6", "Spacejoy", "spacejoy"),
  comedor: unsplash("1690489965043-ec15758cce71", "Francesco Liotti", "francesco_liotti"),
  recamara: unsplash("1616594039964-ae9021a400a0", "Spacejoy", "spacejoy"),
  estudio: unsplash("1598928506311-c55ded91a20c", "Lotus Design N Print", "lotusdnp"),
  p1: localImage("hero-horse"),
  p2: unsplash("1667312939978-64cf31718a6e", "Karolina Grabowska", "kaboompics"),
  p3: unsplash("1616046229478-9901c5536a45", "Spacejoy", "spacejoy"),
  p4: unsplash("1572048572872-2394404cf1f3", "Angela Bailey", "angelabaileyy"),
  p5: localImage("art"),
  p6: unsplash("1554995207-c18c203602cb", "Kara Eads", "karaeads"),
  p7: localImage("accessories"),
  p8: unsplash("1617098900591-3f90928e8c54", "Spacejoy", "spacejoy"),
  p9: unsplash("1582131503261-fca1d1c0589f", "Linh Le", "linhlee"),
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

export const CATS: [string, string, string][] = [['esc','Escultura y objetos decorativos','Sculpture & Decorative Objects'],['cer','Cerámica y platos','Ceramics & Plates'],['arte','Arte y grabados','Art & Prints'],['acc','Accesorios y arte para portar','Accessories & Wearable Art']];

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

export const PIECES: Piece[] = [
  {id:'p1',name:'Caballo Tang',cat:'esc',designer:'Atelier Veronne',origin:'China',mat:['Bronce calado y patinado, base de acero','Pierced patinated bronze, steel stand'],dim:'62 × 18 × 70 cm'},
  {id:'p2',name:'Esfera Carrara',cat:'esc',designer:'Studio Ferrante',origin:'Italia',mat:['Mármol tallado a mano','Hand-carved marble'],dim:'Ø 24 cm'},
  {id:'p3',name:'Vasija Tierra I',cat:'cer',designer:'Taller Ocre',origin:'México',mat:['Barro bruñido','Burnished clay'],dim:'Ø 34 × 48 cm'},
  {id:'p4',name:'Plato Basalto',cat:'cer',designer:'Taller Ocre',origin:'México',mat:['Gres esmaltado','Glazed stoneware'],dim:'Ø 32 cm'},
  {id:'p5',name:'Estudio en ocre',cat:'arte',designer:'Obra de autor',origin:'España',mat:['Óleo sobre lino','Oil on linen'],dim:'120 × 150 cm'},
  {id:'p6',name:'Nocturno III',cat:'arte',designer:'Mørk & Co.',origin:'Japón',mat:['Grabado sobre papel washi','Print on washi paper'],dim:'60 × 80 cm'},
  {id:'p7',name:'Collar Ámbar',cat:'acc',designer:'Casa Anatolia',origin:'Marruecos',mat:['Ámbar y plata','Amber and silver'],dim:'48 cm'},
  {id:'p8',name:'Cuenco Obsidiana',cat:'cer',designer:'Taller Ocre',origin:'México',mat:['Cerámica ahumada','Smoke-fired ceramic'],dim:'Ø 28 × 12 cm'},
  {id:'p9',name:'Chal Anatolia',cat:'acc',designer:'Casa Anatolia',origin:'Turquía',mat:['Seda tejida a mano','Hand-woven silk'],dim:'70 × 200 cm'}
];

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
  { id: "d1", name: "Atelier Veronne", origin: "Francia", disc: ["Escultura en bronce","Bronze sculpture"] },
  { id: "d2", name: "Studio Ferrante", origin: "Italia", disc: ["Piedra y mármol","Stone and marble"] },
  { id: "d3", name: "Mørk & Co.", origin: "Dinamarca", disc: ["Grabado y obra gráfica","Printmaking"] },
  { id: "d4", name: "Taller Ocre", origin: "México", disc: ["Cerámica y piedra","Ceramics and stone"] },
  { id: "d5", name: "Casa Anatolia", origin: "Turquía", disc: ["Joyería y textiles","Jewelry and textiles"] },
];

export function langIndex(lang: Lang) {
  return lang === "es" ? 0 : 1;
}

export function catName(lang: Lang, id: string, allLabel: string) {
  const c = CATS.find((c) => c[0] === id);
  return c ? c[langIndex(lang) + 1] : allLabel;
}
