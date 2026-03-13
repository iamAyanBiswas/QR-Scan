import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { qrcodes } from "@/db/qr/qr.schema";
import { eq, and, desc } from "drizzle-orm";
import { ApiSuccess, ApiError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return ApiError("Unauthorized", "You must be logged in to access this resource", 401);
        }

        const id = req.nextUrl.searchParams.get("id");

        if (!id) {
            return ApiError("Bad Request", "QR ID is required", 400);
        }

        const columnsParam = req.nextUrl.searchParams.get("columns");
        let columns: Record<string, boolean> | undefined = undefined;

        if (columnsParam) {
            columns = {};
            const cols = columnsParam.split(",");
            for (const col of cols) {
                const trimmedCol = col.trim();
                if (trimmedCol) {
                    if (!(trimmedCol in qrcodes)) {
                        return ApiError("Bad Request", `Invalid column: ${trimmedCol}`, 400);
                    }
                    columns[trimmedCol] = true;
                }
            }
        }

        const qr = await db.query.qrcodes.findFirst({
            where: and(eq(qrcodes.id, id), eq(qrcodes.userId, session.user.id)),
            ...(columns && Object.keys(columns).length > 0 ? { columns } : {}),
        });

        if (!qr) {
            return ApiError("Not Found", "QR Code not found", 404);
        }

        return ApiSuccess(qr, "QR Code fetched successfully", 200);
    } catch (error) {
        console.error("[QR_GET]", error);
        return ApiError("Internal Error", "An unexpected error occurred", 500);
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return ApiError("Unauthorized", "You must be logged in to access this resource", 401);
        }

        const body = await req.json();
        const { id, ...data } = body;

        if (!id) {
            return ApiError("Bad Request", "ID is required", 400);
        }

        // Verify ownership
        const qr = await db.query.qrcodes.findFirst({
            where: and(eq(qrcodes.id, id), eq(qrcodes.userId, session.user.id)),
        });

        if (!qr) {
            return ApiError("Not Found", "QR Code not found", 404);
        }

        // Remove unupdatable fields just in case
        delete data.userId;
        delete data.shortCode;
        delete data.createdAt;

        // Skip if no data provided
        if (Object.keys(data).length === 0) {
            return ApiSuccess(qr, "No data provided for update", 200);
        }

        // Add proper update time
        data.updatedAt = new Date();

        const [updatedQR] = await db.update(qrcodes)
            .set(data)
            .where(eq(qrcodes.id, id))
            .returning();

        return ApiSuccess(updatedQR, "QR Code updated successfully", 200);
    } catch (error) {
        console.error("[QR_PATCH]", error);
        return ApiError("Internal Error", "An unexpected error occurred", 500);
    }
}

// Delete QR Code
export async function DELETE(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return ApiError("Unauthorized", "You must be logged in to access this resource", 401);
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return ApiError("Bad Request", "ID is required", 400);
        }

        // Check if QR exists and belongs to user
        const qr = await db.query.qrcodes.findFirst({
            where: and(eq(qrcodes.id, id), eq(qrcodes.userId, session.user.id)),
        });

        if (!qr) {
            return ApiError("Not Found", "QR Code not found", 404);
        }

        await db.delete(qrcodes).where(eq(qrcodes.id, id));

        return ApiSuccess(null, "Deleted successfully", 200);

    } catch (error) {
        console.error("[QR_DELETE]", error);
        return ApiError("Internal Error", "An unexpected error occurred", 500);
    }
}
