"use client";

import { useState } from "react";
import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { PageBuilderForm } from "@/components/block/page-builder-form";
import { PagePreview } from "@/components/block/page-preview";
import { DEFAULT_EVENT_PAGE } from "@/config/qr-page-builder";

export default function CreateEventQR() {
    const [data, setData] = useState<EventPageData>(DEFAULT_EVENT_PAGE);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <QRCreatorShell
                type="eventPage"
                data={data}
                onDataChange={setData}
                previewSlot={<PagePreview type="eventPage" data={data} />}
            >
                <PageBuilderForm type="eventPage" data={data} onChange={setData} />
            </QRCreatorShell>
        </div>
    );
}
