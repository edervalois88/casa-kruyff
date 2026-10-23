import { checkOrigin, cookieHeader, login, rateLimit } from "@/lib/server/auth";
import { apiError, readJson } from "@/lib/server/cms-error";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try { checkOrigin(request); await rateLimit(request, "login"); const token = await login(await readJson(request)); return Response.json({ authenticated: true, setupRequired: false }, { headers: { "Set-Cookie": cookieHeader(request, token), "Cache-Control": "no-store" } }); } catch (error) { return apiError(error); }
}
