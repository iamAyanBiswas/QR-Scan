"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling, { FileExtension, Options as QRCodeOptions } from "qr-code-styling";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Link as LinkIcon, Smartphone } from "lucide-react";
import { updateQRCode } from "@/actions/qr-actions";
import { getUploadUrl } from "@/actions/upload-actions";
import { toast } from "sonner";
import { StepIndicator } from "@/components/custom/step-indicator";
import { QRStylingConfig } from "@/components/block/qr-styling-config";
import { useQrStyleStore } from "@/store/qr-style-store";




interface QRCreatorShellProps {
    children: React.ReactNode;
    shortId: string | null;
    step: 1 | 2
    shortUrl: string | null;
    //For live preview of the page that we are building live
    previewSlot?: React.ReactNode;
}

export function QRCreatorShell({ children, shortId, step, shortUrl, previewSlot }: QRCreatorShellProps) {

    const { qrCodeStyle, logoFile, setQrCodeStyle, setLogoFile } = useQrStyleStore();

    // Dynamic QR State
    const [isSaving, setIsSaving] = useState(false);
    // const [shortUrl, setShortUrl] = useState<string | null>(null);
    // const [step, setStep] = useState<1 | 2>(1);
    // const [shortId, setShortId] = useState<string | null>(null);

    const qrCodeRef = useRef<QRCodeStyling | null>(null);

    // Callback ref to handle DOM node availability
    const [qrContainer, setQrContainer] = useState<HTMLDivElement | null>(null);
    const onRefChange = React.useCallback((node: HTMLDivElement | null) => {
        setQrContainer(node);
    }, []);

    // 1. Initialize & Attach QR Code (Mounting)
    useEffect(() => {
        if (!qrContainer) return;

        // Ensure Instance Exists
        if (!qrCodeRef.current) {
            qrCodeRef.current = new QRCodeStyling({
                width: 300,
                height: 300,
            });
        }

        // Append to Container
        qrContainer.innerHTML = "";
        qrCodeRef.current.append(qrContainer);
    }, [qrContainer]);

    // 2. React to Option Changes (Updating)
    useEffect(() => {
        if (!qrCodeRef.current || !shortUrl) return;

        const finalOptions: Partial<QRCodeOptions> = {
            data: shortUrl,
            ...qrCodeStyle.style,
        };

        qrCodeRef.current.update(finalOptions);
    }, [shortUrl, qrCodeStyle, qrContainer]);

    const handleDownload = (extension: FileExtension) => {
        if (qrCodeRef.current) {
            qrCodeRef.current.download({ extension });
        }
    };




    const handleFinalSave = async () => {
        if (!shortId) return;
        setIsSaving(true);

        try {
            let finalCustomOptions = { ...qrCodeStyle.style };

            // Upload Image to R2 if selected
            if (logoFile) {
                const uploadRes = await getUploadUrl(logoFile.type);
                if (uploadRes.success && uploadRes.uploadUrl && uploadRes.publicUrl) {
                    const response = await fetch(uploadRes.uploadUrl, {
                        method: "PUT",
                        body: logoFile,
                        headers: {
                            "Content-Type": logoFile.type
                        }
                    });

                    if (response.ok) {
                        finalCustomOptions.image = uploadRes.publicUrl;
                        setQrCodeStyle(prev => ({
                            ...prev,
                            style: { ...prev.style, image: uploadRes.publicUrl }
                        }));
                        toast.success("Logo uploaded successfully");
                    } else {
                        console.error("Upload failed", response.status, response.statusText);
                        toast.error("Failed to upload logo, staying with preview");
                    }
                } else {
                    toast.error("Failed to get upload URL");
                }
            }

            // Update Database with Final Design and Mark Complete
            const finalStyle = {
                ...qrCodeStyle,
                style: { ...qrCodeStyle.style, image: finalCustomOptions.image }
            };

            const result = await updateQRCode(shortId, {
                designStats: finalStyle,
                isComplete: true
            });

            if (result.success) {
                toast.success("QR Code Published!");
                setLogoFile(null);
            } else {
                toast.error(result.error || "Failed to publish");
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to publish");
        } finally {
            setIsSaving(false);
        }
    };

    const STEPS = [
        { number: 1, title: "Setup Content", subtitle: "Enter campaign details" },
        { number: 2, title: "Customize Design", subtitle: "Style your QR code" }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto p-0 space-y-6">
            {/* Step Indicator */}
            <StepIndicator currentStep={step} steps={STEPS} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: Configuration */}
                <div className="lg:col-span-7 space-y-6">
                    <Card>
                        <CardContent className="pt-6">
                            {step === 1 ? (

                                /* STEP 1: CONTENT */
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-semibold mb-1">Campaign Details</h2>
                                        <p className="text-sm text-muted-foreground">Set up your QR code campaign information</p>
                                    </div>

                                    {/* Category-specific Input Fields (rendered by each page) */}
                                    {children}

                                </div>
                            ) : (

                                /* STEP 2: DESIGN/CUSTOMIZE */
                                <div className="space-y-6">
                                    <QRStylingConfig />

                                    <Button onClick={handleFinalSave} className="w-full mt-6" size="lg" disabled={isSaving}>
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        Save & Publish
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Preview */}
                <div className="lg:col-span-5">
                    <div className="sticky top-6 space-y-4">

                        {step === 1 ?
                            (<Card className="border-none shadow-none py-0 bg-transparent">
                                <CardContent>
                                    {/* Custom preview slot */}
                                    {previewSlot && previewSlot}
                                </CardContent>
                            </Card>)
                            :
                            (
                                <>
                                    <Card className="overflow-hidden border-2 border-primary/10 shadow-xl bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                                        <CardContent className="flex flex-col items-center justify-center p-8 min-h-96">
                                            <div ref={onRefChange} className="bg-white p-4 rounded-xl shadow-sm" />
                                            {shortUrl ? (
                                                <div className="mt-6 text-center space-y-2 w-full">
                                                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center gap-2">
                                                        <LinkIcon className="w-4 h-4" /> Active Dynamic Link
                                                    </div>
                                                    <p className="text-xs text-muted-foreground break-all select-all font-mono bg-muted p-2 rounded">
                                                        {shortUrl}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="mt-6 text-sm text-muted-foreground text-center animate-pulse">
                                                    Scanning for greatness...
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        {shortUrl && (
                                            <>
                                                <Button onClick={() => handleDownload("png")} className="w-full" size="lg">
                                                    <Download className="w-4 h-4 mr-2" /> PNG
                                                </Button>
                                                <Button onClick={() => handleDownload("svg")} variant="outline" className="w-full" size="lg">
                                                    <Download className="w-4 h-4 mr-2" /> SVG
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}

                    </div>
                </div>
            </div>
        </div>
    );
}
