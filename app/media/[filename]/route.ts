import { mediaResponse } from "@/lib/server/assets";
export const runtime = "nodejs";
export async function GET(_request: Request, context: { params: Promise<{ filename: string }> }) {
  const { filename } = await context.params; return mediaResponse(filename);
}
