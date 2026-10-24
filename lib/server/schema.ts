import { sql } from "drizzle-orm";
import { bigint, check, customType, integer, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import type { SiteContent } from "../cms-types";
import { user as authUser } from "./better-auth-schema";

export {
  account as authAccount,
  rateLimit as authRateLimit,
  session as authSession,
  user as authUser,
  verification as authVerification,
  userRelations as authUserRelations,
  sessionRelations as authSessionRelations,
  accountRelations as authAccountRelations,
} from "./better-auth-schema";

const bytea = customType<{ data: Buffer; driverData: Buffer }>({ dataType: () => "bytea" });
export const content = pgTable("cms_content", {
  id: integer().primaryKey(), document: jsonb().$type<SiteContent>().notNull(), revision: integer().notNull(),
}, table => [check("cms_content_singleton", sql`${table.id} = 1`), check("cms_revision_positive", sql`${table.revision} >= 0`)]);
export const admins = pgTable("cms_admins", {
  id: integer().primaryKey(),
  email: text().notNull(),
  userId: text("user_id").unique().references(() => authUser.id, { onDelete: "cascade" }),
}, table => [check("cms_admin_singleton", sql`${table.id} = 1`)]);
export const rateLimits = pgTable("cms_rate_limits", {
  key: text().primaryKey(), count: integer().notNull(), expires: bigint({ mode: "number" }).notNull(),
});
export const bootstrap = pgTable("cms_bootstrap", {
  id: integer().primaryKey(), hash: text().notNull(),
}, table => [check("cms_bootstrap_singleton", sql`${table.id} = 1`)]);
export const assets = pgTable("cms_assets", {
  filename: text().primaryKey(), url: text().notNull(), kind: text().notNull(), createdAt: bigint("created_at", { mode: "number" }).notNull(),
});
export const uploads = pgTable("cms_uploads", {
  id: text().primaryKey(), total: integer().notNull(), nextIndex: integer("next_index").notNull(), bytes: bytea().notNull(), expires: bigint({ mode: "number" }).notNull(),
});
