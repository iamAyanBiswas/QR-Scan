import { pgTable, text, integer, timestamp, jsonb, index, boolean, uuid } from "drizzle-orm/pg-core";
import { user } from "@/db/auth/auth.schema";

export const qrcodes = pgTable(
    "qrcodes",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        shortCode: text("short_code").notNull().unique(), // The Short Code
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        title: text("title").notNull(),
        description: text("description"),
        type: text("type").notNull(), // URL, COUPON, VCARD
        scans: integer("scans").default(0).notNull(),
        expiresAt: timestamp("expires_at"),
        dynamicData: jsonb("dynamic_data"), // Stores Page Content
        designStats: jsonb("design_stats"), // Stores QR Styling
        status: text("status").default("active").notNull(), // active, paused, archived
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("qrcodes_userId_idx").on(table.userId),
        index("qrcodes_shortCode_idx").on(table.shortCode)
    ]
);
