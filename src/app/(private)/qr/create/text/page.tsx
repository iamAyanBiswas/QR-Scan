"use client";

import { useState } from "react";
import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { PageBuilderForm } from "@/components/block/page-builder-form";
import { PagePreview } from "@/components/block/page-preview";
import { DEFAULT_TEXT_PAGE } from "@/config/qr-page-builder";

export default function CreateTextPageQR() {
    const [data, setData] = useState<TextPageData>(DEFAULT_TEXT_PAGE);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <QRCreatorShell
                type="textPage"
                data={data}
                onDataChange={setData}
                previewSlot={<PagePreview type="textPage" data={data} />}
            >
                <div className="pt-4 border-t">
                    <PageBuilderForm type="textPage" data={data} onChange={setData} />
                </div>
            </QRCreatorShell>
        </div>
    );
}
