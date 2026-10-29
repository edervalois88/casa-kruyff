import type { SiteContent, ManagedPiece } from "./cms-types";
import { CATALOG_ADDITIONS, CATALOG_NEW_PHOTOS } from "./catalog-additions";
import { applyProductUpdates } from "./catalog-variants";

export const CATALOG_VERSION = 2;

// A version marker lets subsequent CMS deletions and edits remain intentional.
function applyFirstRelease(document: SiteContent): SiteContent {
  if ((document.catalogVersion ?? 0) >= 1) return document;
  const next = structuredClone(document);
  const existingIds = new Set(next.pieces.map(piece => piece.id));
  for (const piece of CATALOG_ADDITIONS) {
    if (!existingIds.has(piece.id)) next.pieces.push({ ...structuredClone(piece),
      nameEn: piece.nameEn ?? piece.name, description: piece.description ?? ["", ""],
      images: piece.images ?? [], published: true, availability: "on-request",
    } as ManagedPiece);
  }
  for (const piece of next.pieces) {
    if (piece.id === "piece-23") piece.images = piece.images.filter(src => src !== "/images/catalog/piece-23-02.webp");
    const photos = CATALOG_NEW_PHOTOS[piece.id];
    if (!photos) continue;
    const wasMissingPhotographs = !piece.images.length;
    const onlyOriginalPhotos = piece.images.every(src => src.startsWith(`/images/catalog/${piece.id}-`));
    piece.images = [...new Set(onlyOriginalPhotos ? [...photos, ...piece.images] : [...piece.images, ...photos])];
    if (wasMissingPhotographs) piece.published = true;
  }
  for (const cat of [["acc", "Accesorios", "Accessories"], ["holiday", "The Holiday Edit", "The Holiday Edit"]] as [string, string, string][]) {
    if (!next.cats.some(current => current[0] === cat[0])) next.cats.push(cat);
  }
  next.images.acc ??= { src: "/images/catalog/accessory-01-01.webp", credit: "", href: "" };
  if (!next.designers.some(designer => designer.name === "Caroline Rovithi")) {
    next.designers.push({ id: "caroline-rovithi", name: "Caroline Rovithi", origin: "No especificado", disc: ["Arte y publicaciones", "Art and publications"] });
  }
  next.catalogVersion = 1;
  return next;
}

export function applyCatalogRelease(document: SiteContent): SiteContent {
  if ((document.catalogVersion ?? 0) >= CATALOG_VERSION) return document;
  const next = structuredClone(applyFirstRelease(document));
  next.pieces = applyProductUpdates(next.pieces);
  delete next.images["bear-multicolor"];
  next.catalogVersion = CATALOG_VERSION;
  return next;
}
