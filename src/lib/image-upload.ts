//image upload to r2
export async function imageUploadInR2(imageFile: File): Promise<{ success: true, key: string } | { success: false, message: unknown }> {
    try {
        if (!imageFile) throw new Error("Please select the file")
        const presignResponse = await fetch(`${process.env.API_URL}/presign-url`, {
            method: "POST",
            body: JSON.stringify(
                {
                    fileName: imageFile.name,
                    contentType: imageFile.type,
                    fileSize: imageFile.size
                }
            )
        })
        const data = await presignResponse.json()
        if (!presignResponse.ok) {
            throw new Error(data.message || 'Unable to create image upload link')
        }
        const r2UploadResponse = await fetch(data.presignedUrl as string, {
            method: "PUT",
            headers: {
                "Content-Type": imageFile.type,
            },
            body: imageFile,
        });
        if (!r2UploadResponse.ok) {
            throw new Error("Unable to upload image")
        }
        return { success: true, key: data.key as string }
    } catch (error) {
        return { success: false, message: error }
    }
}