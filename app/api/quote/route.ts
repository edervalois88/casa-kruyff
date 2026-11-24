import { Resend } from "resend";
import { z } from "zod";
import { checkOrigin, rateLimit } from "@/lib/server/auth";
import { apiError, CmsError, readJson } from "@/lib/server/cms-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const quoteSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).optional(),
  profile: z.string().trim().max(100).optional(),
  message: z.string().trim().max(5000).optional(),
  pieces: z.array(z.object({
    id: z.string().max(80),
    name: z.string().max(200),
    designer: z.string().max(200).optional(),
  })).max(50).optional(),
});

export async function POST(request: Request) {
  try {
    checkOrigin(request);
    await rateLimit(request, "quote");
    const body = quoteSchema.parse(await readJson(request));
    const to = process.env.QUOTE_TO;
    const from = process.env.RESEND_FROM;
    const apiKey = process.env.RESEND_API_KEY;
    if (!to || !from || !apiKey) throw new CmsError(503, "El envío de solicitudes no está configurado.");
    const pieces = body.pieces?.length
      ? body.pieces.map((piece) => `• ${piece.name}${piece.designer ? ` — ${piece.designer}` : ""}`).join("\n")
      : "Sin piezas seleccionadas.";
    const text = [
      `Nueva solicitud de cotización en casakruyff.com`,
      ``,
      `Nombre: ${body.name}`,
      `Correo: ${body.email}`,
      `Teléfono: ${body.phone || "—"}`,
      `Perfil: ${body.profile || "—"}`,
      ``,
      `Piezas:`,
      pieces,
      ``,
      `Mensaje:`,
      body.message || "—",
    ].join("\n");
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: [to],
      replyTo: body.email,
      subject: `Nueva solicitud de cotización — ${body.name}`,
      text,
    });
    if (error) throw new CmsError(502, "No se pudo enviar la solicitud.");
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ ok: false, error: "Datos inválidos." }, { status: 400 });
    return apiError(error);
  }
}
