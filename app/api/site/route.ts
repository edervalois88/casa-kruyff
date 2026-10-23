import { getPublicContent } from "@/lib/server/cms-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await getPublicContent(), { headers: { "Cache-Control": "no-store" } });
}
