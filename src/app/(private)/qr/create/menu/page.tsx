"use client";

import { useState } from "react";
import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { PageBuilderForm } from "@/components/block/page-builder-form";
import { PagePreview } from "@/components/block/page-preview";
import { DEFAULT_MENU } from "@/config/qr-page-builder";

export default function CreateMenuQR() {
    const [data, setData] = useState<MenuData>(DEFAULT_MENU);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <QRCreatorShell
                type="menuCard"
                data={data}
                onDataChange={setData}
                previewSlot={<PagePreview type="menuCard" data={data} />}
            >
                <PageBuilderForm type="menuCard" data={data} onChange={setData} />
            </QRCreatorShell>
        </div>
    );
}
