"use client";

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import QRCodeStyling, { Options, FileExtension } from "qr-code-styling";

interface QRCodeDisplayProps {
    data: string;
    options?: Options;
    size?: number;
    className?: string; // Allow custom classes for container
}

export interface QRCodeDisplayRef {
    download: (extension?: FileExtension) => void;
}

const QRCodeDisplay = forwardRef<QRCodeDisplayRef, QRCodeDisplayProps>(
    ({ data, options, size = 200, className }, ref) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const qrCode = useRef<QRCodeStyling | null>(null);

        useImperativeHandle(ref, () => ({
            download: (extension: FileExtension = "png") => {
                if (qrCode.current) {
                    qrCode.current.download({ extension });
                }
            }
        }));

        useEffect(() => {
            // Initialize QRCodeStyling instance
            qrCode.current = new QRCodeStyling({
                width: size,
                height: size,
                data: data,
                ...options,
            });

            // Append to div
            if (containerRef.current) {
                qrCode.current.append(containerRef.current);
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

        return <div ref={containerRef} className={className} />;
    }
);

QRCodeDisplay.displayName = "QRCodeDisplay";

export default QRCodeDisplay;
