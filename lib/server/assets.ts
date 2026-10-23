import { randomUUID } from "node:crypto";
import { db } from "./cms-db";
import { assets, uploads } from "./schema";
import { eq, lt } from "drizzle-orm";
import { put, del } from "@vercel/blob";
import { CmsError, readBounded } from "./cms-error";
import sharp from "sharp";
import { crc32 } from "node:zlib";

const MAX = 32 * 1024 * 1024;
export const blobStorage = { put, del };
const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", glb: "model/gltf-binary", usdz: "model/vnd.usdz+zip" };
function invalid(): never { throw new CmsError(400, "Archivo inválido. Use JPEG, PNG, WebP, GLB 2 o USDZ válido."); }
function glb(bytes: Buffer) {
  if (bytes.length < 20 || bytes.readUInt32LE(4) !== 2 || bytes.readUInt32LE(8) !== bytes.length) invalid();
  let offset = 12; let json: Record<string, unknown> | undefined; let binaryLength = 0; let index = 0;
  while (offset < bytes.length) {
    if (offset + 8 > bytes.length) invalid(); const length = bytes.readUInt32LE(offset), type = bytes.readUInt32LE(offset + 4); offset += 8;
    if (length % 4 || offset + length > bytes.length) invalid();
    if (index === 0) {
      if (type !== 0x4e4f534a || length > 4 * 1024 * 1024) invalid();
      try { json = JSON.parse(bytes.subarray(offset, offset + length).toString("utf8")); } catch { invalid(); }
    } else { if (index !== 1 || type !== 0x004e4942) invalid(); binaryLength = length; }
    offset += length; index++;
  }
  if (!json || typeof json !== "object" || Array.isArray(json) || !json.asset || (json.asset as { version?: unknown }).version !== "2.0") invalid();
  const pending: unknown[] = [json]; let visited = 0;
  while (pending.length) {
    if (++visited > 100000) invalid(); const value = pending.pop();
    if (Array.isArray(value)) { if (value.length > 100000) invalid(); for (const item of value) pending.push(item); }
    else if (value && typeof value === "object") for (const [key, item] of Object.entries(value)) {
      if (key === "uri" && (typeof item !== "string" || !/^data:(?:application\/(?:octet-stream|gltf-buffer)|image\/(?:png|jpeg|webp));base64,[a-zA-Z0-9+/=]*$/.test(item))) invalid();
      pending.push(item);
    }
  }
  if (json.buffers !== undefined) {
    if (!Array.isArray(json.buffers) || json.buffers.length > 1) invalid();
    for (const buffer of json.buffers) {
      if (!buffer || typeof buffer !== "object" || !Number.isSafeInteger(buffer.byteLength) || buffer.byteLength < 0) invalid();
      if (!buffer.uri && (buffer.byteLength > binaryLength || binaryLength - buffer.byteLength > 3)) invalid();
    }
  }
}
function usdz(bytes: Buffer) {
  // USDZ is an uncompressed, unencrypted ZIP with aligned local file data.
  let end = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) if (bytes.readUInt32LE(i) === 0x06054b50) { end = i; break; }
  if (end < 0 || bytes.readUInt16LE(end + 4) || bytes.readUInt16LE(end + 6) || end + 22 + bytes.readUInt16LE(end + 20) !== bytes.length) invalid();
  const count = bytes.readUInt16LE(end + 10), size = bytes.readUInt32LE(end + 12), start = bytes.readUInt32LE(end + 16);
  if (!count || count > 2000 || bytes.readUInt16LE(end + 8) !== count || start + size !== end) invalid();
  let offset = start; let previousEnd = 0; const names = new Set<string>();
  for (let index = 0; index < count; index++) {
    if (offset + 46 > end || bytes.readUInt32LE(offset) !== 0x02014b50) invalid();
    const flags = bytes.readUInt16LE(offset + 8), compressed = bytes.readUInt32LE(offset + 20), plain = bytes.readUInt32LE(offset + 24), nameLength = bytes.readUInt16LE(offset + 28), extraLength = bytes.readUInt16LE(offset + 30), commentLength = bytes.readUInt16LE(offset + 32), local = bytes.readUInt32LE(offset + 42);
    if (flags & 9 || bytes.readUInt16LE(offset + 10) !== 0 || compressed !== plain || offset + 46 + nameLength + extraLength + commentLength > end) invalid();
    const name = bytes.subarray(offset + 46, offset + 46 + nameLength).toString("utf8");
    if (!/^[a-zA-Z0-9_. /-]+$/.test(name) || name.startsWith("/") || name.split("/").some(p => p === ".." || p === "." || !p) || names.has(name) || !/\.(?:usd[ac]?|png|jpe?g|webp|exr|hdr|mtlx)$/i.test(name)) invalid();
    if (index === 0 && !/\.usd[ac]?$/i.test(name)) invalid(); names.add(name);
    if (local < previousEnd || (index === 0 && local !== 0) || local + 30 > start || bytes.readUInt32LE(local) !== 0x04034b50 || bytes.readUInt16LE(local + 6) !== flags || bytes.readUInt16LE(local + 8) !== 0) invalid();
    const localNameLength = bytes.readUInt16LE(local + 26), data = local + 30 + localNameLength + bytes.readUInt16LE(local + 28);
    if (bytes.subarray(local + 30, local + 30 + localNameLength).toString("utf8") !== name || data % 64 || data + plain > start || bytes.readUInt32LE(local + 18) !== compressed || bytes.readUInt32LE(local + 22) !== plain) invalid();
    const payload = bytes.subarray(data, data + plain), checksum = bytes.readUInt32LE(offset + 16);
    if (bytes.readUInt32LE(local + 14) !== checksum || crc32(payload) !== checksum) invalid();
    if (index === 0 && !payload.subarray(0, 5).equals(Buffer.from("#usda")) && !payload.subarray(0, 8).equals(Buffer.from("PXR-USDC"))) invalid();
    previousEnd = data + plain;
    offset += 46 + nameLength + extraLength + commentLength;
  }
  if (offset !== end) invalid();
}
export function inspectAsset(bytes: Buffer): { extension: string; kind: "image" | "glb" | "usdz" } {
  if (bytes.length < 12 || bytes.length > MAX) invalid();
  let extension: string;
  if (bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) {
    if (bytes.length < 45 || bytes.toString("ascii", 12, 16) !== "IHDR" || bytes.toString("ascii", bytes.length - 8, bytes.length - 4) !== "IEND" || bytes.readUInt32BE(16) > 20000 || bytes.readUInt32BE(20) > 20000) invalid(); extension = "png";
  } else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) { if (bytes.at(-2) !== 255 || bytes.at(-1) !== 217) invalid(); extension = "jpg"; }
  else if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") { if (bytes.readUInt32LE(4) + 8 !== bytes.length || bytes.length < 20 || !["VP8 ", "VP8L", "VP8X"].includes(bytes.toString("ascii", 12, 16))) invalid(); extension = "webp"; }
  else if (bytes.toString("ascii", 0, 4) === "glTF") { glb(bytes); extension = "glb"; }
  else if (bytes.readUInt32LE(0) === 0x04034b50) { usdz(bytes); extension = "usdz"; }
  else invalid();
  if (["jpg", "png", "webp"].includes(extension) && bytes.length > 12 * 1024 * 1024) throw new CmsError(413, "La imagen debe pesar menos de 12 MB.");
  return { extension, kind: extension === "glb" || extension === "usdz" ? extension : "image" };
}
export async function storeUpload(request: Request) {
  const type = request.headers.get("content-type") || "";
  if (!type.startsWith("multipart/form-data;")) throw new CmsError(415, "Se requiere un archivo multipart.");
  const bytes = await readBounded(request, MAX + 64 * 1024);
  let form: FormData;
  try { form = await new Response(bytes as BodyInit, { headers: { "content-type": type } }).formData(); } catch { throw new CmsError(400, "Carga inválida."); }
  const file = form.get("file");
  if (!(file instanceof File) || form.getAll("file").length !== 1 || file.size > MAX) throw new CmsError(400, "Seleccione un archivo de hasta 32 MB.");
  return storeAssetBuffer(Buffer.from(await file.arrayBuffer()));
}

