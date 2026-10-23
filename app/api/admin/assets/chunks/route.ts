import { checkOrigin, requireAdminRequest } from "@/lib/server/auth";
import { cancelUpload, storeChunk } from "@/lib/server/assets";
import { apiError, readJson } from "@/lib/server/cms-error";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(request: Request) {
  try { checkOrigin(request); await requireAdminRequest(request); return Response.json(await storeChunk(request), { headers: { "Cache-Control": "no-store" } }); } catch (error) { return apiError(error); }
}
export async function DELETE(request: Request) {
  try {
    checkOrigin(request); await requireAdminRequest(request);
    const input = await readJson(request);
    await cancelUpload(input && typeof input === "object" && "uploadId" in input ? input.uploadId : undefined);
    return Response.json({ cancelled: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiError(error); }
}
