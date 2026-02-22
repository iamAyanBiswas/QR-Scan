"use client";

import { useState } from "react";
import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { PageBuilderForm } from "@/components/block/page-builder-form";
import { PagePreview } from "@/components/block/page-preview";
import { DEFAULT_COUPON } from "@/config/qr-page-builder";

export default function CreateCouponQR() {
    const [data, setData] = useState<CouponData>(DEFAULT_COUPON);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <QRCreatorShell
                type="couponPage"
                data={data}
                onDataChange={setData}
                previewSlot={<PagePreview type="couponPage" data={data} />}
            >
                <PageBuilderForm type="couponPage" data={data} onChange={setData} />
            </QRCreatorShell>
        </div>
    );
}
