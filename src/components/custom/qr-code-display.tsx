"use client";

import React, { useEffect, useRef } from "react";
import QRCodeStyling, { Options } from "qr-code-styling";

interface QRCodeDisplayProps {
    data: string;
    options?: Options;
    size?: number;
    className?: string; // Allow custom classes for container
}

export default function QRCodeDisplay({ data, options, size = 200, className }: QRCodeDisplayProps) {
    const ref = useRef<HTMLDivElement>(null);
    const qrCode = useRef<QRCodeStyling | null>(null);

    useEffect(() => {
        // Initialize QRCodeStyling instance
        qrCode.current = new QRCodeStyling({
            width: size,
            height: size,
            data: data,
            ...options,
        });

        // Append to div
        if (ref.current) {
            qrCode.current.append(ref.current);
        }
    }, []);

    useEffect(() => {
        if (!qrCode.current) return;
        qrCode.current.update({
            width: size,
            height: size,
            data: data,
            ...options,
        });
    }, [data, options, size]); // Update on changes

    return <div ref={ref} className={className} />;
}
