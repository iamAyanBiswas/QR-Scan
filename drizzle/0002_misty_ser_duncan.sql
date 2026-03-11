ALTER TABLE "qrcodes" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "qrcodes" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "qrcodes" ADD COLUMN "short_code" text NOT NULL;--> statement-breakpoint
CREATE INDEX "qrcodes_shortCode_idx" ON "qrcodes" USING btree ("short_code");--> statement-breakpoint
ALTER TABLE "qrcodes" ADD CONSTRAINT "qrcodes_short_code_unique" UNIQUE("short_code");