export async function storeAssetBuffer(buffer: Buffer) {
  const info = inspectAsset(buffer), filename = `${randomUUID()}.${info.extension}`;
  if (info.kind === "image") {
    try {
      // Decode before persisting: a matching signature alone does not establish a valid image.
      await sharp(buffer, { limitInputPixels: 40_000_000, failOn: "warning", pages: 1 }).resize(1, 1).png().toBuffer();
    } catch { throw new CmsError(400, "La imagen está dañada o supera 40 megapíxeles."); }
  }
  const blob = await blobStorage.put(`cms/${filename}`, buffer, { access: "public", addRandomSuffix: false, contentType: TYPES[info.extension], cacheControlMaxAge: 31536000 });
  try { await db().insert(assets).values({ filename, url: blob.url, kind: info.kind, createdAt: Date.now() }); }
  catch {
    try { await blobStorage.del(blob.url); } catch { throw new CmsError(503, "No se pudo registrar ni retirar la carga. Contacte al administrador."); }
    throw new CmsError(503, "No se pudo registrar la carga. Reintente.");
  }
  return { url: blob.url, kind: info.kind, filename };
}
export async function mediaResponse(filename: string) {
  if (!/^[a-f0-9-]{36}\.(?:jpg|png|webp|glb|usdz)$/.test(filename)) return new Response(null, { status: 404 });
  const [asset] = await db().select().from(assets).where(eq(assets.filename, filename));
  if (!asset) return new Response(null, { status: 404 });
  return new Response(null, { status: 307, headers: { Location: asset.url, "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
}

export async function storeChunk(request: Request) {
  const type = request.headers.get("content-type") || "";
  if (!type.startsWith("multipart/form-data;")) throw new CmsError(415, "Se requiere multipart.");
  const body = await readBounded(request, 3 * 1024 * 1024 + 64 * 1024);
  let form: FormData;
  try { form = await new Response(body as BodyInit, { headers: { "content-type": type } }).formData(); } catch { throw new CmsError(400, "Carga inválida."); }
  const part = form.get("file"), indexText = form.get("index"), totalText = form.get("total"), suppliedId = form.get("uploadId");
  if (typeof indexText !== "string" || !/^\d{1,2}$/.test(indexText) || typeof totalText !== "string" || !/^\d{1,2}$/.test(totalText)) throw new CmsError(400, "Fragmento inválido.");
  const index = Number(indexText), total = Number(totalText);
  if (!(part instanceof File) || !part.size || part.size > 3 * 1024 * 1024 || total < 1 || total > 11 || index >= total || (index > 0 && (typeof suppliedId !== "string" || !/^[a-f0-9-]{36}$/.test(suppliedId)))) throw new CmsError(400, "Fragmento inválido.");
  const chunk = Buffer.from(await part.arrayBuffer()), uploadId = index === 0 ? randomUUID() : suppliedId as string;
  await db().delete(uploads).where(lt(uploads.expires, Date.now()));
  if (index === 0) {
    const active = await db().select({ id: uploads.id }).from(uploads).limit(4);
    if (active.length >= 4) throw new CmsError(429, "Hay cargas pendientes. Reintente en 30 minutos.");
    await db().insert(uploads).values({ id: uploadId, total, nextIndex: 0, bytes: Buffer.alloc(0), expires: Date.now() + 30 * 60 * 1000 });
  }
  const buffer = await db().transaction(async tx => {
    const [upload] = await tx.select().from(uploads).where(eq(uploads.id, uploadId)).for("update");
    if (!upload || upload.total !== total || upload.nextIndex !== index) throw new CmsError(409, "La carga cambió o expiró. Iníciela de nuevo.");
    const bytes = Buffer.concat([Buffer.from(upload.bytes), chunk]);
    if (bytes.length > MAX) throw new CmsError(413, "Archivo demasiado grande.");
    await tx.update(uploads).set({ bytes, nextIndex: index + 1 }).where(eq(uploads.id, uploadId));
    return index === total - 1 ? bytes : undefined;
  });
  if (!buffer) return { uploadId, complete: false as const };
  try { return { ...await storeAssetBuffer(buffer), complete: true as const }; }
  finally { await db().delete(uploads).where(eq(uploads.id, uploadId)); }
}

export async function cancelUpload(uploadId: unknown) {
  if (typeof uploadId !== "string" || !/^[a-f0-9-]{36}$/.test(uploadId)) throw new CmsError(400, "Identificador de carga inválido.");
  await db().delete(uploads).where(eq(uploads.id, uploadId));
}
