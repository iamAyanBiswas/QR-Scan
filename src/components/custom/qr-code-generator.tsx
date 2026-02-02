"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling, {
    FileExtension,
    Options as QRCodeOptions,
    DotType,
    CornerSquareType,
} from "qr-code-styling";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Download, Upload, Palette, Shapes, Image as ImageIcon, LayoutGrid } from "lucide-react";
import { ALL_STYLES as PREMIUM_STYLES, QR_CATEGORIES, QRStyle } from "@/lib/qr-styles";
import { cn } from "@/lib/utils";

type QRType = "url" | "text" | "vcard" | "wifi" | "email" | "phone" | "sms" | "whatsapp" | "event" | "location";

const InputField = ({
    name,
    placeholder,
    label,
    value,
    onChange,
    type = "text",
}: {
    name: string;
    placeholder: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}) => (
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

export default function QRCodeGenerator() {
    const [type, setType] = useState<QRType>("url");
    const [data, setData] = useState<Record<string, string>>({});
    const [selectedStyle, setSelectedStyle] = useState<string>("classic-black");
    const [customOptions, setCustomOptions] = useState<Partial<QRCodeOptions>>({});
    const ref = useRef<HTMLDivElement>(null);
    const qrCodeRef = useRef<QRCodeStyling | null>(null);

    // Initialize QR code
    useEffect(() => {
        // Only initialize if not already initialized
        if (!qrCodeRef.current) {
            qrCodeRef.current = new QRCodeStyling({
                width: 300,
                height: 300,
                image: "",
                dotsOptions: {
                    color: "#000000",
                    type: "rounded",
                },
                imageOptions: {
                    crossOrigin: "anonymous",
                    margin: 20,
                },
            });
        }

        // Append to div
        if (ref.current) {
            ref.current.innerHTML = ""; // Clear existing
            qrCodeRef.current.append(ref.current);
        }
    }, []);

    // Update QR code when data changes
    useEffect(() => {
        if (!qrCodeRef.current) return;

        let qrData = "";

        switch (type) {
            case "url":
                qrData = data.value || "";
                if (qrData && !qrData.startsWith("http://") && !qrData.startsWith("https://")) {
                    qrData = `https://${qrData}`;
                }
                break;
            case "text":
                qrData = data.value || "";
                break;
            case "vcard":
                qrData = `BEGIN:VCARD\nVERSION:3.0\nN:${data.lastName || ""};${data.firstName || ""}\nFN:${data.firstName || ""} ${data.lastName || ""}\nORG:${data.org || ""}\nTITLE:${data.title || ""}\nTEL;TYPE=WORK,VOICE:${data.phone || ""}\nEMAIL:${data.email || ""}\nURL:${data.url || ""}\nEND:VCARD`;
                break;
            case "wifi":
                qrData = `WIFI:T:${data.encryption || "WPA"};S:${data.ssid || ""};P:${data.password || ""};;`;
                break;
            case "email":
                qrData = `mailto:${data.email || ""}?subject=${encodeURIComponent(data.subject || "")}&body=${encodeURIComponent(data.body || "")}`;
                break;
            case "phone":
                qrData = `tel:${data.phone || ""}`;
                break;
            case "sms":
                qrData = `SMSTO:${data.phone || ""}:${data.message || ""}`;
                break;
            case "whatsapp":
                qrData = `https://wa.me/${data.phone || ""}?text=${encodeURIComponent(data.message || "")}`;
                break;
            case "event":
                qrData = `BEGIN:VEVENT\nSUMMARY:${data.summary || ""}\nLOCATION:${data.location || ""}\nDESCRIPTION:${data.description || ""}\nDTSTART:${(data.start || "").replace(/[-:]/g, "")}\nDTEND:${(data.end || "").replace(/[-:]/g, "")}\nEND:VEVENT`;
                break;
            case "location":
                qrData = `geo:${data.latitude || ""},${data.longitude || ""}`;
                break;
        }

        // Merge Template Options with Custom Overrides
        const templateOptions = PREMIUM_STYLES.find(s => s.name === selectedStyle)?.options || {};

        // Deep merge helper could be better, but spreading works for top-level option groups
        // For deeper merge (like dotsOptions.color vs dotsOptions.type), we need to be careful.
        // The current strategy: Custom options take absolute precedence if defined.

        const finalOptions: Partial<QRCodeOptions> = {
            data: qrData,
            ...templateOptions,
            ...customOptions,
            dotsOptions: { ...templateOptions.dotsOptions, ...customOptions.dotsOptions },
            cornersSquareOptions: { ...templateOptions.cornersSquareOptions, ...customOptions.cornersSquareOptions },
            cornersDotOptions: { ...templateOptions.cornersDotOptions, ...customOptions.cornersDotOptions },
            backgroundOptions: { ...templateOptions.backgroundOptions, ...customOptions.backgroundOptions },
            imageOptions: { ...templateOptions.imageOptions, ...customOptions.imageOptions },
        };

        qrCodeRef.current.update(finalOptions);
    }, [data, type, selectedStyle, customOptions]);

    const handleDownload = (extension: FileExtension) => {
        if (qrCodeRef.current) {
            qrCodeRef.current.download({
                extension: extension,
            });
        }
    };

    const handleChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prev) => ({ ...prev, [name]: e.target.value }));
    };

    const updateCustomOption = (category: keyof QRCodeOptions, key: string, value: any) => {
        setCustomOptions(prev => ({
            ...prev,
            [category]: {
                ...(prev[category] as any || {}),
                [key]: value
            }
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCustomOptions(prev => ({
                    ...prev,
                    image: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto p-4">

            {/* LEFT COLUMN: Configuration */}
            <div className="lg:col-span-7 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>QR Configuration</CardTitle>
                        <CardDescription>Step-by-step customization.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="content" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6">
                                <TabsTrigger value="content"><LayoutGrid className="w-4 h-4 mr-2" /> Content</TabsTrigger>
                                <TabsTrigger value="design"><Palette className="w-4 h-4 mr-2" /> Templates</TabsTrigger>
                                <TabsTrigger value="customize"><Shapes className="w-4 h-4 mr-2" /> Customize</TabsTrigger>
                            </TabsList>

                            {/* CONTENT TAB */}
                            <TabsContent value="content" className="space-y-6">
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                    {(["url", "text", "vcard", "wifi", "email", "phone", "sms", "whatsapp", "event", "location"] as QRType[]).map((t) => (
                                        <Button
                                            key={t}
                                            variant={type === t ? "default" : "outline"}
                                            onClick={() => { setType(t); setData({}); }}
                                            className="capitalize text-xs p-2 h-auto"
                                        >
                                            {t === "vcard" ? "Contact" : t}
                                        </Button>
                                    ))}
                                </div>
                                {/* Input Fields (Simplified for brevity, assuming standard inputs logic matches previous setup) */}
                                <div className="space-y-4">
                                    {(type === "url" || type === "text") && <InputField name="value" label={type === "url" ? "Website URL" : "Text"} placeholder="Enter content..." value={data.value || ""} onChange={handleChange("value")} />}
                                    {type === "email" && <><InputField name="email" label="Email" placeholder="user@example.com" value={data.email || ""} onChange={handleChange("email")} /><InputField name="subject" label="Subject" placeholder="..." value={data.subject || ""} onChange={handleChange("subject")} /><InputField name="body" label="Body" placeholder="..." value={data.body || ""} onChange={handleChange("body")} /></>}
                                    {type === "phone" && <InputField name="phone" label="Phone" placeholder="+123..." value={data.phone || ""} onChange={handleChange("phone")} />}
                                    {(type === "sms" || type === "whatsapp") && <><InputField name="phone" label="Phone" placeholder="+123..." value={data.phone || ""} onChange={handleChange("phone")} /><InputField name="message" label="Message" placeholder="..." value={data.message || ""} onChange={handleChange("message")} /></>}
                                    {type === "location" && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField name="latitude" label="Latitude" placeholder="40.7128" value={data.latitude || ""} onChange={handleChange("latitude")} />
                                            <InputField name="longitude" label="Longitude" placeholder="-74.0060" value={data.longitude || ""} onChange={handleChange("longitude")} />
                                        </div>
                                    )}
                                    {type === "event" && (
                                        <div className="space-y-4">
                                            <InputField name="summary" label="Event Title" placeholder="Meeting" value={data.summary || ""} onChange={handleChange("summary")} />
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="start">Start Time</Label>
                                                    <Input id="start" type="datetime-local" value={data.start || ""} onChange={(e) => setData({ ...data, start: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="end">End Time</Label>
                                                    <Input id="end" type="datetime-local" value={data.end || ""} onChange={(e) => setData({ ...data, end: e.target.value })} />
                                                </div>
                                            </div>
                                            <InputField name="location" label="Location" placeholder="Office" value={data.location || ""} onChange={handleChange("location")} />
                                            <InputField name="description" label="Description" placeholder="Details..." value={data.description || ""} onChange={handleChange("description")} />
                                        </div>
                                    )}
                                    {type === "vcard" && (
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <InputField
                                                    name="firstName"
                                                    label="First Name"
                                                    placeholder="John"
                                                    value={data.firstName || ""}
                                                    onChange={handleChange("firstName")}
                                                />
                                                <InputField
                                                    name="lastName"
                                                    label="Last Name"
                                                    placeholder="Doe"
                                                    value={data.lastName || ""}
                                                    onChange={handleChange("lastName")}
                                                />
                                            </div>
                                            <InputField
                                                name="phone"
                                                label="Phone"
                                                placeholder="+1 234 567 890"
                                                value={data.phone || ""}
                                                onChange={handleChange("phone")}
                                            />
                                            <InputField
                                                name="email"
                                                label="Email"
                                                placeholder="john@example.com"
                                                value={data.email || ""}
                                                onChange={handleChange("email")}
                                            />
                                            <InputField
                                                name="org"
                                                label="Organization"
                                                placeholder="Acme Inc."
                                                value={data.org || ""}
                                                onChange={handleChange("org")}
                                            />
                                            <InputField
                                                name="title"
                                                label="Job Title"
                                                placeholder="Developer"
                                                value={data.title || ""}
                                                onChange={handleChange("title")}
                                            />
                                            <InputField
                                                name="url"
                                                label="Website"
                                                placeholder="https://example.com"
                                                value={data.url || ""}
                                                onChange={handleChange("url")}
                                            />
                                        </div>
                                    )}
                                    {type === "wifi" && (
                                        <div className="space-y-4">
                                            <InputField
                                                name="ssid"
                                                label="Network Name (SSID)"
                                                placeholder="MyWiFi"
                                                value={data.ssid || ""}
                                                onChange={handleChange("ssid")}
                                            />
                                            <InputField
                                                name="password"
                                                label="Password"
                                                placeholder="SecretPassword"
                                                type="password"
                                                value={data.password || ""}
                                                onChange={handleChange("password")}
                                            />
                                            <div className="space-y-2">
                                                <Label>Encryption</Label>
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                                    value={data.encryption || "WPA"}
                                                    onChange={(e) =>
                                                        setData({ ...data, encryption: e.target.value })
                                                    }
                                                >
                                                    <option value="WPA">WPA/WPA2</option>
                                                    <option value="WEP">WEP</option>
                                                    <option value="nopass">None</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* DESIGN TAB */}
                            <TabsContent value="design" className="space-y-8">
                                {QR_CATEGORIES.map((cat) => (
                                    <div key={cat.id} className="space-y-3">
                                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">{cat.label}</h3>
                                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                            {cat.styles.map((style) => (
                                                <div
                                                    key={style.name}
                                                    className={cn(
                                                        "cursor-pointer group relative flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all hover:bg-muted",
                                                        selectedStyle === style.name ? "border-primary bg-primary/5" : "border-transparent"
                                                    )}
                                                    onClick={() => {
                                                        setSelectedStyle(style.name);
                                                        // Ideally, clearing customOptions on template switch or keeping them is a UX choice.
                                                        // For now, let's keep customizing on top.
                                                    }}
                                                >
                                                    <div className="w-8 h-8 rounded-full shadow-sm ring-1 ring-border"
                                                        style={{ background: style.options.dotsOptions?.color || "black" }}
                                                    />
                                                    <span className="text-[10px] text-center font-medium leading-none truncate w-full">{style.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </TabsContent>

                            {/* CUSTOMIZE TAB */}
                            <TabsContent value="customize" className="space-y-6">

                                {/* 1. Colors */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold flex items-center gap-2"><Palette className="w-4 h-4" /> Colors</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Dots Color</Label>
                                            <div className="flex gap-2">
                                                <Input type="color" className="w-12 h-9 p-1"
                                                    onChange={(e) => updateCustomOption('dotsOptions', 'color', e.target.value)} />
                                                <Input placeholder="#000000" onChange={(e) => updateCustomOption('dotsOptions', 'color', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Background</Label>
                                            <div className="flex gap-2">
                                                <Input type="color" className="w-12 h-9 p-1"
                                                    onChange={(e) => updateCustomOption('backgroundOptions', 'color', e.target.value)} />
                                                <Input placeholder="#ffffff" onChange={(e) => updateCustomOption('backgroundOptions', 'color', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Shapes */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold flex items-center gap-2"><Shapes className="w-4 h-4" /> Shapes</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Dots Style</Label>
                                            <select className="w-full p-2 border rounded-md bg-background"
                                                onChange={(e) => updateCustomOption('dotsOptions', 'type', e.target.value as DotType)}>
                                                <option value="square">Square</option>
                                                <option value="dots">Dots</option>
                                                <option value="rounded">Rounded</option>
                                                <option value="extra-rounded">Extra Rounded</option>
                                                <option value="classy">Classy</option>
                                                <option value="classy-rounded">Classy Rounded</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Corner Style</Label>
                                            <select className="w-full p-2 border rounded-md bg-background"
                                                onChange={(e) => updateCustomOption('cornersSquareOptions', 'type', e.target.value as CornerSquareType)}>
                                                <option value="square">Square</option>
                                                <option value="dot">Dot</option>
                                                <option value="extra-rounded">Extra Rounded</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Logo/Image */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Logo</h3>
                                    <div className="space-y-3">
                                        <Label>Upload Logo</Label>
                                        <Input type="file" accept="image/*" onChange={handleImageUpload} />
                                        <div className="space-y-2">
                                            <Label>Logo Margin</Label>
                                            <Slider defaultValue={[0]} max={20} step={1}
                                                onValueChange={(vals) => updateCustomOption('imageOptions', 'margin', vals[0])} />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT COLUMN: Preview */}
            <div className="lg:col-span-5">
                <div className="sticky top-6 space-y-4">
                    <Card className="overflow-hidden border-2 border-primary/10 shadow-xl bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                        <CardContent className="flex flex-col items-center justify-center p-8 min-h-96">
                            <div ref={ref} className="bg-white p-4 rounded-xl shadow-sm" />
                            <p className="mt-6 text-sm text-muted-foreground text-center animate-pulse">
                                Scanning for greatness...
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-3">
                        <Button onClick={() => handleDownload("png")} className="w-full" size="lg">
                            <Download className="w-4 h-4 mr-2" /> PNG
                        </Button>
                        <Button onClick={() => handleDownload("svg")} variant="outline" className="w-full" size="lg">
                            <Download className="w-4 h-4 mr-2" /> SVG
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
