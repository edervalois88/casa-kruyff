import { randomBytes, createHash, scryptSync, timingSafeEqual } from "node:crypto";
import { db } from "./cms-db";
import { and, eq, gt, lt, sql } from "drizzle-orm";
import { admins, bootstrap, rateLimits, sessions } from "./schema";
import { CmsError } from "./cms-error";
import { ipAddress } from "@vercel/functions";

export const COOKIE = "ck_admin";
const TTL = 60 * 60 * 8;
type Admin = { id: number; email: string; password: string };
const digest = (s: string) => createHash("sha256").update(s).digest("hex");
function same(a: string, b: string) { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); }
function passwordHash(password: string) { const salt = randomBytes(16).toString("hex"); return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`; }
function verify(password: string, stored: string) { const [salt, hash] = stored.split(":"); return same(scryptSync(password, salt, 64).toString("hex"), hash); }
function credentials(input: unknown): { email: string; password: string; token?: string; currentPassword?: string } {
  if (!input || typeof input !== "object") throw new CmsError(400, "Datos inválidos.");
  return input as { email: string; password: string; token?: string; currentPassword?: string };
}
function strong(password: unknown): asserts password is string { if (typeof password !== "string" || password.length < 12 || password.length > 256) throw new CmsError(400, "La contraseña debe tener entre 12 y 256 caracteres."); }
async function admin() { return (await db().select().from(admins).where(eq(admins.id, 1)))[0] as Admin | undefined; }
export async function setupRequired() { return !(await admin()); }
export async function ensureSetupKey() {
  if (await admin()) return;
  const key = process.env.CMS_SETUP_TOKEN;
  if (!key || !/^[a-zA-Z0-9_-]{43,128}$/.test(key)) throw new CmsError(503, "Configure CMS_SETUP_TOKEN en el servidor antes de crear la cuenta.");
  await db().insert(bootstrap).values({ id: 1, hash: digest(key) }).onConflictDoUpdate({ target: bootstrap.id, set: { hash: digest(key) } });
}
export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin || request.headers.get("sec-fetch-site") === "cross-site") throw new CmsError(403, "Origen no permitido.");
}
export async function rateLimit(request: Request, scope: string) {
  const now = Date.now();
  const client = digest(ipAddress(request) || "local");
  for (const [key, limit] of [[`${scope}:ip:${client}`, 20], [`${scope}:global`, 1000]] as const) {
    const [row] = await db().insert(rateLimits).values({ key, count: 1, expires: now + 15 * 60 * 1000 }).onConflictDoUpdate({ target: rateLimits.key, set: {
      count: sql`CASE WHEN ${rateLimits.expires} < ${now} THEN 1 ELSE ${rateLimits.count} + 1 END`,
      expires: sql`CASE WHEN ${rateLimits.expires} < ${now} THEN ${now + 15 * 60 * 1000} ELSE ${rateLimits.expires} END`,
    } }).returning({ count: rateLimits.count });
    if (row.count > limit) throw new CmsError(429, "Demasiados intentos. Espere 15 minutos.");
  }
}
export function sessionToken(request: Request) { return request.headers.get("cookie")?.split(";").map(s => s.trim()).find(s => s.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1) || ""; }
export async function getSession(token: string): Promise<{ email: string; id: number } | undefined> {
  if (!/^[a-f0-9]{64}$/.test(token)) return;
  return (await db().select({ id: admins.id, email: admins.email }).from(sessions).innerJoin(admins, eq(admins.id, sessions.adminId)).where(and(eq(sessions.hash, digest(token)), gt(sessions.expires, Date.now()))))[0];
}
async function issueSession(expectedPassword: string) {
  const token = randomBytes(32).toString("hex");
  await db().transaction(async tx => {
    const [account] = await tx.select().from(admins).where(eq(admins.id, 1)).for("update");
    if (!account || !same(account.password, expectedPassword)) throw new CmsError(401, "La cuenta cambió. Inicie sesión de nuevo.");
    await tx.delete(sessions).where(lt(sessions.expires, Date.now()));
    await tx.insert(sessions).values({ hash: digest(token), adminId: 1, expires: Date.now() + TTL * 1000 });
  });
  return token;
}
export async function setup(input: unknown) {
  const value = credentials(input); strong(value.password);
  if (typeof value.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) || value.email.length > 254) throw new CmsError(400, "Correo inválido.");
  await ensureSetupKey();
  const password = passwordHash(value.password);
  await db().transaction(async tx => {
    const [key] = await tx.select().from(bootstrap).where(eq(bootstrap.id, 1)).for("update");
    if (!key || typeof value.token !== "string" || !same(digest(value.token.trim()), key.hash)) throw new CmsError(403, "No se pudo configurar la cuenta.");
    const inserted = await tx.insert(admins).values({ id: 1, email: value.email.trim().toLowerCase(), password }).onConflictDoNothing().returning({ id: admins.id });
    if (!inserted.length) throw new CmsError(403, "No se pudo configurar la cuenta.");
    await tx.delete(bootstrap);
  });
  return issueSession(password);
}
export async function login(input: unknown) {
  const value = credentials(input), account = await admin();
  if (typeof value.email !== "string" || typeof value.password !== "string" || value.password.length > 256) throw new CmsError(401, "Correo o contraseña incorrectos.");
  const stored = account?.password || `00000000000000000000000000000000:${"0".repeat(128)}`;
  const valid = verify(value.password, stored);
  if (!account || !valid || value.email.trim().toLowerCase() !== account.email) throw new CmsError(401, "Correo o contraseña incorrectos.");
  return issueSession(stored);
}
export async function logout(token: string) { await db().delete(sessions).where(eq(sessions.hash, digest(token))); }
export async function changePassword(input: unknown) {
  const value = credentials(input); strong(value.password);
  await db().transaction(async tx => {
    const [account] = await tx.select().from(admins).where(eq(admins.id, 1)).for("update");
    if (!account || typeof value.currentPassword !== "string" || value.currentPassword.length > 256 || !verify(value.currentPassword, account.password)) throw new CmsError(403, "Contraseña actual incorrecta.");
    await tx.update(admins).set({ password: passwordHash(value.password) }).where(eq(admins.id, 1));
    await tx.delete(sessions);
  });
}
export function cookieHeader(request: Request, token: string) {
  const host = new URL(request.url).hostname;
  const secure = process.env.NODE_ENV === "production" && !["localhost", "127.0.0.1", "[::1]"].includes(host);
  return `${COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${token ? TTL : 0}${secure ? "; Secure" : ""}`;
}
export async function requireAdminRequest(request: Request) { const session = await getSession(sessionToken(request)); if (!session) throw new CmsError(401, "Inicie sesión."); return session; }
export async function requireAdmin() {
  const { cookies } = await import("next/headers"); const { redirect } = await import("next/navigation");
  const session = await getSession((await cookies()).get(COOKIE)?.value || ""); if (!session) redirect("/admin/login"); return session;
}
