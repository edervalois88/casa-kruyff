import { checkOrigin, cookieHeader, rateLimit, setup } from "@/lib/server/auth";
import { apiError, readJson } from "@/lib/server/cms-error";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try { checkOrigin(request); await rateLimit(request, "setup"); const token = await setup(await readJson(request)); return Response.json({ authenticated: true, setupRequired: false }, { headers: { "Set-Cookie": cookieHeader(request, token), "Cache-Control": "no-store" } }); } catch (error) { return apiError(error); }
}
