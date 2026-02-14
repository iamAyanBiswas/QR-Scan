"use client";

import React, { useState } from "react";
import { Options as QRCodeOptions } from "qr-code-styling";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { LayoutGrid, Shapes, Palette, Image as ImageIcon, LayoutTemplate, ChevronDown, ChevronRight } from "lucide-react";
import { ALL_STYLES as PREMIUM_STYLES, QR_CATEGORIES } from "@/lib/qr-styles";
import { cn } from "@/lib/utils";
import { StyleButton } from "@/components/custom/style-button";
import { DotsSquareIcon, DotsRoundIcon, DotsRoundedIcon, DotsExtraRoundedIcon, DotsClassyIcon, DotsClassyRoundedIcon, CornerSquareIcon, CornerDotIcon, CornerExtraRoundedIcon, CornerNoneIcon, CornerCenterSquareIcon, CornerCenterDotIcon } from "@/components/custom/qr-style-icons";

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

interface QRStylingConfigProps {
    value: QRCodeStyle;
    onChange: (value: QRCodeStyle) => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function QRStylingConfig({ value, onChange, onImageUpload }: QRStylingConfigProps) {

    // Helper functions to update the QRCodeStyle object
    const updateTemplate = (template: string) => {
        onChange({ ...value, template, style: {} }); // Reset custom styles when template changes
    };

    const updateStyleOption = (category: keyof QRCodeOptions, key: string, optionValue: any) => {
        onChange({
            ...value,
            style: {
                ...value.style,
                [category]: { ...(value.style[category] as any || {}), [key]: optionValue }
            }
        });
    };

    // Merged options for display
    const mergedOptions = React.useMemo(() => {
        const templateOptions = PREMIUM_STYLES.find(s => s.name === value.template)?.options || {};
        const customStyle = value.style || {};
        return {
            ...templateOptions,
            ...customStyle,
            dotsOptions: { ...templateOptions.dotsOptions, ...customStyle.dotsOptions },
            cornersSquareOptions: { ...templateOptions.cornersSquareOptions, ...customStyle.cornersSquareOptions },
            cornersDotOptions: { ...templateOptions.cornersDotOptions, ...customStyle.cornersDotOptions },
            backgroundOptions: { ...templateOptions.backgroundOptions, ...customStyle.backgroundOptions },
            imageOptions: { ...templateOptions.imageOptions, ...customStyle.imageOptions },
        };
    }, [value.template, value.style]);

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-1">Customize Your QR Code</h2>
                <p className="text-sm text-muted-foreground">Make your QR code unique with colors, patterns, and logos</p>
            </div>
            /
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
                                        onClick={() => updateTemplate(style.name)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all hover:bg-accent",
                                            value.template === style.name ? "border-primary bg-accent" : "border-transparent bg-background"
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
                                isActive={mergedOptions.dotsOptions?.type === "square"}
                                onClick={() => updateStyleOption('dotsOptions', 'type', 'square')}
                            />
                            <StyleButton
                                icon={<DotsRoundIcon />}
                                label="dots"
                                isActive={mergedOptions.dotsOptions?.type === "dots"}
                                onClick={() => updateStyleOption('dotsOptions', 'type', 'dots')}
                            />
                            <StyleButton
                                icon={<DotsRoundedIcon />}
                                label="rounded"
                                isActive={mergedOptions.dotsOptions?.type === "rounded"}
                                onClick={() => updateStyleOption('dotsOptions', 'type', 'rounded')}
                            />
                            <StyleButton
                                icon={<DotsExtraRoundedIcon />}
                                label="extra rounded"
                                isActive={mergedOptions.dotsOptions?.type === "extra-rounded"}
                                onClick={() => updateStyleOption('dotsOptions', 'type', 'extra-rounded')}
                            />
                            <StyleButton
                                icon={<DotsClassyIcon />}
                                label="classy"
                                isActive={mergedOptions.dotsOptions?.type === "classy"}
                                onClick={() => updateStyleOption('dotsOptions', 'type', 'classy')}
                            />
                            <StyleButton
                                icon={<DotsClassyRoundedIcon />}
                                label="classy rounded"
                                isActive={mergedOptions.dotsOptions?.type === "classy-rounded"}
                                onClick={() => updateStyleOption('dotsOptions', 'type', 'classy-rounded')}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Color</Label>
                        <Tabs value={mergedOptions.dotsOptions?.gradient ? "gradient" : "solid"} onValueChange={(v) => {
                            if (v === "solid") {
                                updateStyleOption('dotsOptions', 'gradient', undefined);
                                updateStyleOption('dotsOptions', 'color', mergedOptions.dotsOptions?.gradient?.colorStops?.[0]?.color || "#000000");
                            } else {
                                updateStyleOption('dotsOptions', 'color', undefined);
                                updateStyleOption('dotsOptions', 'gradient', {
                                    type: "linear",
                                    rotation: 0,
                                    colorStops: [{ offset: 0, color: mergedOptions.dotsOptions?.color || "#000000" }, { offset: 1, color: mergedOptions.dotsOptions?.color || "#000000" }]
                                });
                            }
                        }}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="solid">Solid</TabsTrigger>
                                <TabsTrigger value="gradient">Gradient</TabsTrigger>
                            </TabsList>
                            <TabsContent value="solid" className="mt-3">
                                <div className="flex gap-3">
                                    <Input type="color" className="w-14 h-10 p-1 cursor-pointer" value={mergedOptions.dotsOptions?.color || "#000000"} onChange={(e) => updateStyleOption('dotsOptions', 'color', e.target.value)} />
                                    <Input value={mergedOptions.dotsOptions?.color || "#000000"} onChange={(e) => updateStyleOption('dotsOptions', 'color', e.target.value)} className="font-mono" />
                                </div>
                            </TabsContent>
                            <TabsContent value="gradient" className="mt-3 space-y-4">
                                <div className="flex gap-3">
                                    <Button size="sm" variant={mergedOptions.dotsOptions?.gradient?.type === "linear" ? "default" : "outline"} onClick={() => {
                                        const current = mergedOptions.dotsOptions?.gradient || { colorStops: [{ offset: 0, color: "#000000" }, { offset: 1, color: "#000000" }], rotation: 0 };
                                        updateStyleOption('dotsOptions', 'gradient', { ...current, type: "linear" });
                                    }}>Linear</Button>
                                    <Button size="sm" variant={mergedOptions.dotsOptions?.gradient?.type === "radial" ? "default" : "outline"} onClick={() => {
                                        const current = mergedOptions.dotsOptions?.gradient || { colorStops: [{ offset: 0, color: "#000000" }, { offset: 1, color: "#000000" }], rotation: 0 };
                                        updateStyleOption('dotsOptions', 'gradient', { ...current, type: "radial" });
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
                                                    if (!newStops[0]) newStops[0] = { offset: 0, color: e.target.value };
                                                    else newStops[0] = { ...newStops[0], color: e.target.value };
                                                    updateStyleOption('dotsOptions', 'gradient', { ...current, colorStops: newStops });
                                                }}
                                            />
                                            <Input
                                                value={mergedOptions.dotsOptions?.gradient?.colorStops?.[0]?.color || "#000000"}
                                                onChange={(e) => {
                                                    const current = mergedOptions.dotsOptions?.gradient || { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#000000" }, { offset: 1, color: "#000000" }] };
                                                    const newStops = [...(current.colorStops || [])];
                                                    if (!newStops[0]) newStops[0] = { offset: 0, color: e.target.value };
                                                    else newStops[0] = { ...newStops[0], color: e.target.value };
                                                    updateStyleOption('dotsOptions', 'gradient', { ...current, colorStops: newStops });
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
                                                    updateStyleOption('dotsOptions', 'gradient', { ...current, colorStops: newStops });
                                                }}
                                            />
                                            <Input
                                                value={mergedOptions.dotsOptions?.gradient?.colorStops?.[1]?.color || "#000000"}
                                                onChange={(e) => {
                                                    const current = mergedOptions.dotsOptions?.gradient || { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#000000" }, { offset: 1, color: "#000000" }] };
                                                    const newStops = [...(current.colorStops || [])];
                                                    if (!newStops[1]) newStops[1] = { offset: 1, color: e.target.value };
                                                    else newStops[1] = { ...newStops[1], color: e.target.value };
                                                    updateStyleOption('dotsOptions', 'gradient', { ...current, colorStops: newStops });
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
                                            const current = mergedOptions.dotsOptions?.gradient || { type: "linear", colorStops: [{ offset: 0, color: "#000000" }, { offset: 1, color: "#000000" }], rotation: 0 };
                                            updateStyleOption('dotsOptions', 'gradient', { ...current, rotation: vals[0] * (Math.PI / 180) });
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
                                isActive={mergedOptions.cornersSquareOptions?.type === "square"}
                                onClick={() => updateStyleOption('cornersSquareOptions', 'type', 'square')}
                            />
                            <StyleButton
                                icon={<CornerDotIcon />}
                                label="dot"
                                isActive={mergedOptions.cornersSquareOptions?.type === "dot"}
                                onClick={() => updateStyleOption('cornersSquareOptions', 'type', 'dot')}
                            />
                            <StyleButton
                                icon={<CornerExtraRoundedIcon />}
                                label="extra rounded"
                                isActive={mergedOptions.cornersSquareOptions?.type === "extra-rounded"}
                                onClick={() => updateStyleOption('cornersSquareOptions', 'type', 'extra-rounded')}
                            />
                            <StyleButton
                                icon={<CornerNoneIcon />}
                                label="none"
                                isActive={!mergedOptions.cornersSquareOptions?.type}
                                onClick={() => updateStyleOption('cornersSquareOptions', 'type', undefined)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm">Border Color</Label>
                        <div className="flex gap-2">
                            <Input type="color" className="w-12 h-9 p-1" value={mergedOptions.cornersSquareOptions?.color || "#000000"} onChange={(e) => updateStyleOption('cornersSquareOptions', 'color', e.target.value)} />
                            <Input value={mergedOptions.cornersSquareOptions?.color || "#000000"} onChange={(e) => updateStyleOption('cornersSquareOptions', 'color', e.target.value)} />
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
                                onClick={() => updateStyleOption('cornersDotOptions', 'type', 'square')}
                            />
                            <StyleButton
                                icon={<CornerCenterDotIcon />}
                                label="dot"
                                isActive={mergedOptions.cornersDotOptions?.type === "dot"}
                                onClick={() => updateStyleOption('cornersDotOptions', 'type', 'dot')}
                            />
                            <StyleButton
                                icon={<CornerNoneIcon />}
                                label="none"
                                isActive={!mergedOptions.cornersDotOptions?.type}
                                onClick={() => updateStyleOption('cornersDotOptions', 'type', undefined)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm">Center Color</Label>
                        <div className="flex gap-2">
                            <Input type="color" className="w-12 h-9 p-1" value={mergedOptions.cornersDotOptions?.color || "#000000"} onChange={(e) => updateStyleOption('cornersDotOptions', 'color', e.target.value)} />
                            <Input value={mergedOptions.cornersDotOptions?.color || "#000000"} onChange={(e) => updateStyleOption('cornersDotOptions', 'color', e.target.value)} />
                        </div>
                    </div>
                </div>
            </CustomAccordionItem>

            {/* Background Configuration */}
            <CustomAccordionItem title="Background" icon={<Palette className="w-4 h-4" />}>
                <div className="space-y-4 pt-2">
                    <Tabs value={mergedOptions.backgroundOptions?.gradient ? "gradient" : "solid"} onValueChange={(v) => {
                        if (v === "solid") {
                            updateStyleOption('backgroundOptions', 'gradient', undefined);
                            updateStyleOption('backgroundOptions', 'color', mergedOptions.backgroundOptions?.gradient?.colorStops?.[0]?.color || "#ffffff");
                        } else {
                            updateStyleOption('backgroundOptions', 'color', undefined);
                            updateStyleOption('backgroundOptions', 'gradient', {
                                type: "linear",
                                rotation: 0,
                                colorStops: [{ offset: 0, color: mergedOptions.backgroundOptions?.color || "#ffffff" }, { offset: 1, color: mergedOptions.backgroundOptions?.color || "#ffffff" }]
                            });
                        }
                    }}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="solid">Solid</TabsTrigger>
                            <TabsTrigger value="gradient">Gradient</TabsTrigger>
                        </TabsList>
                        <TabsContent value="solid" className="mt-2">
                            <div className="flex gap-2">
                                <Input type="color" className="w-12 h-9 p-1" value={mergedOptions.backgroundOptions?.color || "#ffffff"} onChange={(e) => updateStyleOption('backgroundOptions', 'color', e.target.value)} />
                                <Input value={mergedOptions.backgroundOptions?.color || "#ffffff"} onChange={(e) => updateStyleOption('backgroundOptions', 'color', e.target.value)} />
                            </div>
                        </TabsContent>
                        <TabsContent value="gradient" className="mt-2 space-y-3">
                            <div className="flex gap-2">
                                <Button size="sm" variant={mergedOptions.backgroundOptions?.gradient?.type === "linear" ? "default" : "outline"} onClick={() => {
                                    const current = mergedOptions.backgroundOptions?.gradient || { colorStops: [{ offset: 0, color: "#ffffff" }, { offset: 1, color: "#ffffff" }], rotation: 0 };
                                    updateStyleOption('backgroundOptions', 'gradient', { ...current, type: "linear" });
                                }}>Linear</Button>
                                <Button size="sm" variant={mergedOptions.backgroundOptions?.gradient?.type === "radial" ? "default" : "outline"} onClick={() => {
                                    const current = mergedOptions.backgroundOptions?.gradient || { colorStops: [{ offset: 0, color: "#ffffff" }, { offset: 1, color: "#ffffff" }], rotation: 0 };
                                    updateStyleOption('backgroundOptions', 'gradient', { ...current, type: "radial" });
                                }}>Radial</Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-xs">Start</Label>
                                    <Input type="color" className="w-full h-8 p-1" value={mergedOptions.backgroundOptions?.gradient?.colorStops?.[0]?.color || "#ffffff"} onChange={(e) => {
                                        const current = mergedOptions.backgroundOptions?.gradient || { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#ffffff" }, { offset: 1, color: "#ffffff" }] };
                                        const newStops = [...(current.colorStops || [])];
                                        if (!newStops[0]) newStops[0] = { offset: 0, color: e.target.value };
                                        else newStops[0] = { ...newStops[0], color: e.target.value };
                                        updateStyleOption('backgroundOptions', 'gradient', { ...current, colorStops: newStops });
                                    }} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">End</Label>
                                    <Input type="color" className="w-full h-8 p-1" value={mergedOptions.backgroundOptions?.gradient?.colorStops?.[1]?.color || "#ffffff"} onChange={(e) => {
                                        const current = mergedOptions.backgroundOptions?.gradient || { type: "linear", rotation: 0, colorStops: [{ offset: 0, color: "#ffffff" }, { offset: 1, color: "#ffffff" }] };
                                        const newStops = [...(current.colorStops || [])];
                                        if (!newStops[1]) newStops[1] = { offset: 1, color: e.target.value };
                                        else newStops[1] = { ...newStops[1], color: e.target.value };
                                        updateStyleOption('backgroundOptions', 'gradient', { ...current, colorStops: newStops });
                                    }} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Rotation ({Math.round((mergedOptions.backgroundOptions?.gradient?.rotation || 0) * 180 / Math.PI)}°)</Label>
                                <Slider
                                    min={0} max={360} step={15}
                                    value={[Math.round((mergedOptions.backgroundOptions?.gradient?.rotation || 0) * 180 / Math.PI)]}
                                    onValueChange={(vals) => {
                                        const current = mergedOptions.backgroundOptions?.gradient || { type: "linear", colorStops: [{ offset: 0, color: "#ffffff" }, { offset: 1, color: "#ffffff" }] };
                                        updateStyleOption('backgroundOptions', 'gradient', { ...current, rotation: vals[0] * (Math.PI / 180) });
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
                        <Input type="file" accept="image/*" onChange={onImageUpload} />
                        <div className="space-y-2">
                            <Label>Logo Margin</Label>
                            <Slider defaultValue={[0]} max={20} step={1} onValueChange={(vals) => updateStyleOption('imageOptions', 'margin', vals[0])} />
                        </div>
                    </div>
                </div>
            </CustomAccordionItem>
        </div>
    );
}
