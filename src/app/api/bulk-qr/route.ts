import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { qrcodes } from "@/db/qr/qr.schema";
import { eq, desc } from "drizzle-orm";
import { ApiSuccess, ApiError } from "@/lib/api-response";

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return ApiError("Unauthorized", "You must be logged in to access this resource", 401);
        }

        const userQrCodes = await db.query.qrcodes.findMany({
            where: eq(qrcodes.userId, session.user.id),
            orderBy: [desc(qrcodes.createdAt)],
            columns: {
                id: true,
                shortCode: true,
                title: true,
                status: true,
                designStats: true,
                createdAt: true,
                type: true,
                scans: true
            }
        });

        return ApiSuccess(userQrCodes, "QR codes fetched successfully", 200);
    } catch (error) {
        console.error("[BULK_QR_GET]", error);
        return ApiError("Internal Error", "An unexpected error occurred", 500);
    }
}