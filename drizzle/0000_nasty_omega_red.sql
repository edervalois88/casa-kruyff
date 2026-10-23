CREATE TABLE "cms_admins" (
	"id" integer PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "cms_admin_singleton" CHECK ("cms_admins"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "cms_assets" (
	"filename" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"kind" text NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cms_bootstrap" (
	"id" integer PRIMARY KEY NOT NULL,
	"hash" text NOT NULL,
	CONSTRAINT "cms_bootstrap_singleton" CHECK ("cms_bootstrap"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "cms_content" (
	"id" integer PRIMARY KEY NOT NULL,
	"document" jsonb NOT NULL,
	"revision" integer NOT NULL,
	CONSTRAINT "cms_content_singleton" CHECK ("cms_content"."id" = 1),
	CONSTRAINT "cms_revision_positive" CHECK ("cms_content"."revision" >= 0)
);
--> statement-breakpoint
CREATE TABLE "cms_rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"expires" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cms_sessions" (
	"hash" text PRIMARY KEY NOT NULL,
	"admin_id" integer NOT NULL,
	"expires" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cms_uploads" (
	"id" text PRIMARY KEY NOT NULL,
	"total" integer NOT NULL,
	"next_index" integer NOT NULL,
	"bytes" "bytea" NOT NULL,
	"expires" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cms_sessions" ADD CONSTRAINT "cms_sessions_admin_id_cms_admins_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."cms_admins"("id") ON DELETE cascade ON UPDATE no action;