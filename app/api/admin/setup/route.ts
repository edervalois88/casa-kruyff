import { checkOrigin, rateLimit, setup } from "@/lib/server/auth";
import { auth } from "@/lib/server/better-auth";
import { apiError, readJson } from "@/lib/server/cms-error";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    await rateLimit(request, "setup");
    const { email, password } = await setup(await readJson(request));
    const result = await auth.api.signInEmail({ body: { email, password, rememberMe: true }, headers: request.headers, returnHeaders: true });
    const headers = new Headers(result.headers);
    headers.set("Cache-Control", "no-store");
    return Response.json({ authenticated: true, setupRequired: false }, { headers });
  } catch (error) { return apiError(error); }
}
