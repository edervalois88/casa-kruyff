import { createHash, timingSafeEqual } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ipAddress } from "@vercel/functions";
import { admins, bootstrap, rateLimits } from "./schema";
import { auth } from "./better-auth";
import { db } from "./cms-db";
import { CmsError } from "./cms-error";

const digest = (value: string) => createHash("sha256").update(value).digest("hex");
function same(a: string, b: string) {
  const left = Buffer.from(a), right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

type Credentials = { email: string; password: string; token?: string };
function credentials(input: unknown): Credentials {
  if (!input || typeof input !== "object") throw new CmsError(400, "Datos inválidos.");
  return input as Credentials;
}

function validateCredentials(input: Credentials) {
  if (typeof input.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) || input.email.length > 254) {
    throw new CmsError(400, "Correo inválido.");
  }
  if (typeof input.password !== "string" || input.password.length < 12 || input.password.length > 128) {
    throw new CmsError(400, "La contraseña debe tener entre 12 y 128 caracteres.");
  }
}

export async function setupRequired() {
  const [owner] = await db().select({ userId: admins.userId }).from(admins).where(eq(admins.id, 1));
  return !owner?.userId;
}

export async function ensureSetupKey() {
  if (!(await setupRequired())) return;
  const key = process.env.CMS_SETUP_TOKEN;
  if (!key || !/^[a-zA-Z0-9_-]{43,128}$/.test(key)) {
    throw new CmsError(503, "Configure CMS_SETUP_TOKEN en el servidor antes de crear la cuenta.");
  }
  await db().insert(bootstrap).values({ id: 1, hash: digest(key) }).onConflictDoUpdate({
    target: bootstrap.id,
    set: { hash: digest(key) },
  });
}

export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin || request.headers.get("sec-fetch-site") === "cross-site") {
    throw new CmsError(403, "Origen no permitido.");
  }
}

export async function rateLimit(request: Request, scope: string) {
  const now = Date.now();
  const client = digest(ipAddress(request) || "local");
  for (const [key, limit] of [[`${scope}:ip:${client}`, 20], [`${scope}:global`, 1000]] as const) {
    const [row] = await db().insert(rateLimits).values({ key, count: 1, expires: now + 15 * 60 * 1000 }).onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        count: sql`CASE WHEN ${rateLimits.expires} < ${now} THEN 1 ELSE ${rateLimits.count} + 1 END`,
        expires: sql`CASE WHEN ${rateLimits.expires} < ${now} THEN ${now + 15 * 60 * 1000} ELSE ${rateLimits.expires} END`,
      },
    }).returning({ count: rateLimits.count });
    if (row.count > limit) throw new CmsError(429, "Demasiados intentos. Espere 15 minutos.");
  }
}

export async function setup(input: unknown) {
  const value = credentials(input);
  validateCredentials(value);
  await ensureSetupKey();

  const email = value.email.trim().toLowerCase();
  const context = await auth.$context;
  let userId = "";

  await db().transaction(async tx => {
    const [key] = await tx.select().from(bootstrap).where(eq(bootstrap.id, 1)).for("update");
    if (!key || typeof value.token !== "string" || !same(digest(value.token.trim()), key.hash)) {
      throw new CmsError(403, "No se pudo configurar la cuenta.");
    }
    const [owner] = await tx.select({ userId: admins.userId }).from(admins).where(eq(admins.id, 1)).for("update");
    if (owner?.userId) throw new CmsError(403, "La cuenta de administración ya está configurada.");

    const existing = await context.internalAdapter.findUserByEmail(email);
    if (existing) {
      const account = await context.internalAdapter.findCredentialAccount(existing.user.id);
      if (!account?.password || !(await context.password.verify({ hash: account.password, password: value.password }))) {
        throw new CmsError(409, "Ese correo ya tiene una cuenta. Use otro correo.");
      }
      userId = existing.user.id;
    } else {
      const user = await context.internalAdapter.createUser({
        email,
        name: "Casa Kruyff",
        emailVerified: false,
        image: null,
      }, { method: "email-password" });
      userId = user.id;
      try {
        await context.internalAdapter.linkAccount({
          userId,
          providerId: "credential",
          accountId: userId,
          password: await context.password.hash(value.password),
        });
      } catch (error) {
        await context.internalAdapter.deleteUser(userId).catch(() => undefined);
        userId = "";
        throw error;
      }
    }

    await tx.insert(admins).values({ id: 1, email, userId }).onConflictDoUpdate({
      target: admins.id,
      set: { email, userId },
    });
    await tx.delete(bootstrap).where(eq(bootstrap.id, 1));
  });

  return { email, password: value.password };
}

export async function getSession(requestHeaders: Headers) {
  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session) return undefined;
  const [owner] = await db().select({ id: admins.id, email: admins.email })
    .from(admins)
    .where(and(eq(admins.id, 1), eq(admins.userId, session.user.id)));
  return owner ? { id: session.user.id, email: owner.email, session: session.session } : undefined;
}

export async function requireAdminRequest(request: Request) {
  const session = await getSession(request.headers);
  if (!session) throw new CmsError(401, "Inicie sesión.");
  return session;
}

export async function requireAdmin() {
  const session = await getSession(await headers());
  if (!session) redirect("/admin/login");
  return session;
}
