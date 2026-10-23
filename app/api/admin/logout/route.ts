import { checkOrigin, cookieHeader, logout, sessionToken } from "@/lib/server/auth";
import { apiError } from "@/lib/server/cms-error";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try { checkOrigin(request); await logout(sessionToken(request)); return Response.json({ authenticated: false }, { headers: { "Set-Cookie": cookieHeader(request, ""), "Cache-Control": "no-store" } }); } catch (error) { return apiError(error); }
}
