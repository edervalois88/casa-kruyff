export class CmsError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function apiError(error: unknown): Response {
  return Response.json({ error: error instanceof CmsError ? error.message : "No se pudo completar la operación." }, { status: error instanceof CmsError ? error.status : 500, headers: { "Cache-Control": "no-store" } });
}

export async function readBounded(request: Request, limit: number): Promise<Uint8Array> {
  if (Number(request.headers.get("content-length")) > limit) throw new CmsError(413, "Archivo o solicitud demasiado grande.");
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new CmsError(413, "Archivo o solicitud demasiado grande."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes;
}

export async function readJson(request: Request): Promise<unknown> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new CmsError(415, "Se requiere JSON.");
  try { return JSON.parse(new TextDecoder().decode(await readBounded(request, 2 * 1024 * 1024))); }
  catch (error) { if (error instanceof CmsError) throw error; throw new CmsError(400, "JSON inválido."); }
}
