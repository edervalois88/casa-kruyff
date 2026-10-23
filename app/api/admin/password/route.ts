import { changePassword, checkOrigin, cookieHeader, rateLimit, requireAdminRequest } from "@/lib/server/auth";
import { apiError, readJson } from "@/lib/server/cms-error";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try { checkOrigin(request); await requireAdminRequest(request); await rateLimit(request, "password"); await changePassword(await readJson(request)); return Response.json({ authenticated: false }, { headers: { "Set-Cookie": cookieHeader(request, ""), "Cache-Control": "no-store" } }); } catch (error) { return apiError(error); }
}
