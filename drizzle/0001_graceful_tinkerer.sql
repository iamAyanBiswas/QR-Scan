CREATE TABLE "qrcodes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"scans" integer DEFAULT 0 NOT NULL,
	"scan_limit" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp,
	"dynamic_data" jsonb,
	"design_stats" jsonb,
	"status" text DEFAULT 'active' NOT NULL,
	"is_complete" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "qrcodes" ADD CONSTRAINT "qrcodes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "qrcodes_userId_idx" ON "qrcodes" USING btree ("user_id");