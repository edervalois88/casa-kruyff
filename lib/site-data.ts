// Content and data extracted from the Casa Kruyff design (Casa Kruyff Sitio.dc.html).

export type Lang = "es" | "en";

function unsplash(id: string, name: string, handle: string) {
  return {
    src: `https://images.unsplash.com/photo-${id}?w=1600&q=70&auto=format&fit=crop`,
    credit: `Photo by ${name} on Unsplash`,
    href: `https://unsplash.com/@${handle}`,
  };
}

export const IMG: Record<string, { src: string; credit: string; href: string }> = {
  sala: unsplash("1618221195710-dd6b41faaea6", "Spacejoy", "spacejoy"),
  comedor: unsplash("1690489965043-ec15758cce71", "Francesco Liotti", "francesco_liotti"),
  recamara: unsplash("1616594039964-ae9021a400a0", "Spacejoy", "spacejoy"),
  estudio: unsplash("1598928506311-c55ded91a20c", "Lotus Design N Print", "lotusdnp"),
  p1: unsplash("1564078516393-cf04bd966897", "Roberto Nickson", "rpnickson"),
  p2: unsplash("1667312939978-64cf31718a6e", "Karolina Grabowska", "kaboompics"),
  p3: unsplash("1616046229478-9901c5536a45", "Spacejoy", "spacejoy"),
  p4: unsplash("1572048572872-2394404cf1f3", "Angela Bailey", "angelabaileyy"),
  p5: unsplash("1731336478850-6bce7235e320", "Antonio Araujo", "antonioaaaraujo"),
  p6: unsplash("1554995207-c18c203602cb", "Kara Eads", "karaeads"),
  p7: unsplash("1628152371231-936cf45eb8f3", "Toa Heftiba", "heftiba"),
  p8: unsplash("1617098900591-3f90928e8c54", "Spacejoy", "spacejoy"),
  p9: unsplash("1582131503261-fca1d1c0589f", "Linh Le", "linhlee"),
  j1: unsplash("1583847268964-b28dc8f51f92", "Minh Pham", "minhphamdesign"),
  j2: unsplash("1616594092403-fb65629b0a46", "Spacejoy", "spacejoy"),
  j3: unsplash("1613545325278-f24b0cae1224", "Zac Gudakov", "zacgudakov"),
  j4: unsplash("1757344454333-cc666252e596", "POOJAN THANEKAR", "poojanclicks"),
  a1: unsplash("1512918728675-ed5a9ecdebfd", "Frames For Your Heart", "framesforyourheart"),
  a2: unsplash("1690489965043-ec15758cce71", "Francesco Liotti", "francesco_liotti"),
  a3: unsplash("1505693416388-ac5ce068fe85", "Quilia", "heyquilia"),
};

export const HERO_A = unsplash("1615874694520-474822394e73", "Spacejoy", "spacejoy");
export const HERO_INTERIOR = unsplash("1600210491892-03d54c0aaf87", "Collov Home Design", "collovhome");
export const HERO_B = unsplash("1616047006789-b7af5afb8c20", "Spacejoy", "spacejoy");
export const HERO_B_CAT = unsplash("1572048572872-2394404cf1f3", "Angela Bailey", "angelabaileyy");
export const HERO_INT = unsplash("1615873968403-89e068629265", "Spacejoy", "spacejoy");
export const HERO_CASA = unsplash("1599696848652-f0ff23bc911f", "aranprime", "aranprime");
export const HERO_JOURNAL = unsplash("1693578616322-c8abe6c7393d", "Sherzod Gulomov", "s_g_arch");
export const HERO_CONTACTO = unsplash("1699239116624-85268dce7377", "Le Quan", "mrkheu");

export const CATS: [string, string, string][] = [
  ["mob", "Mobiliario", "Furniture"],
  ["ilu", "Iluminación", "Lighting"],
  ["arte", "Arte", "Art"],
  ["obj", "Objetos", "Objects"],
  ["tex", "Textiles", "Textiles"],
];

export interface Piece {
  id: string;
  name: string;
  cat: string;
  designer: string;
  origin: string;
  mat: [string, string];
  dim: string;
}

export const PIECES: Piece[] = [
  { id: "p1", name: "Sofá Aurelia", cat: "mob", designer: "Atelier Veronne", origin: "Francia", mat: ["Nogal macizo, bouclé de lana", "Solid walnut, wool bouclé"], dim: "320 × 210 × 72 cm" },
  { id: "p2", name: "Lámpara Solenne", cat: "ilu", designer: "Studio Ferrante", origin: "Italia", mat: ["Latón envejecido, vidrio soplado", "Aged brass, blown glass"], dim: "Ø 42 × 60 cm" },
  { id: "p3", name: "Mesa Halden", cat: "mob", designer: "Mørk & Co.", origin: "Dinamarca", mat: ["Roble ahumado", "Smoked oak"], dim: "240 × 100 × 75 cm" },
  { id: "p4", name: "Vasija Tierra I", cat: "obj", designer: "Taller Ocre", origin: "México", mat: ["Barro bruñido", "Burnished clay"], dim: "Ø 34 × 48 cm" },
  { id: "p5", name: "Tapete Liria", cat: "tex", designer: "Casa Anatolia", origin: "Turquía", mat: ["Lana y seda anudadas a mano", "Hand-knotted wool and silk"], dim: "300 × 400 cm" },
  { id: "p6", name: "Estudio en ocre", cat: "arte", designer: "Obra de autor", origin: "España", mat: ["Óleo sobre lino", "Oil on linen"], dim: "120 × 150 cm" },
  { id: "p7", name: "Consola Marais", cat: "mob", designer: "Atelier Veronne", origin: "Francia", mat: ["Travertino, latón", "Travertine, brass"], dim: "160 × 40 × 82 cm" },
  { id: "p8", name: "Aplique Duna", cat: "ilu", designer: "Studio Ferrante", origin: "Italia", mat: ["Alabastro", "Alabaster"], dim: "22 × 12 × 36 cm" },
  { id: "p9", name: "Cuenco Basalto", cat: "obj", designer: "Taller Ocre", origin: "México", mat: ["Piedra volcánica", "Volcanic stone"], dim: "Ø 40 × 14 cm" },
];

export const ROOMS: [string, string, string][] = [
  ["sala", "La Sala", "The Living Room"],
  ["comedor", "El Comedor", "The Dining Room"],
  ["recamara", "La Recámara", "The Bedroom"],
  ["estudio", "El Estudio", "The Study"],
];

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
  { id: "d1", name: "Atelier Veronne", origin: "Francia", disc: ["Mobiliario", "Furniture"] },
  { id: "d2", name: "Studio Ferrante", origin: "Italia", disc: ["Iluminación", "Lighting"] },
  { id: "d3", name: "Mørk & Co.", origin: "Dinamarca", disc: ["Mobiliario en madera", "Wood furniture"] },
  { id: "d4", name: "Taller Ocre", origin: "México", disc: ["Cerámica y piedra", "Ceramics and stone"] },
  { id: "d5", name: "Casa Anatolia", origin: "Turquía", disc: ["Textiles anudados a mano", "Hand-knotted textiles"] },
];

export function langIndex(lang: Lang) {
  return lang === "es" ? 0 : 1;
}

export function catName(lang: Lang, id: string, allLabel: string) {
  const c = CATS.find((c) => c[0] === id);
  return c ? c[langIndex(lang) + 1] : allLabel;
}
