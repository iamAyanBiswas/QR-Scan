import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { qrcodes } from "@/db/qr.schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const userQrCodes = await db.query.qrcodes.findMany({
            where: eq(qrcodes.userId, session.user.id),
            orderBy: [desc(qrcodes.createdAt)],
            columns: {
                id: true,
                title: true,
                status: true,
                isComplete: true,
                designStats: true,
                createdAt: true,
                type: true,
                scans: true
            }
        });

        return NextResponse.json(userQrCodes, { status: 200 });
    } catch (error) {
        console.error("[BULK_QR_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}