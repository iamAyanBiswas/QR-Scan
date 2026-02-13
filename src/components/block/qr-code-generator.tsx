"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling, { FileExtension, Options as QRCodeOptions, DotType, CornerSquareType } from "qr-code-styling";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Download, Palette, Shapes, Image as ImageIcon, LayoutGrid, Loader2, Link as LinkIcon, Save, Smartphone, QrCode, Ticket, Briefcase, LayoutTemplate, AppWindow, Wifi, MapPin, CreditCard, Mail, Phone, MessageSquare, MessageCircle, Calendar, Utensils, Megaphone, FileText, Users, Contact, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { ALL_STYLES as PREMIUM_STYLES, QR_CATEGORIES, QRStyle } from "@/lib/qr-styles";
import { cn } from "@/lib/utils";
import { createQRCode, updateQRCode } from "@/actions/qr-actions";
import { getUploadUrl } from "@/actions/upload-actions";
import { toast } from "sonner";
import { QR_PAGE_TYPE } from "@/config/qr";
import { PageBuilderForm } from "@/components/block/page-builder-form";
import { PagePreview } from "@/components/block/page-preview";
import { DEFAULT_BUSINESS_CARD, DEFAULT_COUPON, DEFAULT_MENU, DEFAULT_EVENT_PAGE, DEFAULT_MARKETING, DEFAULT_TEXT_PAGE } from "@/config/qr-page-builder";
import { StyleButton } from "@/components/custom/style-button";
import { DotsSquareIcon, DotsRoundIcon, DotsRoundedIcon, DotsExtraRoundedIcon, DotsClassyIcon, DotsClassyRoundedIcon, CornerSquareIcon, CornerDotIcon, CornerExtraRoundedIcon, CornerNoneIcon, CornerCenterSquareIcon, CornerCenterDotIcon } from "@/components/custom/qr-style-icons";
import { StepIndicator } from "@/components/custom/step-indicator";


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

