import { checkOrigin, requireAdminRequest } from "@/lib/server/auth";
import { storeUpload } from "@/lib/server/assets";
import { apiError } from "@/lib/server/cms-error";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try { checkOrigin(request); await requireAdminRequest(request); return Response.json(await storeUpload(request), { headers: { "Cache-Control": "no-store" } }); } catch (error) { return apiError(error); }
}
