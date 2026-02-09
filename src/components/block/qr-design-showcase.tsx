"use client";

import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { QR_CATEGORIES, QRStyle } from "@/lib/qr-styles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QRPreview = ({ style }: { style: QRStyle }) => {
    const ref = useRef<HTMLDivElement>(null);
    const qrCode = useRef<QRCodeStyling | null>(null);

    useEffect(() => {
        if (!qrCode.current) {
            qrCode.current = new QRCodeStyling({
                width: 150,
                height: 150,
                data: "https://example.com",
                image: "",
                dotsOptions: {
                    color: "#000000",
                    type: "rounded",
                },
                imageOptions: {
                    crossOrigin: "anonymous",
                    margin: 10,
                },
            });
        }

        if (ref.current) {
            ref.current.innerHTML = "";
            qrCode.current.append(ref.current);
        }
    }, [style]);

    useEffect(() => {
        if (!qrCode.current) return;
        qrCode.current.update({
            ...style.options
        });
    }, [style]);

    return (
        <Card className="flex flex-col items-center p-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <div ref={ref} />
            <div className="mt-4 text-sm font-medium text-center">{style.label}</div>
        </Card>
    );
};

export default function QRDesignShowcase() {
    return (
        <div className="space-y-12 w-full max-w-7xl mx-auto p-4">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold tracking-tight">Premium Design Collection</h2>
                <p className="text-lg text-muted-foreground">Explore 50+ professionally curated QR styles.</p>
            </div>

            {QR_CATEGORIES.map((category) => (
                <div key={category.id} className="space-y-6">
                    <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-bold text-primary">{category.label}</h3>
                        <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {category.styles.map((style) => (
                            <QRPreview key={style.name} style={style} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
