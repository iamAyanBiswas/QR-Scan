"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling, { FileExtension, Options as QRCodeOptions } from "qr-code-styling";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Link as LinkIcon, Smartphone, Ticket, Briefcase, AppWindow, MapPin, CreditCard, Calendar, Utensils, Megaphone, FileText, Users, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createQRCode, updateQRCode } from "@/actions/qr-actions";
import { getUploadUrl } from "@/actions/upload-actions";
import { toast } from "sonner";
import { QR_PAGE_TYPE } from "@/config/qr";
import { PageBuilderForm } from "@/components/block/page-builder-form";
import { PagePreview } from "@/components/block/page-preview";
import { DEFAULT_BUSINESS_CARD, DEFAULT_COUPON, DEFAULT_MENU, DEFAULT_EVENT_PAGE, DEFAULT_MARKETING, DEFAULT_TEXT_PAGE } from "@/config/qr-page-builder";
import { StepIndicator } from "@/components/custom/step-indicator";
import { UtmUrlInput } from "@/components/custom/utm-url-input";
import { IconImageInput } from "@/components/custom/input";
import { QRStylingConfig } from "@/components/block/qr-styling-config";
import { useQrStyleStore } from "@/store/qr-style-store";


function InputField({ name, placeholder, label, value, onChange, type = "text", }: {
    name: string;
    placeholder: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}




export default function QRCodeGenerator() {
    const [title, setTitle] = useState("Untitled QR");
    const [expiresAt, setExpiresAt] = useState("");
    const [type, setType] = useState<QRType>("url");
    const [data, setData] = useState<any>({});
    const { qrCodeStyle, logoFile, setQrCodeStyle, setLogoFile } = useQrStyleStore();

    // Dynamic QR State
    const [isSaving, setIsSaving] = useState(false);
    const [shortUrl, setShortUrl] = useState<string | null>(null);



    const [step, setStep] = useState<1 | 2>(1);
    const [shortId, setShortId] = useState<string | null>(null);


    const ref = useRef<HTMLDivElement>(null);
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
    }, [qrContainer]); // Only re-run if container changes

    // 2. React to Option Changes (Updating)
    useEffect(() => {
        if (!qrCodeRef.current || !shortUrl) return;


        const finalOptions: Partial<QRCodeOptions> = {
            data: shortUrl,
            ...qrCodeStyle.style,
        };

        console.log("update...", finalOptions)

        qrCodeRef.current.update(finalOptions);
    }, [shortUrl, qrCodeStyle, qrContainer]); // Added qrContainer to ensure update runs after mount if needed



    const handleDownload = (extension: FileExtension) => {
        if (qrCodeRef.current) {
            qrCodeRef.current.download({ extension });
        }
    };

    // ts-safe heleper function
    const isQrPageType = (type: QRType): type is QrPageType => {
        return QR_PAGE_TYPE.includes(type as QrPageType);
    };


    const handleCreate = async () => {
        if (!title) {
            toast.error("Please enter a title for your QR code");
            return;
        }
        setIsSaving(true);
        try {
            // Prepare dynamic data
            let dynamicPayload: any = { ...data };
            if (type === "url" && data.value && !data.value.startsWith("http")) {
                dynamicPayload.value = `https://${data.value}`;
            }

            // For Pages, dynamicPayload IS the data object already (CouponData / BusinessCardData)

            // Step 1: Create Draft
            const result = await createQRCode({
                title: title || "Untitled QR",
                type: type,
                dynamicData: dynamicPayload,
                designStats: qrCodeStyle, // Initial design stats (default)
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            });

            if (result.success && result.id) {
                setShortId(result.id);
                // Set QR data to the short URL
                const domain = process.env.NEXT_PUBLIC_SHORT_DOMAIN;
                const finalUrl = `${domain}/${result.id}`;
                setShortUrl(finalUrl);
                setStep(2);
                toast.success("Content saved! Now customize your design.");
            } else {
                toast.error(result.error || "Failed to create draft");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    const handleFinalSave = async () => {
        if (!shortId) return;
        setIsSaving(true); // Reusing isSaving for loading state

        try {
            let finalCustomOptions = { ...qrCodeStyle.style };

            // Step 2a: Upload Image to R2 if selected
            if (logoFile) {
                const uploadRes = await getUploadUrl(logoFile.type);
                if (uploadRes.success && uploadRes.uploadUrl && uploadRes.publicUrl) {
                    // Upload the file directly to R2
                    const response = await fetch(uploadRes.uploadUrl, {
                        method: "PUT",
                        body: logoFile,
                        headers: {
                            "Content-Type": logoFile.type
                        }
                    });

                    if (response.ok) {
                        // Use the public URL for the QR code options
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

            // Step 2b: Update Database with Final Design and Mark Complete
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
                setLogoFile(null); // Clear selected file
                // Optional: redirect or change UI state to 'done'
                // router.push("/dashboard"); 
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

    // Data handle
    const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prev: any) => ({ ...prev, [name]: e.target.value }));
    };


    const handleTypeChange = (t: QRType) => {
        setType(t);
        setShortUrl(null);

        // Initialize defaults
        if (t === "couponPage") setData(DEFAULT_COUPON);
        else if (t === "businessCard") setData(DEFAULT_BUSINESS_CARD);
        else if (t === "menuCard") setData(DEFAULT_MENU);
        else if (t === "eventPage") setData(DEFAULT_EVENT_PAGE);
        else if (t === "marketingPage") setData(DEFAULT_MARKETING);
        else if (t === "textPage") setData(DEFAULT_TEXT_PAGE);
        else if (t === "app") setData({ ios: "", android: "", fallback: "" });
        else if (t === "payment") setData({ recipient: "", amount: "", currency: "USD" });
        else setData({});

    };

    const STEPS = [
        { number: 1, title: "Setup Content", subtitle: "Enter campaign details" },
        { number: 2, title: "Customize Design", subtitle: "Style your QR code" }
    ];

    // QR Type configurations for visual cards
    const qrTypeCards = [
        { type: "url" as QRType, icon: LinkIcon, label: "URL", description: "Simple website link", category: "redirects" },
        { type: "app" as QRType, icon: AppWindow, label: "App Store", description: "iOS/Android apps", category: "redirects" },
        { type: "payment" as QRType, icon: CreditCard, label: "Payment", description: "Payment details", category: "redirects" },
        { type: "businessCard" as QRType, icon: Briefcase, label: "Business Card", description: "Contact information", category: "pages" },
        { type: "couponPage" as QRType, icon: Ticket, label: "Coupon", description: "Discount codes", category: "pages" },
        { type: "menuCard" as QRType, icon: Utensils, label: "Menu", description: "Restaurant menu", category: "pages" },
        { type: "eventPage" as QRType, icon: Calendar, label: "Event", description: "Event details", category: "pages" },
        { type: "marketingPage" as QRType, icon: Megaphone, label: "Marketing", description: "Landing page", category: "pages" },
        { type: "textPage" as QRType, icon: FileText, label: "Text Page", description: "Rich text content", category: "pages" },

    ];

    //App redirect 
    const appRedirectIconsURL = {
        playstore: "https://img.icons8.com/fluency/48/google-play-store-new.png",
        appstore: "https://img.icons8.com/fluency/48/apple-app-store.png",
        fallback: "https://img.icons8.com/pulsar-gradient/48/external-link.png"
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-0 space-y-6">
            {/* Step Indicator */}
            <StepIndicator currentStep={step} steps={STEPS} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: Configuration */}
                <div className="lg:col-span-7 space-y-6">
                    <Card>
                        <CardContent className="pt-6">
                            {/* Remove TabsList, use conditional rendering based on step */}
                            {step === 1 ? (

                                /* STEP 1: CONTENT */
                                <div className="space-y-6">
                                    {/* Campaign Details */}
                                    <div className="space-y-4">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-1">Campaign Details</h2>
                                            <p className="text-sm text-muted-foreground">Set up your QR code campaign information</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="qr-title">Campaign Name</Label>
                                                <Input
                                                    id="qr-title"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    placeholder="Enter campaign name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="qr-expiry">Expiration Date (Optional)</Label>
                                                <Input
                                                    id="qr-expiry"
                                                    type="datetime-local"
                                                    value={expiresAt}
                                                    onChange={(e) => setExpiresAt(e.target.value)}
                                                />
                                                <p className="text-xs text-muted-foreground">Set when the QR code expires</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* QR Type Selection - Large Visual Cards */}
                                    <div className="space-y-4">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-1">QR Type</h2>
                                            <p className="text-sm text-muted-foreground">Choose what your QR code will contain</p>
                                        </div>

                                        {/* Hosted Pages Section */}
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Hosted Pages</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {qrTypeCards.filter(card => card.category === "pages").map((card) => {
                                                    const Icon = card.icon;
                                                    const isSelected = type === card.type;
                                                    return (
                                                        <button
                                                            key={card.type}
                                                            onClick={() => handleTypeChange(card.type)}
                                                            className={cn(
                                                                "flex flex-col items-center p-4 rounded-lg border-2 transition-all hover:shadow-md hover:scale-105",
                                                                isSelected
                                                                    ? "border-primary bg-primary/5 shadow-sm"
                                                                    : "border-border bg-card hover:border-primary/50"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors",
                                                                isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                                                            )}>
                                                                <Icon className="w-6 h-6" />
                                                            </div>
                                                            <h4 className="font-semibold text-sm mb-1">{card.label}</h4>
                                                            <p className="text-xs text-muted-foreground text-center">{card.description}</p>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Smart Redirects Section */}
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Smart Redirects</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {qrTypeCards.filter(card => card.category === "redirects").map((card) => {
                                                    const Icon = card.icon;
                                                    const isSelected = type === card.type;
                                                    return (
                                                        <button
                                                            key={card.type}
                                                            onClick={() => handleTypeChange(card.type)}
                                                            className={cn(
                                                                "flex flex-col items-center p-4 rounded-lg border-2 transition-all hover:shadow-md hover:scale-105",
                                                                isSelected
                                                                    ? "border-primary bg-primary/5 shadow-sm"
                                                                    : "border-border bg-card hover:border-primary/50"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors",
                                                                isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                                                            )}>
                                                                <Icon className="w-6 h-6" />
                                                            </div>
                                                            <h4 className="font-semibold text-sm mb-1">{card.label}</h4>
                                                            <p className="text-xs text-muted-foreground text-center">{card.description}</p>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* INPUT FIELDS */}
                                    <div className="pt-4 border-t">

                                        {isQrPageType(type) ?
                                            (
                                                <PageBuilderForm type={type} data={data} onChange={setData} />
                                            ) : (
                                                <div className="space-y-4">
                                                    {type === 'url' && <UtmUrlInput value={data.value || ""} onChange={(e) => {
                                                        setData((prev: any) => ({ ...prev, value: e }));
                                                    }} />}

                                                    {type === "app" && (
                                                        <div className="space-y-4">
                                                            <IconImageInput name="ios" label="iOS App Store URL" placeholder="https://apps.apple.com/..." url={appRedirectIconsURL.appstore} value={data.ios || ""} onChange={(e) => { setData((prev: any) => ({ ...prev, ios: e.target.value })) }} />
                                                            <IconImageInput name="android" label="Google Play Store URL" placeholder="https://play.google.com/..." url={appRedirectIconsURL.playstore} value={data.android || ""} onChange={(e) => { setData((prev: any) => ({ ...prev, android: e.target.value })) }} />
                                                            <IconImageInput name="fallback" label="Fallback URL (Web)" placeholder="https://myapp.com" url={appRedirectIconsURL.fallback} value={data.fallback || ""} onChange={(e) => { setData((prev: any) => ({ ...prev, fallback: e.target.value })) }} />
                                                        </div>
                                                    )}

                                                    {type === "payment" && (
                                                        <div className="space-y-4">

                                                        </div>
                                                    )}

                                                </div>
                                            )}
                                    </div>

                                    <Button onClick={handleCreate} className="w-full mt-6" size="lg" disabled={isSaving}>
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        Next Step →
                                    </Button>
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

                                    {/* Live preview for Pages */}
                                    {isQrPageType(type) ? (
                                        <PagePreview type={type} data={data} />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-xl bg-muted/30">
                                            <div className="text-center text-muted-foreground p-6">
                                                <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
                                                <p className="text-sm max-w-xs mx-auto">
                                                    Enter your content and click "Next" to generate your dynamic QR code.

                                                    {/* Show Redirect preview only for url */}
                                                    {type === "url" && data.value && (
                                                        <div className="mt-4 p-2 bg-background border rounded text-xs break-all">
                                                            Redirects to: <br />
                                                            <span className="text-primary">{data.value.startsWith("http") ? data.value : `https://${data.value}`}</span>
                                                        </div>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}
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
