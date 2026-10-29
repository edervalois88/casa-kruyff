import { COPY } from "./copy";
import { CATS, CONTACT_PHONE, DESIGNERS, HERO_A, HERO_CASA, HERO_CONTACTO, HERO_INT, HERO_INTERIOR, HERO_JOURNAL, IMG, PIECES, PROJECTS } from "./site-data";
import type { SiteContent } from "./cms-types";

export function createSeedContent(): SiteContent {
  return structuredClone({
    revision: 0,
    catalogVersion: 1,
    updatedAt: new Date().toISOString(),
    pieces: PIECES.map((piece) => ({
      ...piece,
      nameEn: piece.nameEn ?? piece.name,
      description: piece.description ?? [COPY.es.pieceDesc, COPY.en.pieceDesc],
      images: piece.images?.length ? [...piece.images] : IMG[piece.id] ? [IMG[piece.id].src] : [],
      published: piece.published ?? true,
      availability: "on-request",
    })),
    cats: CATS,
    images: IMG,
    heroes: { home: HERO_A, interiorHome: HERO_INTERIOR, interior: HERO_INT, house: HERO_CASA, journal: HERO_JOURNAL, contact: HERO_CONTACTO },
    copy: COPY,
    projects: PROJECTS,
    designers: DESIGNERS,
    settings: { phone: CONTACT_PHONE, instagramUsername: "casakruyff", defaultLanguage: "en" },
  } as SiteContent);
}

export function withCopyDefaults(document: SiteContent): SiteContent {
  return {
    ...document,
    copy: {
      es: { ...COPY.es, ...document.copy.es },
      en: { ...COPY.en, ...document.copy.en },
    },
  };
}
