"use server";

import { getPresignedUrlForUpload } from "@/lib/r2-presign";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { nanoid } from "nanoid";

export async function getUploadUrl(contentType: string, folder = "qr-assets") {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    const fileExtension = contentType.split("/")[1] || "png";
    const key = `${folder}/${session.user.id}/${nanoid(10)}.${fileExtension}`;

    try {
        const uploadUrl = await getPresignedUrlForUpload(key, contentType);
        // Return the upload URL and the final public URL (assuming public access or worker setup)
        // Public R2 structure: https://pub-xxx.r2.dev/key or custom domain
        const publicUrl = `${process.env.R2_PUBLIC_DOMAIN}/${key}`;

        return { success: true, uploadUrl, publicUrl, key };
    } catch (error) {
        console.error("Presign Error:", error);
        return { success: false, error: "Failed to generate upload URL" };
    }
}
