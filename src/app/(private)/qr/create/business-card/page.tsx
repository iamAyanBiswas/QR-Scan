"use client";

import { useState } from "react";
import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { PageBuilderForm } from "@/components/block/page-builder-form";
import { PagePreview } from "@/components/block/page-preview";
import { DEFAULT_BUSINESS_CARD } from "@/config/qr-page-builder";

export default function CreateBusinessCardQR() {
    const [data, setData] = useState<BusinessCardData>(DEFAULT_BUSINESS_CARD);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <QRCreatorShell
                type="businessCard"
                data={data}
                onDataChange={setData}
                previewSlot={<PagePreview type="businessCard" data={data} />}
            >
                <PageBuilderForm type="businessCard" data={data} onChange={setData} />
            </QRCreatorShell>
        </div>
    );
}
