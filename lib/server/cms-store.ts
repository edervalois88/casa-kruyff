import type { SiteContent } from "../cms-types";
import { createSeedContent } from "../cms-seed";
import { db } from "./cms-db";
import { CmsError } from "./cms-error";
import { and, eq, inArray } from "drizzle-orm";
import { assets, content as contentTable } from "./schema";

function fail(path: string): never { throw new CmsError(400, `Contenido inválido: ${path}.`); }
function object(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail(path);
  return value as Record<string, unknown>;
}
function text(value: unknown, path: string, max = 12000): asserts value is string {
  if (typeof value !== "string" || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) fail(path);
}
function exact(value: Record<string, unknown>, keys: string[], path: string) {
  if (Object.keys(value).some(key => !keys.includes(key)) || keys.some(key => !(key in value))) fail(path);
}
function id(value: unknown, path: string) { text(value, path, 80); if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(value)) fail(path); }
function tuple(value: unknown, path: string) { if (!Array.isArray(value) || value.length !== 2) fail(path); value.forEach(v => text(v, path)); }
function url(value: unknown, path: string, ext?: string) {
  text(value, path, 2048);
  if (ext) {
    if (new RegExp(`^/(?:media|models)/[a-zA-Z0-9_-]+\\.${ext}$`).test(value)) return;
    try { const parsed = new URL(value); if (parsed.protocol === "https:" && /^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/.test(parsed.hostname) && new RegExp(`^/cms/[a-f0-9-]{36}\\.${ext}$`).test(parsed.pathname) && !parsed.search && !parsed.hash) return; } catch {}
    fail(path);
  }
  if (/^\/(?:images|media)\/[a-zA-Z0-9_.-]+\.(?:png|jpe?g|webp)$/i.test(value)) return;
  try { const parsed = new URL(value); if (parsed.protocol === "https:" && !parsed.username && !parsed.password) return; } catch {}
  fail(path);
}
function asset(value: unknown, path: string) {
  const v = object(value, path); exact(v, ["src", "credit", "href"], path); url(v.src, path); text(v.credit, path, 500); text(v.href, path, 2048);
  if (v.href) { try { if (new URL(v.href).protocol === "https:") return; } catch {} fail(path); }
}
function copyShape(value: unknown, template: unknown, path: string) {
  if (typeof template === "string") { text(value, path); return; }
  if (Array.isArray(template)) {
    if (!Array.isArray(value) || value.length !== template.length) fail(path);
    template.forEach((item, i) => copyShape(value[i], item, `${path}.${i}`)); return;
  }
  const v = object(value, path), t = object(template, path); exact(v, Object.keys(t), path);
  for (const key of Object.keys(t)) copyShape(v[key], t[key], `${path}.${key}`);
}
function rows(value: unknown, path: string, validate: (row: Record<string, unknown>) => void) {
  if (!Array.isArray(value) || value.length > 500) fail(path);
  const ids = new Set<string>();
  value.forEach(row => { const v = object(row, path); id(v.id, path); if (ids.has(v.id as string)) fail(`${path}.id duplicado`); ids.add(v.id as string); validate(v); });
}
export function validateContent(input: unknown): SiteContent {
  const v = object(input, "documento"); exact(v, ["revision", "updatedAt", "pieces", "cats", "images", "heroes", "copy", "projects", "designers", "settings"], "documento");
  if (!Number.isSafeInteger(v.revision) || (v.revision as number) < 0) fail("revision");
  text(v.updatedAt, "updatedAt", 50); if (!Number.isFinite(Date.parse(v.updatedAt))) fail("updatedAt");
  if (!Array.isArray(v.cats) || v.cats.length < 1 || v.cats.length > 100) fail("cats");
  const cats = new Set<string>();
  for (const cat of v.cats) { if (!Array.isArray(cat) || cat.length !== 3) fail("cats"); id(cat[0], "cats.id"); if (cats.has(cat[0])) fail("cats.id duplicado"); cats.add(cat[0]); text(cat[1], "cats.es", 500); text(cat[2], "cats.en", 500); }
  rows(v.pieces, "pieces", p => {
    exact(p, ["id", "name", "nameEn", "cat", "designer", "origin", "mat", "dim", "description", "images", "published", "availability", ...(p.model !== undefined ? ["model"] : [])], "pieces");
    for (const key of ["name", "nameEn", "designer", "origin", "dim"]) text(p[key], `pieces.${key}`, 500);
    if (!cats.has(p.cat as string)) fail("pieces.cat"); tuple(p.mat, "pieces.mat"); tuple(p.description, "pieces.description");
    if (typeof p.published !== "boolean" || !["available", "on-request", "sold"].includes(p.availability as string)) fail("pieces.estado");
    if (!Array.isArray(p.images) || p.images.length > 20) fail("pieces.images"); p.images.forEach(image => url(image, "pieces.images"));
    if (p.published && !p.images.length) fail("pieces.images: una pieza publicada necesita imagen");
    if (p.model !== undefined) { const m = object(p.model, "model"); exact(m, ["glb", ...(m.usdz !== undefined ? ["usdz"] : [])], "model"); url(m.glb, "model.glb", "glb"); if (m.usdz) url(m.usdz, "model.usdz", "usdz"); }
  });
  const images = object(v.images, "images"); if (Object.keys(images).length > 1500) fail("images"); for (const [key, image] of Object.entries(images)) { id(key, "images.id"); asset(image, "images"); }
  const heroes = object(v.heroes, "heroes"); exact(heroes, ["home", "interiorHome", "interior", "house", "journal", "contact"], "heroes"); Object.values(heroes).forEach(image => asset(image, "heroes"));
  copyShape(v.copy, createSeedContent().copy, "copy");
  rows(v.projects, "projects", p => { exact(p, ["id", "name", "place", "type"], "projects"); text(p.name, "projects.name", 500); text(p.place, "projects.place", 500); tuple(p.type, "projects.type"); });
  rows(v.designers, "designers", p => { exact(p, ["id", "name", "origin", "disc"], "designers"); text(p.name, "designers.name", 500); text(p.origin, "designers.origin", 500); tuple(p.disc, "designers.disc"); });
  const s = object(v.settings, "settings"); exact(s, ["phone", "instagramUsername", "defaultLanguage"], "settings"); text(s.phone, "settings.phone", 40); if (!/^[+\d ()-]{5,40}$/.test(s.phone)) fail("settings.phone"); text(s.instagramUsername, "settings.instagram", 30); if (!/^[a-zA-Z0-9._]{1,30}$/.test(s.instagramUsername) || !["es", "en"].includes(s.defaultLanguage as string)) fail("settings");
  return structuredClone(v) as unknown as SiteContent;
}
export async function getContent(): Promise<SiteContent> {
  const database = db();
  await database.insert(contentTable).values({ id: 1, document: createSeedContent(), revision: 0 }).onConflictDoNothing();
  const [row] = await database.select().from(contentTable).where(eq(contentTable.id, 1));
  return structuredClone(row.document);
}
export async function getPublicContent(): Promise<SiteContent> {
  const content = await getContent(); const drafts = content.pieces.filter(piece => !piece.published); content.pieces = content.pieces.filter(piece => piece.published);
  drafts.forEach(piece => delete content.images[piece.id]); return content;
}
export async function saveContent(input: unknown): Promise<SiteContent> {
  const content = validateContent(input); await getContent(); const previous = content.revision;
  const models = content.pieces.flatMap(piece => piece.model ? [{ url: piece.model.glb, kind: "glb" }, ...(piece.model.usdz ? [{ url: piece.model.usdz, kind: "usdz" }] : [])] : []).filter(model => model.url.startsWith("https:"));
  if (models.length) {
    const records = await db().select().from(assets).where(inArray(assets.url, models.map(model => model.url)));
    if (models.some(model => !records.some(asset => asset.url === model.url && asset.kind === model.kind))) throw new CmsError(400, "Los modelos deben cargarse y validarse desde este panel.");
  }
  content.revision++; content.updatedAt = new Date().toISOString();
  const result = await db().update(contentTable).set({ document: content, revision: content.revision }).where(and(eq(contentTable.id, 1), eq(contentTable.revision, previous))).returning({ id: contentTable.id });
  if (!result.length) throw new CmsError(409, "El contenido cambió. Recargue antes de guardar.");
  return content;
}
