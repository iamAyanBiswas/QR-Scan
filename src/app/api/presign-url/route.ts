import { NextRequest, NextResponse } from "next/server";
import { getPresignedUrlForUpload } from "@/lib/r2-presign";
import { MAX_R2_UPLOAD_LIMIT } from "@/config/r2";

export async function POST(req: NextRequest) {
    const { fileName, contentType, fileSize } = await req.json();

    if (!fileName) {
        return NextResponse.json({ message: "File name is required." }, { status: 400 })
    };

    if (!contentType.startsWith("image/")) {
        return NextResponse.json({ message: "Content-Type must be image/*" }, { status: 400 })
    };

    if (Number(fileSize) > MAX_R2_UPLOAD_LIMIT) {
        return NextResponse.json({ message: `Image must be under ${MAX_R2_UPLOAD_LIMIT}MB.` }, { status: 400 })
    }
    const key = `uploads/${Date.now()}-${fileName}`;
    const presignedUrl = await getPresignedUrlForUpload(key, contentType);
    return NextResponse.json({ presignedUrl, key }, { status: 201 });
}