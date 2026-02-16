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






    // Social Media State Helper
    const addPlatform = () => {
        setData((prev: any) => ({
            ...prev,
            platforms: [...(prev.platforms || []), { platform: "instagram", url: "" }]
        }));
    };

    const updatePlatform = (index: number, key: "platform" | "url", value: string) => {
        setData((prev: any) => {
            const newPlatforms = [...(prev.platforms || [])];
            newPlatforms[index] = { ...newPlatforms[index], [key]: value };
            return { ...prev, platforms: newPlatforms };
        });
    };

    const removePlatform = (index: number) => {
        setData((prev: any) => ({
            ...prev,
            platforms: prev.platforms.filter((_: any, i: number) => i !== index)
        }));
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
        else if (t === "social") setData({ platforms: [{ platform: "instagram", url: "" }] });
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
        { type: "social" as QRType, icon: Users, label: "Social Bio", description: "Multiple social links", category: "redirects" },
        { type: "app" as QRType, icon: AppWindow, label: "App Store", description: "iOS/Android apps", category: "redirects" },
        { type: "location" as QRType, icon: MapPin, label: "Location", description: "GPS coordinates", category: "redirects" },
        { type: "payment" as QRType, icon: CreditCard, label: "Payment", description: "Payment details", category: "redirects" },
        { type: "businessCard" as QRType, icon: Briefcase, label: "Business Card", description: "Contact information", category: "pages" },
        { type: "couponPage" as QRType, icon: Ticket, label: "Coupon", description: "Discount codes", category: "pages" },
        { type: "menuCard" as QRType, icon: Utensils, label: "Menu", description: "Restaurant menu", category: "pages" },
        { type: "eventPage" as QRType, icon: Calendar, label: "Event", description: "Event details", category: "pages" },
        { type: "marketingPage" as QRType, icon: Megaphone, label: "Marketing", description: "Landing page", category: "pages" },
        { type: "textPage" as QRType, icon: FileText, label: "Text Page", description: "Rich text content", category: "pages" },
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
                                                    {type === "url" && <InputField name="value" label={type === "url" ? "Website URL" : "Text"} placeholder="Enter content..." value={data.value || ""} onChange={handleChange("value")} />}

                                                    {type === "social" && (
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between items-center">
                                                                <Label>Social Platforms</Label>
                                                                <Button variant="outline" size="sm" onClick={addPlatform}>+ Add Platform</Button>
                                                            </div>
                                                            <div className="space-y-3">
                                                                {data.platforms?.map((p: any, i: number) => (
                                                                    <div key={i} className="flex gap-2 items-start">
                                                                        <div className="grid grid-cols-3 gap-2 w-full">
                                                                            <select
                                                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                                                                value={p.platform}
                                                                                onChange={(e) => updatePlatform(i, "platform", e.target.value)}
                                                                            >
                                                                                <option value="instagram">Instagram</option>
                                                                                <option value="facebook">Facebook</option>
                                                                                <option value="twitter">X (Twitter)</option>
                                                                                <option value="linkedin">LinkedIn</option>
                                                                                <option value="tiktok">TikTok</option>
                                                                                <option value="youtube">YouTube</option>
                                                                                <option value="github">GitHub</option>
                                                                                <option value="website">Website</option>
                                                                            </select>
                                                                            <Input
                                                                                placeholder="URL"
                                                                                value={p.url}
                                                                                onChange={(e) => updatePlatform(i, "url", e.target.value)}
                                                                                className="col-span-2"
                                                                            />
                                                                        </div>
                                                                        <Button variant="ghost" size="icon" onClick={() => removePlatform(i)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {type === "app" && (
                                                        <div className="space-y-4">
                                                            <InputField name="ios" label="iOS App Store URL" placeholder="https://apps.apple.com/..." value={data.ios || ""} onChange={handleChange("ios")} />
                                                            <InputField name="android" label="Google Play Store URL" placeholder="https://play.google.com/..." value={data.android || ""} onChange={handleChange("android")} />
                                                            <InputField name="fallback" label="Fallback URL (Web)" placeholder="https://myapp.com" value={data.fallback || ""} onChange={handleChange("fallback")} />
                                                        </div>
                                                    )}

                                                    {type === "payment" && (
                                                        <div className="space-y-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <InputField name="recipient" label="Recipient Name" placeholder="Business Name" value={data.recipient || ""} onChange={handleChange("recipient")} />
                                                                <div className="space-y-2">
                                                                    <Label>Amount (Fixed)</Label>
                                                                    <div className="flex gap-2">
                                                                        <Input className="w-20" placeholder="$" value={data.currency || "USD"} onChange={handleChange("currency")} />
                                                                        <Input placeholder="10.00" value={data.amount || ""} onChange={handleChange("amount")} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <InputField name="paypal" label="PayPal Username" placeholder="username" value={data.paypal || ""} onChange={handleChange("paypal")} />
                                                            <InputField name="upi" label="UPI ID (India)" placeholder="user@upi" value={data.upi || ""} onChange={handleChange("upi")} />
                                                        </div>
                                                    )}

                                                    {/* Existing Types */}

                                                    {type === "location" && (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <InputField name="latitude" label="Latitude" placeholder="40.7128" value={data.latitude || ""} onChange={handleChange("latitude")} />
                                                            <InputField name="longitude" label="Longitude" placeholder="-74.0060" value={data.longitude || ""} onChange={handleChange("longitude")} />
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
