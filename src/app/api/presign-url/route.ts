import { NextRequest } from "next/server";
import { getPresignedUrlForUpload } from "@/lib/r2-presign";
import { MAX_R2_UPLOAD_LIMIT } from "@/config/r2";
import { ApiSuccess, ApiError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
    const { fileName, contentType, fileSize } = await req.json();

    if (!fileName) {
        return ApiError("Bad Request", "File name is required.", 400);
    };

    if (!contentType.startsWith("image/")) {
        return ApiError("Bad Request", "Content-Type must be image/*", 400);
    };

    if (Number(fileSize) > MAX_R2_UPLOAD_LIMIT) {
        return ApiError("Bad Request", `Image must be under ${MAX_R2_UPLOAD_LIMIT}MB.`, 400);
    }
    const key = `uploads/${Date.now()}-${fileName}`;
    const presignedUrl = await getPresignedUrlForUpload(key, contentType);
    return ApiSuccess({ presignedUrl, key }, "Presigned URL created successfully", 201);
}