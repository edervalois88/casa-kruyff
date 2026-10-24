import { Pool } from "pg";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { attachDatabasePool } from "@vercel/functions";
import { CmsError } from "./cms-error";
import * as schema from "./schema";

export type CmsDatabase = NodePgDatabase<typeof schema>;
let database: CmsDatabase | undefined;
let testDatabase: CmsDatabase | undefined;
let pool: Pool | undefined;
export function getPool(): Pool {
  if (pool) return pool;
  if (!process.env.DATABASE_URL) throw new CmsError(503, "La base de datos no está configurada.");
  pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3, idleTimeoutMillis: 5000, connectionTimeoutMillis: 10000 });
  attachDatabasePool(pool);
  return pool;
}
export function db(): CmsDatabase {
  if (testDatabase) return testDatabase;
  if (database) return database;
  database = drizzle(getPool(), { schema });
  return database;
}
export function useTestDatabase(value: CmsDatabase | undefined) {
  if (process.env.NODE_ENV !== "test") throw new Error("Test database override is unavailable.");
  testDatabase = value;
}
export async function closeDatabase() { await pool?.end(); database = undefined; pool = undefined; }
