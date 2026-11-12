import { updateRemainingOrraBags } from "./remaining-orra-bags";
import { updateSandraNecklaces } from "./sandra-necklaces";
import { HOLIDAY_PRODUCTS } from "./holiday-products";
import { separateMulticolorBear, positionMulticolorBear } from "./catalog-presentation-update";
import { DECORATIVE_TURTLE } from "./decorative-turtle";
import type { SiteContent, ManagedPiece } from "./cms-types";
import { CATALOG_ADDITIONS, CATALOG_NEW_PHOTOS } from "./catalog-additions";
import { applyProductUpdates } from "./catalog-variants";
import { artistOrigin, RANIA_DIAKOU } from "./artist-origins";
import { CYNTHIA_PADILLA, CYNTHIA_PRINT } from "./cynthia-padilla";

import { refineCatalog } from "./catalog-refinements";

export const CATALOG_VERSION = 14;

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
  if ((next.catalogVersion ?? 0) < 2) {
    next.pieces = applyProductUpdates(next.pieces);
    delete next.images["bear-multicolor"];
  }
  if ((next.catalogVersion ?? 0) < 3) {
    next.pieces = next.pieces.map(piece => ({ ...piece, origin: artistOrigin(piece.designer) ?? piece.origin }));
    next.designers = next.designers.map(designer => ({ ...designer, origin: artistOrigin(designer.name) ?? designer.origin }));
    if (!next.designers.some(designer => designer.name === "Sandra Roldán")) {
      next.designers.push({ id: "sandra-roldan", name: "Sandra Roldán", origin: "Colombia", disc: ["Artista", "Artist"] });
    }
  }
  if ((next.catalogVersion ?? 0) < 4 && !next.pieces.some(piece => piece.id === CYNTHIA_PRINT.id)) next.pieces.push(structuredClone(CYNTHIA_PRINT));
  if ((next.catalogVersion ?? 0) < 4 && !next.designers.some(designer => designer.id === CYNTHIA_PADILLA.id || designer.name === CYNTHIA_PADILLA.name)) next.designers.push(structuredClone(CYNTHIA_PADILLA));
  if ((next.catalogVersion ?? 0) < 5) next.pieces = refineCatalog(next.pieces);
  if ((next.catalogVersion ?? 0) < 6 && !next.designers.some(designer => designer.id === RANIA_DIAKOU.id || designer.name === RANIA_DIAKOU.name)) next.designers.push(structuredClone(RANIA_DIAKOU));
  if ((next.catalogVersion ?? 0) < 7 && !next.pieces.some(piece => piece.id === DECORATIVE_TURTLE.id)) next.pieces.push(structuredClone(DECORATIVE_TURTLE));
  if ((next.catalogVersion ?? 0) < 8) {
    const turtle = next.pieces.find(piece => piece.id === DECORATIVE_TURTLE.id);
    if (turtle) turtle.published = false;
  }
  if ((next.catalogVersion ?? 0) < 9) {
    // Preserve CMS photos, availability and publication state while updating confirmed bag data.
    const bags = new Map(CATALOG_ADDITIONS.filter(piece => piece.designer === "ORRA").map(piece => [piece.id, piece]));
    next.pieces = next.pieces.map(piece => {
      const bag = bags.get(piece.id);
      if (!bag) return piece;
      return { ...piece, name: bag.name, nameEn: bag.nameEn ?? bag.name,
        designer: bag.designer, origin: bag.origin, mat: bag.mat, dim: bag.dim,
        description: bag.description ?? ["", ""] };
    });
  }
  if ((next.catalogVersion ?? 0) < 10) next.pieces = separateMulticolorBear(next.pieces);
  if ((next.catalogVersion ?? 0) < 11) {
    for (const piece of HOLIDAY_PRODUCTS) {
      if (!next.pieces.some(existing => existing.id === piece.id)) next.pieces.push(structuredClone(piece));
    }
    next.pieces = updateSandraNecklaces(next.pieces);
    next.images.holiday ??= { src: HOLIDAY_PRODUCTS[0].images[0], credit: "", href: "" };
  }
  if ((next.catalogVersion ?? 0) < 12) next.pieces = updateRemainingOrraBags(next.pieces);
  if ((next.catalogVersion ?? 0) < 13) {
    next.pieces = next.pieces.map(piece => ["accessory-03", "accessory-06"].includes(piece.id) ? updateRemainingOrraBags([piece])[0] : piece);
    next.pieces = positionMulticolorBear(next.pieces);
  }
  if ((next.catalogVersion ?? 0) < 14) {
    const retired = new Set(["holiday-nutcracker-red", "holiday-nutcracker-ivory", "holiday-nutcracker-metallic-red"]);
    next.pieces = next.pieces.filter(piece => !retired.has(piece.id)).map(piece => {
      const updated = HOLIDAY_PRODUCTS.find(source => source.id === piece.id);
      if (!updated) return piece;
      return { ...piece, name: updated.name, nameEn: updated.nameEn,
        mat: updated.mat, origin: updated.origin, description: updated.description,
        images: [...new Set([...updated.images, ...piece.images])] };
    });
    for (const id of retired) delete next.images[id];
  }
  next.catalogVersion = CATALOG_VERSION;
  return next;
}
