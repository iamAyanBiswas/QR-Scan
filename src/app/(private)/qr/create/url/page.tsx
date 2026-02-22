"use client";

import { useState } from "react";
import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { UtmUrlInput } from "@/components/custom/utm-url-input";

export default function CreateUrlQR() {
    const [data, setData] = useState<{ value: string }>({ value: "" });

    return (
        <div className="flex flex-col items-center justify-start min-h-full">
            <QRCreatorShell type="url" data={data} onDataChange={setData}>
                <UtmUrlInput
                    value={data.value || ""}
                    onChange={(e) => {
                        setData((prev) => ({ ...prev, value: e }));
                    }}
                />
            </QRCreatorShell>
        </div>
    );
}
