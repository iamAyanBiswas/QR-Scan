"use client";

import { useState } from "react";
import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { PageBuilderForm } from "@/components/block/page-builder-form";
import { PagePreview } from "@/components/block/page-preview";
import { DEFAULT_MARKETING } from "@/config/qr-page-builder";

export default function CreateMarketingQR() {
    const [data, setData] = useState<MarketingData>(DEFAULT_MARKETING);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <QRCreatorShell
                type="marketingPage"
                data={data}
                onDataChange={setData}
                previewSlot={<PagePreview type="marketingPage" data={data} />}
            >
                <PageBuilderForm type="marketingPage" data={data} onChange={setData} />
            </QRCreatorShell>
        </div>
    );
}
