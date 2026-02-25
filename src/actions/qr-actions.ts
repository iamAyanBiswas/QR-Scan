
"use server";

import { db } from "@/db/index";
import { qrcodes } from "@/db/schema";
// import { currentUser } from "@/lib/auth"; // Need to check how auth is handled
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createQRCode(data: {
    title: string;
    type: QRType;
    dynamicData: any;
    designStats: any;
    scanLimit?: number;
    expiresAt?: Date | null;
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        // Generate a short ID (6 chars)
        const shortId = nanoid(6);

        // Construct the full short URL for reference (optional, we scan the ID)
        // const shortUrl = `${process.env.NEXT_PUBLIC_SHORT_DOMAIN}/${shortId}`;

        await db.insert(qrcodes).values({
            id: shortId,
            userId: session.user.id,
            title: data.title,
            type: data.type,
            dynamicData: data.dynamicData,
            designStats: data.designStats,
            scanLimit: data.scanLimit || 0,
            expiresAt: data.expiresAt || null,
            status: "active",
            isComplete: false,
        });

        revalidatePath("/dashboard");
        return { success: true, id: shortId };
    } catch (error) {
        console.error("Create QR Error:", error);
        return { success: false, error: "Failed to create QR code" };
    }
}

export async function updateQRCode(id: string, data: Partial<typeof qrcodes.$inferInsert>) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await db.update(qrcodes)
            .set(data)
            .where(eq(qrcodes.id, id));

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Update QR Error:", error);
        return { success: false, error: "Failed to update QR code" };
    }
}
