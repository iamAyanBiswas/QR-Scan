"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import QRDetailClient from "@/components/block/qr-detail-client";

export default function ViewQR() {
    const params = useParams<{ id: string }>();
    const id = params?.id;

    const [qrCode, setQrCode] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFoundState, setNotFoundState] = useState(false);

    const domain = process.env.NEXT_PUBLIC_SHORT_DOMAIN ?? "";

    useEffect(() => {
        if (!id) {
            setNotFoundState(true);
            return;
        }

        fetch(`/api/qr?id=${id}`, { credentials: "include" })
            .then(async (res) => {
                if (res.status === 404 || !res.ok) {
                    setNotFoundState(true);
                    return;
                }
                const { data } = await res.json();
                setQrCode(data);
            })
            .catch(() => setNotFoundState(true))
            .finally(() => setLoading(false));
    }, [id]);

    if (notFoundState) notFound();

    if (loading) {
        return (
            <div className="p-8 bg-gray-50/50 dark:bg-background min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50/50 dark:bg-background min-h-[calc(100vh-4rem)]">
            <QRDetailClient
                qr={{ ...qrCode, type: qrCode.type as QRType, dynamicData: qrCode.dynamicData ?? null }}
                domain={domain}
            />
        </div>
    );
}