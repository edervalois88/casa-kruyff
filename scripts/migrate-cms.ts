import { loadEnvConfig } from "@next/env";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, closeDatabase } from "../lib/server/cms-db";
loadEnvConfig(process.cwd());
async function main() {
  if (!process.env.DATABASE_URL_UNPOOLED) {
    console.error("DATABASE_URL_UNPOOLED is required for CMS migrations."); process.exitCode = 1; return;
  }
  try {
    process.env.DATABASE_URL = process.env.DATABASE_URL_UNPOOLED;
    await migrate(db(), { migrationsFolder: "./drizzle" }); console.log("CMS migrations applied.");
  }
  catch { console.error("CMS migration failed. Verify database configuration and connectivity."); process.exitCode = 1; }
  finally { await closeDatabase(); }
}
void main();
