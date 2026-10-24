import { ensureSetupKey, getSession, setupRequired } from "@/lib/server/auth";
import { apiError } from "@/lib/server/cms-error";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try { await ensureSetupKey(); const session = await getSession(request.headers); return Response.json({ authenticated: !!session, setupRequired: await setupRequired(), ...(session ? { email: session.email } : {}) }, { headers: { "Cache-Control": "no-store" } }); } catch (error) { return apiError(error); }
}
