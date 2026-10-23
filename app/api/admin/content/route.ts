import { checkOrigin, requireAdminRequest } from "@/lib/server/auth";
import { apiError, readJson } from "@/lib/server/cms-error";
import { getContent, saveContent } from "@/lib/server/cms-store";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try { await requireAdminRequest(request); return Response.json(await getContent(), { headers: { "Cache-Control": "no-store" } }); } catch (error) { return apiError(error); }
}
export async function PUT(request: Request) {
  try { checkOrigin(request); await requireAdminRequest(request); return Response.json(await saveContent(await readJson(request)), { headers: { "Cache-Control": "no-store" } }); } catch (error) { return apiError(error); }
}
