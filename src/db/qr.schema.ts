import { pgTable, text, integer, timestamp, jsonb, index, boolean } from "drizzle-orm/pg-core";
import { user } from "@/db/auth/auth.schema";

export const qrcodes = pgTable(
    "qrcodes",
    {
        id: text("id").primaryKey(), // The Short Code
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        title: text("title").notNull(),
        description: text("description"),
        type: text("type").notNull(), // URL, COUPON, VCARD
        scans: integer("scans").default(0).notNull(),
        scanLimit: integer("scan_limit").default(0).notNull(), // 0 = unlimited
        expiresAt: timestamp("expires_at"),
        dynamicData: jsonb("dynamic_data"), // Stores Page Content
        designStats: jsonb("design_stats"), // Stores QR Styling
        status: text("status").default("active").notNull(), // active, paused, archived
        isComplete: boolean("is_complete").default(false).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("qrcodes_userId_idx").on(table.userId)]
);
