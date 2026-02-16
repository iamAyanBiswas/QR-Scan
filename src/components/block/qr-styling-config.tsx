"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { LayoutGrid, Shapes, Palette, Image as ImageIcon, LayoutTemplate, ChevronDown, ChevronRight } from "lucide-react";
import { QR_CATEGORIES } from "@/lib/qr-styles";
import { cn } from "@/lib/utils";
import { StyleButton } from "@/components/custom/style-button";
import { DotsSquareIcon, DotsRoundIcon, DotsRoundedIcon, DotsExtraRoundedIcon, DotsClassyIcon, DotsClassyRoundedIcon, CornerSquareIcon, CornerDotIcon, CornerExtraRoundedIcon, CornerNoneIcon, CornerCenterSquareIcon, CornerCenterDotIcon } from "@/components/custom/qr-style-icons";
import { useQrStyleStore } from "@/store/qr-style-store";


interface CustomAccordionItemProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

function CustomAccordionItem({ title, icon, children }: CustomAccordionItemProps) {
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

export function QRStylingConfig() {
    const inputRef = useRef<HTMLInputElement>(null)
    const {
        qrCodeStyle,
        updateTemplate,
        setDotsType,
        setDotsColor,
        setDotsGradient,
        setCornersSquareType,
        setCornersSquareColor,
        setCornersDotType,
        setCornersDotColor,
        setBackgroundColor,
        setBackgroundGradient,
        setImage,
        setImageHideBackgroundDots,
        setImageMargin,
        setPublicImage,
        setLogoFile,
        setQrCodeStyle,
    } = useQrStyleStore();

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImageHideBackgroundDots(true);
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setLogoFile(null);
        }
    };
    const handleClearImage = () => {
        setLogoFile(null)
        setImage("")

        if (inputRef.current) {
            inputRef.current.value = ""
        }
    }


    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-1">Customize Your QR Code</h2>
                <p className="text-sm text-muted-foreground">Make your QR code unique with colors, patterns, and logos</p>
            </div>
            {/* Templates */}
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
                                        onClick={() => { updateTemplate(style.name); handleClearImage() }}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all hover:bg-accent",
                                            qrCodeStyle.template === style.name ? "border-primary bg-accent" : "border-transparent bg-background"
                                        )}
                                    >
                                        <div className="w-8 h-8 rounded mb-2 bg-linear-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 border flex items-center justify-center">
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

            {/* Dots Configuration */}
            <CustomAccordionItem title="Dots" icon={<LayoutGrid className="w-4 h-4" />}>
                <div className="space-y-4 pt-2">
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Style</Label>
                        <div className="grid grid-cols-3 gap-3">
                            <StyleButton
                                icon={<DotsSquareIcon />}
                                label="square"
                                isActive={qrCodeStyle.style.dotsOptions?.type === "square"}
                                onClick={() => setDotsType('square')}
                            />
                            <StyleButton
                                icon={<DotsRoundIcon />}
                                label="dots"
                                isActive={qrCodeStyle.style.dotsOptions?.type === "dots"}
                                onClick={() => setDotsType('dots')}
                            />
                            <StyleButton
                                icon={<DotsRoundedIcon />}
                                label="rounded"
                                isActive={qrCodeStyle.style.dotsOptions?.type === "rounded"}
                                onClick={() => setDotsType('rounded')}
                            />
                            <StyleButton
                                icon={<DotsExtraRoundedIcon />}
                                label="extra rounded"
                                isActive={qrCodeStyle.style.dotsOptions?.type === "extra-rounded"}
                                onClick={() => setDotsType('extra-rounded')}
                            />
                            <StyleButton
                                icon={<DotsClassyIcon />}
                                label="classy"
                                isActive={qrCodeStyle.style.dotsOptions?.type === "classy"}
                                onClick={() => setDotsType('classy')}
                            />
                            <StyleButton
                                icon={<DotsClassyRoundedIcon />}
                                label="classy rounded"
                                isActive={qrCodeStyle.style.dotsOptions?.type === "classy-rounded"}
                                onClick={() => setDotsType('classy-rounded')}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Color</Label>
                        <Tabs value={qrCodeStyle.style.dotsOptions?.gradient ? "gradient" : "solid"} onValueChange={(v) => {
                            if (v === "solid") {
                                setDotsGradient(undefined);
                                setDotsColor(qrCodeStyle.style.dotsOptions?.gradient?.colorStops?.[0]?.color || "#000000");
                            } else {
                                setDotsColor(undefined);
                                setDotsGradient({
                                    type: "linear",
                                    rotation: 0,
                                    colorStops: [{ offset: 0, color: qrCodeStyle.style.dotsOptions?.color || "#000000" }, { offset: 1, color: qrCodeStyle.style.dotsOptions?.color || "#000000" }]
                                });
                            }
                        }}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="solid">Solid</TabsTrigger>
                                <TabsTrigger value="gradient">Gradient</TabsTrigger>
                            </TabsList>
                            <TabsContent value="solid" className="mt-3">
                                <div className="flex gap-3">
                                    <Input type="color" className="w-14 h-10 p-1 cursor-pointer" value={qrCodeStyle.style.dotsOptions?.color || "#000000"} onChange={(e) => setDotsColor(e.target.value)} />
                                    <Input value={qrCodeStyle.style.dotsOptions?.color || "#000000"} onChange={(e) => setDotsColor(e.target.value)} className="font-mono" />
                                </div>
                            </TabsContent>
                            <TabsContent value="gradient" className="mt-3 space-y-4">
                                <div className="flex gap-3">
                                    <Button size="sm" variant={qrCodeStyle.style.dotsOptions?.gradient?.type === "linear" ? "default" : "outline"} onClick={() => {
                                        const current = qrCodeStyle.style.dotsOptions?.gradient || { colorStops: [{ offset: 0, color: "#000000" }, { offset: 1, color: "#000000" }], rotation: 0 };
                                        setDotsGradient({ ...current, type: "linear" });
                                    }}>Linear</Button>
                                    <Button size="sm" variant={qrCodeStyle.style.dotsOptions?.gradient?.type === "radial" ? "default" : "outline"} onClick={() => {
                                        const current = qrCodeStyle.style.dotsOptions?.gradient || { colorStops: [{ offset: 0, color: "#000000" }, { offset: 1, color: "#000000" }], rotation: 0 };
                                        setDotsGradient({ ...current, type: "radial" });
                                    }}>Radial</Button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-medium">Start Color</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="color"
                                                className="w-12 h-9 p-1 cursor-pointer"
                                                value={qrCodeStyle.style.dotsOptions?.gradient?.colorStops?.[0]?.color || "#000000"}
                                                onChange={(e) => {
                                                    const current = qrCodeStyle.style.dotsOptions?.gradient || { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#000000" }, { offset: 1, color: "#000000" }] };
                                                    const newStops = [...(current.colorStops || [])];
                                                    if (!newStops[0]) newStops[0] = { offset: 0, color: e.target.value };
                                                    else newStops[0] = { ...newStops[0], color: e.target.value };
                                                    setDotsGradient({ ...current, colorStops: newStops });
                                                }}
                                            />
                                            <Input
                                                value={qrCodeStyle.style.dotsOptions?.gradient?.colorStops?.[0]?.color || "#000000"}
                                                onChange={(e) => {
                                                    const current = qrCodeStyle.style.dotsOptions?.gradient || { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#000000" }, { offset: 1, color: "#000000" }] };
                                                    const newStops = [...(current.colorStops || [])];
                                                    if (!newStops[0]) newStops[0] = { offset: 0, color: e.target.value };
                                                    else newStops[0] = { ...newStops[0], color: e.target.value };
                                                    setDotsGradient({ ...current, colorStops: newStops });
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
                                                value={qrCodeStyle.style.dotsOptions?.gradient?.colorStops?.[1]?.color || "#000000"}
                                                onChange={(e) => {
                                                    const current = qrCodeStyle.style.dotsOptions?.gradient || { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#000000" }, { offset: 1, color: "#000000" }] };
                                                    const newStops = [...(current.colorStops || [])];
                                                    if (!newStops[1]) newStops[1] = { offset: 1, color: e.target.value };
                                                    else newStops[1] = { ...newStops[1], color: e.target.value };
                                                    setDotsGradient({ ...current, colorStops: newStops });
                                                }}
                                            />
                                            <Input
                                                value={qrCodeStyle.style.dotsOptions?.gradient?.colorStops?.[1]?.color || "#000000"}
                                                onChange={(e) => {
                                                    const current = qrCodeStyle.style.dotsOptions?.gradient || { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#000000" }, { offset: 1, color: "#000000" }] };
                                                    const newStops = [...(current.colorStops || [])];
                                                    if (!newStops[1]) newStops[1] = { offset: 1, color: e.target.value };
                                                    else newStops[1] = { ...newStops[1], color: e.target.value };
                                                    setDotsGradient({ ...current, colorStops: newStops });
                                                }}
                                                className="font-mono text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium">Rotation: {Math.round((qrCodeStyle.style.dotsOptions?.gradient?.rotation || 0) * 180 / Math.PI)}°</Label>
                                    <Slider
                                        min={0} max={360} step={15}
                                        value={[Math.round((qrCodeStyle.style.dotsOptions?.gradient?.rotation || 0) * 180 / Math.PI)]}
                                        onValueChange={(vals) => {
                                            const current = qrCodeStyle.style.dotsOptions?.gradient || { type: "linear", colorStops: [{ offset: 0, color: "#000000" }, { offset: 1, color: "#000000" }], rotation: 0 };
                                            setDotsGradient({ ...current, rotation: vals[0] * (Math.PI / 180) });
                                        }}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </CustomAccordionItem>

            {/* Corners Configuration */}
            <CustomAccordionItem title="Corners" icon={<Shapes className="w-4 h-4" />}>
                <div className="space-y-4 pt-2">
                    {/* Corner Square */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Corner Border Style</Label>
                        <div className="grid grid-cols-4 gap-3">
                            <StyleButton
                                icon={<CornerSquareIcon />}
                                label="square"
                                isActive={qrCodeStyle.style.cornersSquareOptions?.type === "square"}
                                onClick={() => setCornersSquareType('square')}
                            />
                            <StyleButton
                                icon={<CornerDotIcon />}
                                label="dot"
                                isActive={qrCodeStyle.style.cornersSquareOptions?.type === "dot"}
                                onClick={() => setCornersSquareType('dot')}
                            />
                            <StyleButton
                                icon={<CornerExtraRoundedIcon />}
                                label="extra rounded"
                                isActive={qrCodeStyle.style.cornersSquareOptions?.type === "extra-rounded"}
                                onClick={() => setCornersSquareType('extra-rounded')}
                            />
                            <StyleButton
                                icon={<CornerNoneIcon />}
                                label="none"
                                isActive={!qrCodeStyle.style.cornersSquareOptions?.type}
                                onClick={() => setCornersSquareType(undefined)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm">Border Color</Label>
                        <div className="flex gap-2">
                            <Input type="color" className="w-12 h-9 p-1" value={qrCodeStyle.style.cornersSquareOptions?.color || "#000000"} onChange={(e) => setCornersSquareColor(e.target.value)} />
                            <Input value={qrCodeStyle.style.cornersSquareOptions?.color || "#000000"} onChange={(e) => setCornersSquareColor(e.target.value)} />
                        </div>
                    </div>

                    {/* Corner Dot */}
                    <div className="space-y-3 pt-4 border-t">
                        <Label className="text-sm font-medium">Corner Center Style</Label>
                        <div className="grid grid-cols-3 gap-3">
                            <StyleButton
                                icon={<CornerCenterSquareIcon />}
                                label="square"
                                isActive={qrCodeStyle.style.cornersDotOptions?.type === "square"}
                                onClick={() => setCornersDotType('square')}
                            />
                            <StyleButton
                                icon={<CornerCenterDotIcon />}
                                label="dot"
                                isActive={qrCodeStyle.style.cornersDotOptions?.type === "dot"}
                                onClick={() => setCornersDotType('dot')}
                            />
                            <StyleButton
                                icon={<CornerNoneIcon />}
                                label="none"
                                isActive={!qrCodeStyle.style.cornersDotOptions?.type}
                                onClick={() => setCornersDotType(undefined)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm">Center Color</Label>
                        <div className="flex gap-2">
                            <Input type="color" className="w-12 h-9 p-1" value={qrCodeStyle.style.cornersDotOptions?.color || "#000000"} onChange={(e) => setCornersDotColor(e.target.value)} />
                            <Input value={qrCodeStyle.style.cornersDotOptions?.color || "#000000"} onChange={(e) => setCornersDotColor(e.target.value)} />
                        </div>
                    </div>
                </div>
            </CustomAccordionItem>

            {/* Background Configuration */}
            <CustomAccordionItem title="Background" icon={<Palette className="w-4 h-4" />}>
                <div className="space-y-4 pt-2">
                    <Tabs value={qrCodeStyle.style.backgroundOptions?.gradient ? "gradient" : "solid"} onValueChange={(v) => {
                        if (v === "solid") {
                            setBackgroundGradient(undefined);
                            setBackgroundColor(qrCodeStyle.style.backgroundOptions?.gradient?.colorStops?.[0]?.color || "#ffffff");
                        } else {
                            setBackgroundColor(undefined);
                            setBackgroundGradient({
                                type: "linear",
                                rotation: 0,
                                colorStops: [{ offset: 0, color: qrCodeStyle.style.backgroundOptions?.color || "#ffffff" }, { offset: 1, color: qrCodeStyle.style.backgroundOptions?.color || "#ffffff" }]
                            });
                        }
                    }}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="solid">Solid</TabsTrigger>
                            <TabsTrigger value="gradient">Gradient</TabsTrigger>
                        </TabsList>
                        <TabsContent value="solid" className="mt-2">
                            <div className="flex gap-2">
                                <Input type="color" className="w-12 h-9 p-1" value={qrCodeStyle.style.backgroundOptions?.color || "#ffffff"} onChange={(e) => setBackgroundColor(e.target.value)} />
                                <Input value={qrCodeStyle.style.backgroundOptions?.color || "#ffffff"} onChange={(e) => setBackgroundColor(e.target.value)} />
                            </div>
                        </TabsContent>
                        <TabsContent value="gradient" className="mt-2 space-y-3">
                            <div className="flex gap-2">
                                <Button size="sm" variant={qrCodeStyle.style.backgroundOptions?.gradient?.type === "linear" ? "default" : "outline"} onClick={() => {
                                    const current = qrCodeStyle.style.backgroundOptions?.gradient || { colorStops: [{ offset: 0, color: "#ffffff" }, { offset: 1, color: "#ffffff" }], rotation: 0 };
                                    setBackgroundGradient({ ...current, type: "linear" });
                                }}>Linear</Button>
                                <Button size="sm" variant={qrCodeStyle.style.backgroundOptions?.gradient?.type === "radial" ? "default" : "outline"} onClick={() => {
                                    const current = qrCodeStyle.style.backgroundOptions?.gradient || { colorStops: [{ offset: 0, color: "#ffffff" }, { offset: 1, color: "#ffffff" }], rotation: 0 };
                                    setBackgroundGradient({ ...current, type: "radial" });
                                }}>Radial</Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-xs">Start</Label>
                                    <Input type="color" className="w-full h-8 p-1" value={qrCodeStyle.style.backgroundOptions?.gradient?.colorStops?.[0]?.color || "#ffffff"} onChange={(e) => {
                                        const current = qrCodeStyle.style.backgroundOptions?.gradient || { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#ffffff" }, { offset: 1, color: "#ffffff" }] };
                                        const newStops = [...(current.colorStops || [])];
                                        if (!newStops[0]) newStops[0] = { offset: 0, color: e.target.value };
                                        else newStops[0] = { ...newStops[0], color: e.target.value };
                                        setBackgroundGradient({ ...current, colorStops: newStops });
                                    }} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">End</Label>
                                    <Input type="color" className="w-full h-8 p-1" value={qrCodeStyle.style.backgroundOptions?.gradient?.colorStops?.[1]?.color || "#ffffff"} onChange={(e) => {
                                        const current = qrCodeStyle.style.backgroundOptions?.gradient || { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#ffffff" }, { offset: 1, color: "#ffffff" }] };
                                        const newStops = [...(current.colorStops || [])];
                                        if (!newStops[1]) newStops[1] = { offset: 1, color: e.target.value };
                                        else newStops[1] = { ...newStops[1], color: e.target.value };
                                        setBackgroundGradient({ ...current, colorStops: newStops });
                                    }} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Rotation ({Math.round((qrCodeStyle.style.backgroundOptions?.gradient?.rotation || 0) * 180 / Math.PI)}°)</Label>
                                <Slider
                                    min={0} max={360} step={15}
                                    value={[Math.round((qrCodeStyle.style.backgroundOptions?.gradient?.rotation || 0) * 180 / Math.PI)]}
                                    onValueChange={(vals) => {
                                        const current = qrCodeStyle.style.backgroundOptions?.gradient || { type: "linear", colorStops: [{ offset: 0, color: "#ffffff" }, { offset: 1, color: "#ffffff" }] };
                                        setBackgroundGradient({ ...current, rotation: vals[0] * (Math.PI / 180) });
                                    }}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </CustomAccordionItem>

            {/* Logo Configuration */}
            <CustomAccordionItem title="Logo" icon={<ImageIcon className="w-4 h-4" />}>
                <div className="space-y-4 pt-2">
                    <div className="space-y-3">
                        <Label>Upload Logo</Label>
                        <Input type="file" accept="image/*" ref={inputRef} onChange={handleLogoUpload} />
                        <div className="space-y-2">
                            <Label>Logo Margin</Label>
                            <Slider defaultValue={[0]} max={20} step={1} onValueChange={(vals) => setImageMargin(vals[0])} />
                        </div>
                    </div>
                </div>
            </CustomAccordionItem>
        </div>
    );
}