function CustomAccordionItem({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border rounded-lg overflow-hidden">
            <button
                className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 font-medium text-sm">
                    {icon}
                    {title}
                </div>
                {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </button>
            {isOpen && <div className="p-3 bg-background border-t animate-in slide-in-from-top-2 fade-in duration-200">{children}</div>}
        </div>
    );
}





export default function QRCodeGenerator() {
    const [title, setTitle] = useState("Untitled QR");
    const [expiresAt, setExpiresAt] = useState("");
    const [type, setType] = useState<QRType>("url");
    const [data, setData] = useState<any>({});
    const [selectedStyle, setSelectedStyle] = useState<string>("classic-black");
    const [customOptions, setCustomOptions] = useState<Partial<QRCodeOptions>>({});

    // Dynamic QR State
    const [isSaving, setIsSaving] = useState(false);
    const [shortUrl, setShortUrl] = useState<string | null>(null);
    const [rightTab, setRightTab] = useState<"qr" | "preview">("preview");

    const mergedOptions = React.useMemo(() => {
        const templateOptions = PREMIUM_STYLES.find(s => s.name === selectedStyle)?.options || {};
        return {
            ...templateOptions,
            ...customOptions,
            dotsOptions: { ...templateOptions.dotsOptions, ...customOptions.dotsOptions },
            cornersSquareOptions: { ...templateOptions.cornersSquareOptions, ...customOptions.cornersSquareOptions },
            cornersDotOptions: { ...templateOptions.cornersDotOptions, ...customOptions.cornersDotOptions },
            backgroundOptions: { ...templateOptions.backgroundOptions, ...customOptions.backgroundOptions },
            imageOptions: { ...templateOptions.imageOptions, ...customOptions.imageOptions },
        };
    }, [selectedStyle, customOptions]);

    const [step, setStep] = useState<1 | 2>(1);
    const [shortId, setShortId] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null); // To store selected file for upload


    const ref = useRef<HTMLDivElement>(null);
    const qrCodeRef = useRef<QRCodeStyling | null>(null);

    // Callback ref to handle DOM node availability
    const [qrContainer, setQrContainer] = useState<HTMLDivElement | null>(null);
    const onRefChange = React.useCallback((node: HTMLDivElement | null) => {
        setQrContainer(node);
    }, []);



    // Initialize & Attach QR Code
    useEffect(() => {
        // 1. Ensure Instance Exists
        if (!qrCodeRef.current) {
            qrCodeRef.current = new QRCodeStyling({
                width: 300,
                height: 300,
                image: "",
                dotsOptions: { color: "#000000", type: "rounded" },
                imageOptions: { crossOrigin: "anonymous", margin: 20 },
            });
        }

        // 2. Append to Container if available
        if (qrContainer && qrCodeRef.current) {
            qrContainer.innerHTML = "";
            qrCodeRef.current.append(qrContainer);

            // 3. FORCE UPDATE: Ensure it renders immediately after appending
            if (shortUrl) {
                const finalOptions: Partial<QRCodeOptions> = {
                    data: shortUrl,
                    ...mergedOptions,
                };
                qrCodeRef.current.update(finalOptions);
            }
        }
    }, [qrContainer, rightTab, shortUrl, mergedOptions]); // Re-run when container mounts or tab changes

    // React to Option Changes (Updates existing instance)
    useEffect(() => {
        if (!qrCodeRef.current || !shortUrl) return;

        const finalOptions: Partial<QRCodeOptions> = {
            data: shortUrl,
            ...mergedOptions,
        };

        qrCodeRef.current.update(finalOptions);
    }, [shortUrl, mergedOptions]);

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
                designStats: { selectedStyle, customOptions }, // Initial design stats (default)
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            });

            if (result.success && result.id) {
                setShortId(result.id);
                // Set QR data to the short URL
                const domain = process.env.NEXT_PUBLIC_SHORT_DOMAIN;
                const finalUrl = `${domain}/${result.id}`;
                setShortUrl(finalUrl);
                setStep(2);
                setRightTab("qr");
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
            let finalCustomOptions = { ...customOptions };

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
                        setCustomOptions(prev => ({ ...prev, image: uploadRes.publicUrl }));
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
            const result = await updateQRCode(shortId, {
                designStats: { selectedStyle, customOptions: finalCustomOptions },
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

    //Design handle
    const updateCustomOption = (category: keyof QRCodeOptions, key: string, value: any) => {
        setCustomOptions(prev => ({
            ...prev,
            [category]: { ...(prev[category] as any || {}), [key]: value }
        }));
    };

    //Design image handle
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file); // Store file for upload on save
            const reader = new FileReader();
            reader.onload = () => {
                setCustomOptions(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
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
        if (t === "couponPage") {
            setData(DEFAULT_COUPON);
            setRightTab("preview");
        } else if (t === "businessCard") {
            setData(DEFAULT_BUSINESS_CARD);
            setRightTab("preview");
        } else if (t === "menuCard") {
            setData(DEFAULT_MENU);
            setRightTab("preview");
        } else if (t === "eventPage") {
            setData(DEFAULT_EVENT_PAGE);
            setRightTab("preview");
        } else if (t === "marketingPage") {
            setData(DEFAULT_MARKETING);
            setRightTab("preview");
        } else if (t === "textPage") {
            setData(DEFAULT_TEXT_PAGE);
            setRightTab("preview");
        } else if (t === "social") {
            setData({ platforms: [{ platform: "instagram", url: "" }] });
            setRightTab("preview");
        } else if (t === "app") {
            setData({ ios: "", android: "", fallback: "" });
            setRightTab("preview");
        } else if (t === "payment") {
            setData({ recipient: "", amount: "", currency: "USD" });
            setRightTab("preview");
        } else {
            setData({});
            setRightTab("preview");
        }
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
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold mb-1">Customize Your QR Code</h2>
                                        <p className="text-sm text-muted-foreground">Make your QR code unique with colors, patterns, and logos</p>
                                    </div>

                                    {/* 0. Presets */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold flex items-center gap-2"><LayoutTemplate className="w-4 h-4" /> Templates</h3>
                                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 border rounded-lg p-2 bg-muted/20">
                                            {QR_CATEGORIES.map((cat) => (
                                                <div key={cat.id} className="space-y-2">
                                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider sticky top-0 bg-background/95 p-1 backdrop-blur-sm z-10">{cat.label}</h4>
                                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                                        {cat.styles.map((style) => (
                                                            <button
                                                                key={style.name}
                                                                onClick={() => {
                                                                    setSelectedStyle(style.name);
                                                                    setCustomOptions({});
                                                                }}
                                                                className={cn(
                                                                    "flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all hover:bg-accent",
                                                                    selectedStyle === style.name ? "border-primary bg-accent" : "border-transparent bg-background"
                                                                )}
                                                            >
                                                                {/* We could render a mini preview here if we wanted, but for now just text/icon */}
                                                                <div className="w-8 h-8 rounded mb-2 bg-linear-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 border flex items-center justify-center">
                                                                    {/* Simple visual indicator based on style props? Too complex for now. */}
                                                                    <div
                                                                        className="w-4 h-4 rounded-sm"
                                                                        style={{
                                                                            background: style.options.dotsOptions?.color || style.options.backgroundOptions?.color || "#000"
                                                                        }}
                                                                    />
                                                                </div>
                                                                <span className="text-xs font-medium truncate w-full text-center">{style.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 2. Dots */}
                                    <CustomAccordionItem title="Dots" icon={<LayoutGrid className="w-4 h-4" />}>
                                        <div className="space-y-4 pt-2">
                                            <div className="space-y-3">
                                                <Label className="text-sm font-medium">Style</Label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <StyleButton
                                                        icon={<DotsSquareIcon />}
                                                        label="square"
                                                        isActive={mergedOptions.dotsOptions?.type === "square"}
                                                        onClick={() => updateCustomOption('dotsOptions', 'type', 'square')}
                                                    />
                                                    <StyleButton
                                                        icon={<DotsRoundIcon />}
                                                        label="dots"
                                                        isActive={mergedOptions.dotsOptions?.type === "dots"}
                                                        onClick={() => updateCustomOption('dotsOptions', 'type', 'dots')}
                                                    />
                                                    <StyleButton
                                                        icon={<DotsRoundedIcon />}
                                                        label="rounded"
                                                        isActive={mergedOptions.dotsOptions?.type === "rounded"}
                                                        onClick={() => updateCustomOption('dotsOptions', 'type', 'rounded')}
                                                    />
                                                    <StyleButton
                                                        icon={<DotsExtraRoundedIcon />}
                                                        label="extra rounded"
                                                        isActive={mergedOptions.dotsOptions?.type === "extra-rounded"}
                                                        onClick={() => updateCustomOption('dotsOptions', 'type', 'extra-rounded')}
                                                    />
                                                    <StyleButton
                                                        icon={<DotsClassyIcon />}
                                                        label="classy"
                                                        isActive={mergedOptions.dotsOptions?.type === "classy"}
                                                        onClick={() => updateCustomOption('dotsOptions', 'type', 'classy')}
                                                    />
                                                    <StyleButton
                                                        icon={<DotsClassyRoundedIcon />}
                                                        label="classy rounded"
                                                        isActive={mergedOptions.dotsOptions?.type === "classy-rounded"}
                                                        onClick={() => updateCustomOption('dotsOptions', 'type', 'classy-rounded')}
                                                    />
                                                </div>
                                            </div>


                                            <div className="space-y-3">
                                                <Label className="text-sm font-medium">Color</Label>
                                                <Tabs defaultValue={mergedOptions.dotsOptions?.gradient ? "gradient" : "solid"} onValueChange={(v) => {
                                                    if (v === "solid") {
                                                        updateCustomOption('dotsOptions', 'gradient', undefined);
                                                        updateCustomOption('dotsOptions', 'color', "#000000");
                                                    } else {
                                                        updateCustomOption('dotsOptions', 'color', undefined);
                                                        updateCustomOption('dotsOptions', 'gradient', {
                                                            type: "linear",
                                                            rotation: 0,
                                                            colorStops: [{ offset: 0, color: "#000000" }, { offset: 1, color: "#000000" }]
                                                        });
                                                    }
                                                }}>
                                                    <TabsList className="grid w-full grid-cols-2">
                                                        <TabsTrigger value="solid">Solid</TabsTrigger>
                                                        <TabsTrigger value="gradient">Gradient</TabsTrigger>
                                                    </TabsList>
                                                    <TabsContent value="solid" className="mt-3">
                                                        <div className="flex gap-3">
                                                            <Input type="color" className="w-14 h-10 p-1 cursor-pointer" value={mergedOptions.dotsOptions?.color || "#000000"} onChange={(e) => updateCustomOption('dotsOptions', 'color', e.target.value)} />
                                                            <Input value={mergedOptions.dotsOptions?.color || "#000000"} onChange={(e) => updateCustomOption('dotsOptions', 'color', e.target.value)} className="font-mono" />
                                                        </div>
                                                    </TabsContent>
                                                    <TabsContent value="gradient" className="mt-3 space-y-4">
                                                        <div className="flex gap-3">
                                                            <Button size="sm" variant={mergedOptions.dotsOptions?.gradient?.type === "linear" ? "default" : "outline"} onClick={() => {
                                                                const current = mergedOptions.dotsOptions?.gradient || { colorStops: [], rotation: 0 };
                                                                updateCustomOption('dotsOptions', 'gradient', { ...current, type: "linear" });
                                                            }}>Linear</Button>
                                                            <Button size="sm" variant={mergedOptions.dotsOptions?.gradient?.type === "radial" ? "default" : "outline"} onClick={() => {
                                                                const current = mergedOptions.dotsOptions?.gradient || { colorStops: [], rotation: 0 };
                                                                updateCustomOption('dotsOptions', 'gradient', { ...current, type: "radial" });
                                                            }}>Radial</Button>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs font-medium">Start Color</Label>
                                                                <div className="flex gap-2">
                                                                    <Input
                                                                        type="color"
                                                                        className="w-12 h-9 p-1 cursor-pointer"
                                                                        value={mergedOptions.dotsOptions?.gradient?.colorStops?.[0]?.color || "#000000"}
                                                                        onChange={(e) => {
                                                                            const current = mergedOptions.dotsOptions?.gradient || { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#000000" }, { offset: 1, color: "#000000" }] };
                                                                            const newStops = [...(current.colorStops || [])];
                                                                            newStops[0] = { offset: 0, color: e.target.value };
                                                                            updateCustomOption('dotsOptions', 'gradient', { ...current, colorStops: newStops });
                                                                        }}
                                                                    />
                                                                    <Input
                                                                        value={mergedOptions.dotsOptions?.gradient?.colorStops?.[0]?.color || "#000000"}
                                                                        onChange={(e) => {
                                                                            const current = mergedOptions.dotsOptions?.gradient || { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#000000" }, { offset: 1, color: "#000000" }] };
                                                                            const newStops = [...(current.colorStops || [])];
                                                                            newStops[0] = { offset: 0, color: e.target.value };
                                                                            updateCustomOption('dotsOptions', 'gradient', { ...current, colorStops: newStops });
                                                                        }}
                                                                        className="font-mono text-xs"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs font-medium">End Color</Label>
                                                                <div className="flex gap-2">
                                                                    <Input
                                                                        type="color"
                                                                        className="w-12 h-9 p-1 cursor-pointer"
                                                                        value={mergedOptions.dotsOptions?.gradient?.colorStops?.[1]?.color || "#000000"}
                                                                        onChange={(e) => {
                                                                            const current = mergedOptions.dotsOptions?.gradient || { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#000000" }, { offset: 1, color: "#000000" }] };
                                                                            const newStops = [...(current.colorStops || [])];
                                                                            if (!newStops[1]) newStops[1] = { offset: 1, color: e.target.value };
                                                                            else newStops[1] = { ...newStops[1], color: e.target.value };
                                                                            updateCustomOption('dotsOptions', 'gradient', { ...current, colorStops: newStops });
                                                                        }}
                                                                    />
                                                                    <Input
                                                                        value={mergedOptions.dotsOptions?.gradient?.colorStops?.[1]?.color || "#000000"}
                                                                        onChange={(e) => {
                                                                            const current = mergedOptions.dotsOptions?.gradient || { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#000000" }, { offset: 1, color: "#000000" }] };
                                                                            const newStops = [...(current.colorStops || [])];
                                                                            if (!newStops[1]) newStops[1] = { offset: 1, color: e.target.value };
                                                                            else newStops[1] = { ...newStops[1], color: e.target.value };
                                                                            updateCustomOption('dotsOptions', 'gradient', { ...current, colorStops: newStops });
                                                                        }}
                                                                        className="font-mono text-xs"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-medium">Rotation: {Math.round((mergedOptions.dotsOptions?.gradient?.rotation || 0) * 180 / Math.PI)}°</Label>
                                                            <Slider
                                                                min={0} max={360} step={15}
                                                                value={[Math.round((mergedOptions.dotsOptions?.gradient?.rotation || 0) * 180 / Math.PI)]}
                                                                onValueChange={(vals) => {
                                                                    const current = mergedOptions.dotsOptions?.gradient || { type: "linear", colorStops: [] };
                                                                    updateCustomOption('dotsOptions', 'gradient', { ...current, rotation: vals[0] * (Math.PI / 180) });
                                                                }}
                                                            />
                                                        </div>
                                                    </TabsContent>
                                                </Tabs>
                                            </div>
                                        </div>
                                    </CustomAccordionItem>

                                    {/* 3. Corners */}
                                    <CustomAccordionItem title="Corners" icon={<Shapes className="w-4 h-4" />}>
                                        <div className="space-y-4 pt-2">
                                            {/* Corner Square */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-medium">Corner Border Style</Label>
                                                <div className="grid grid-cols-4 gap-3">
                                                    <StyleButton
                                                        icon={<CornerSquareIcon />}
                                                        label="square"
                                                        isActive={mergedOptions.cornersSquareOptions?.type === "square"}
                                                        onClick={() => updateCustomOption('cornersSquareOptions', 'type', 'square')}
                                                    />
                                                    <StyleButton
                                                        icon={<CornerDotIcon />}
                                                        label="dot"
                                                        isActive={mergedOptions.cornersSquareOptions?.type === "dot"}
                                                        onClick={() => updateCustomOption('cornersSquareOptions', 'type', 'dot')}
                                                    />
                                                    <StyleButton
                                                        icon={<CornerExtraRoundedIcon />}
                                                        label="extra rounded"
                                                        isActive={mergedOptions.cornersSquareOptions?.type === "extra-rounded"}
                                                        onClick={() => updateCustomOption('cornersSquareOptions', 'type', 'extra-rounded')}
                                                    />
                                                    <StyleButton
                                                        icon={<CornerNoneIcon />}
                                                        label="none"
                                                        isActive={!mergedOptions.cornersSquareOptions?.type}
                                                        onClick={() => updateCustomOption('cornersSquareOptions', 'type', undefined)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm">Border Color</Label>
                                                <div className="flex gap-2">
                                                    <Input type="color" className="w-12 h-9 p-1" value={mergedOptions.cornersSquareOptions?.color || "#000000"} onChange={(e) => updateCustomOption('cornersSquareOptions', 'color', e.target.value)} />
                                                    <Input value={mergedOptions.cornersSquareOptions?.color || "#000000"} onChange={(e) => updateCustomOption('cornersSquareOptions', 'color', e.target.value)} />
                                                </div>
                                            </div>

                                            {/* Corner Dot */}
                                            <div className="space-y-3 pt-4 border-t">
                                                <Label className="text-sm font-medium">Corner Center Style</Label>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <StyleButton
                                                        icon={<CornerCenterSquareIcon />}
                                                        label="square"
                                                        isActive={mergedOptions.cornersDotOptions?.type === "square"}
                                                        onClick={() => updateCustomOption('cornersDotOptions', 'type', 'square')}
                                                    />
                                                    <StyleButton
                                                        icon={<CornerCenterDotIcon />}
                                                        label="dot"
                                                        isActive={mergedOptions.cornersDotOptions?.type === "dot"}
                                                        onClick={() => updateCustomOption('cornersDotOptions', 'type', 'dot')}
                                                    />
                                                    <StyleButton
                                                        icon={<CornerNoneIcon />}
                                                        label="none"
                                                        isActive={!mergedOptions.cornersDotOptions?.type}
                                                        onClick={() => updateCustomOption('cornersDotOptions', 'type', undefined)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm">Center Color</Label>
                                                <div className="flex gap-2">
                                                    <Input type="color" className="w-12 h-9 p-1" value={mergedOptions.cornersDotOptions?.color || "#000000"} onChange={(e) => updateCustomOption('cornersDotOptions', 'color', e.target.value)} />
                                                    <Input value={mergedOptions.cornersDotOptions?.color || "#000000"} onChange={(e) => updateCustomOption('cornersDotOptions', 'color', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </CustomAccordionItem>

                                    {/* 4. Background */}
                                    <CustomAccordionItem title="Background" icon={<Palette className="w-4 h-4" />}>
                                        <div className="space-y-4 pt-2">
                                            <Tabs defaultValue={mergedOptions.backgroundOptions?.gradient ? "gradient" : "solid"} onValueChange={(v) => {
                                                if (v === "solid") {
                                                    updateCustomOption('backgroundOptions', 'gradient', undefined);
                                                    updateCustomOption('backgroundOptions', 'color', "#ffffff");
                                                } else {
                                                    updateCustomOption('backgroundOptions', 'color', undefined);
                                                    updateCustomOption('backgroundOptions', 'gradient', {
                                                        type: "linear",
                                                        rotation: 0,
                                                        colorStops: [{ offset: 0, color: "#ffffff" }, { offset: 1, color: "#ffffff" }]
                                                    });
                                                }
                                            }}>
                                                <TabsList className="grid w-full grid-cols-2">
                                                    <TabsTrigger value="solid">Solid</TabsTrigger>
                                                    <TabsTrigger value="gradient">Gradient</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="solid" className="mt-2">
                                                    <div className="flex gap-2">
                                                        <Input type="color" className="w-12 h-9 p-1" value={mergedOptions.backgroundOptions?.color || "#ffffff"} onChange={(e) => updateCustomOption('backgroundOptions', 'color', e.target.value)} />
                                                        <Input value={mergedOptions.backgroundOptions?.color || "#ffffff"} onChange={(e) => updateCustomOption('backgroundOptions', 'color', e.target.value)} />
                                                    </div>
                                                </TabsContent>
                                                <TabsContent value="gradient" className="mt-2 space-y-3">
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant={mergedOptions.backgroundOptions?.gradient?.type === "linear" ? "default" : "outline"} onClick={() => {
                                                            const current = mergedOptions.backgroundOptions?.gradient || { colorStops: [], rotation: 0 };
                                                            updateCustomOption('backgroundOptions', 'gradient', { ...current, type: "linear" });
                                                        }}>Linear</Button>
                                                        <Button size="sm" variant={mergedOptions.backgroundOptions?.gradient?.type === "radial" ? "default" : "outline"} onClick={() => {
                                                            const current = mergedOptions.backgroundOptions?.gradient || { colorStops: [], rotation: 0 };
                                                            updateCustomOption('backgroundOptions', 'gradient', { ...current, type: "radial" });
                                                        }}>Radial</Button>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="space-y-1">
                                                            <Label className="text-xs">Start</Label>
                                                            <Input type="color" className="w-full h-8 p-1" value={mergedOptions.backgroundOptions?.gradient?.colorStops?.[0]?.color || "#ffffff"} onChange={(e) => {
                                                                const current = mergedOptions.backgroundOptions?.gradient || { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#ffffff" }, { offset: 1, color: "#ffffff" }] };
                                                                const newStops = [...(current.colorStops || [])];
                                                                newStops[0] = { offset: 0, color: e.target.value };
                                                                updateCustomOption('backgroundOptions', 'gradient', { ...current, colorStops: newStops });
                                                            }} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label className="text-xs">End</Label>
                                                            <Input type="color" className="w-full h-8 p-1" value={mergedOptions.backgroundOptions?.gradient?.colorStops?.[1]?.color || "#ffffff"} onChange={(e) => {
                                                                const current = mergedOptions.backgroundOptions?.gradient || { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#ffffff" }, { offset: 1, color: "#ffffff" }] };
                                                                const newStops = [...(current.colorStops || [])];
                                                                if (!newStops[1]) newStops[1] = { offset: 1, color: e.target.value };
                                                                else newStops[1] = { ...newStops[1], color: e.target.value };
                                                                updateCustomOption('backgroundOptions', 'gradient', { ...current, colorStops: newStops });
                                                            }} />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Rotation ({Math.round((mergedOptions.backgroundOptions?.gradient?.rotation || 0) * 180 / Math.PI)}°)</Label>
                                                        <Slider
                                                            min={0} max={360} step={15}
                                                            value={[Math.round((mergedOptions.backgroundOptions?.gradient?.rotation || 0) * 180 / Math.PI)]}
                                                            onValueChange={(vals) => {
                                                                const current = mergedOptions.backgroundOptions?.gradient || { type: "linear", colorStops: [] };
                                                                updateCustomOption('backgroundOptions', 'gradient', { ...current, rotation: vals[0] * (Math.PI / 180) });
                                                            }}
                                                        />
                                                    </div>
                                                </TabsContent>
                                            </Tabs>
                                        </div>
                                    </CustomAccordionItem>

                                    {/* 3. Logo/Image */}
                                    <CustomAccordionItem title="Logo" icon={<ImageIcon className="w-4 h-4" />}>
                                        <div className="space-y-4 pt-2">
                                            <div className="space-y-3">
                                                <Label>Upload Logo</Label>
                                                <Input type="file" accept="image/*" onChange={handleImageUpload} />
                                                <div className="space-y-2">
                                                    <Label>Logo Margin</Label>
                                                    <Slider defaultValue={[0]} max={20} step={1} onValueChange={(vals) => updateCustomOption('imageOptions', 'margin', vals[0])} />
                                                </div>
                                            </div>
                                        </div>
                                    </CustomAccordionItem>

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
                            (<Card className="border-none shadow-none py-0">
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
