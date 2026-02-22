
import { db } from "@/db/index";
import { qrcodes } from "@/db/schema";
import { sql, eq, and, lt } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import DynamicPageRenderer from "@/components/renderer/dynamic-page-renderer";

export default async function ShortLinkPage({
    params,
}: {
    params: Promise<{ shortId: string }>;
}) {
    const { shortId } = await params;

    // 1. Atomic Update Logic
    // "Update scans = scans + 1 WHERE id = shortId AND scans < scanLimit"
    // Also check if ExpiresAt is in the future (or null)
    // We might need to do a finding first to check expiration cleanly, 
    // or we can do it in one query if we are clever. 
    // BUT 'scanLimit' = 0 means unlimited.
    // So the condition is: (scanLimit == 0 OR scans < scanLimit)

    // Let's fetch the QR first to check logic simpler (Atomic update is for concurrency, but a slight read-before-write here for checking expiration is acceptable for MVP, 
    // OR we can do the robust raw SQL update).

    // Optimized Approach: Fetch first (fast read), then atomic increment.
    // Why? checks expiration, status, etc.
    const qr = await db.query.qrcodes.findFirst({
        where: eq(qrcodes.id, shortId)
    });

    if (!qr) {
        return notFound();
    }

    // 2. Checks
    if (qr.status !== "active") {
        return redirect("/expired?reason=inactive"); // or custom 404
    }

    if (qr.expiresAt && new Date() > qr.expiresAt) {
        return redirect("/expired?reason=expired");
    }

    if (qr.scanLimit > 0 && qr.scans >= qr.scanLimit) {
        return redirect("/expired?reason=limit");
    }

    // 3. Atomic Increment (Fire and Forget or Await)
    // We await it to ensure it counts.
    await db.update(qrcodes)
        .set({ scans: sql`${qrcodes.scans} + 1` })
        .where(eq(qrcodes.id, shortId));

    // 4. Redirect / Render
    if (qr.type === "URL") {
        // The dynamicData.url might be missing 'https', need to ensure
        const targetUrl = (qr.dynamicData as any)?.url || "/";
        return redirect(targetUrl);
    }

    // Render Dynamic Page Templates
    return <DynamicPageRenderer type={qr.type as QrPageType} data={qr.dynamicData} />;
}
