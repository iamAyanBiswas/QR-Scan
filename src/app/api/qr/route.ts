import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { qrcodes } from "@/db/qr.schema";
import { eq, and } from "drizzle-orm";

// Delete QR Code
export async function DELETE(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return new NextResponse("ID is required", { status: 400 });
        }

        // Check if QR exists and belongs to user
        const qr = await db.query.qrcodes.findFirst({
            where: and(eq(qrcodes.id, id), eq(qrcodes.userId, session.user.id)),
        });

        if (!qr) {
            return new NextResponse("QR Code not found", { status: 404 });
        }

        await db.delete(qrcodes).where(eq(qrcodes.id, id));

        return new NextResponse("Deleted successfully", { status: 200 });

    } catch (error) {
        console.error("[QR_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
