import type { ManagedPiece, SiteContent } from "@/lib/cms-types";

export type PieceFilters = {
  query: string;
  collection: string;
  status: string;
  model: string;
};

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim();

export function filterPieces(pieces: ManagedPiece[], filters: PieceFilters) {
  const query = normalize(filters.query);
  return pieces.filter(piece =>
    normalize(`${piece.name} ${piece.nameEn} ${piece.designer}`).includes(query)
    && (!filters.collection || piece.cat === filters.collection)
    && (!filters.status || (filters.status === "published" ? piece.published : !piece.published))
    && (!filters.model || (filters.model === "ready" ? !!piece.model?.glb : !piece.model?.glb)),
  );
}

export function changedSections(current: SiteContent, saved: SiteContent) {
  const groups: [string, (keyof SiteContent)[]][] = [
    ["Catálogo y modelos 3D/RA", ["pieces"]],
    ["Colecciones", ["cats"]],
    ["Imágenes", ["images", "heroes"]],
    ["Textos del sitio", ["copy"]],
    ["Proyectos", ["projects"]],
    ["Diseñadores", ["designers"]],
    ["Contacto y preferencias", ["settings"]],
  ];
  return groups.filter(([, keys]) => keys.some(key => JSON.stringify(current[key]) !== JSON.stringify(saved[key]))).map(([label]) => label);
}
