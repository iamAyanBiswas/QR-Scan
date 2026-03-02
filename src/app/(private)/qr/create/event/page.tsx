"use client";

import { useState } from "react";
import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { PagePreview } from "@/components/block/page-preview";
import { DEFAULT_EVENT_PAGE, QR_PAGE_TITLE } from "@/config/qr-page-builder";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createQRCode } from "@/actions/qr-actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const campaignSchema = z.object({
    title: z.string().min(1, "Campaign name is required").max(100, "Length should not more then 100"),
    expiresAt: z.string().optional(),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function CreateEventQR() {
    // Dynamic QR State
    const [isSaving, setIsSaving] = useState(false);
    const [shortUrl, setShortUrl] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2>(1);
    const [shortId, setShortId] = useState<string | null>(null);


    const campaignForm = useForm<CampaignFormValues>({
        resolver: zodResolver(campaignSchema),
        defaultValues: { title: "Untitled QR", expiresAt: "" },
        mode: "onChange",
    });

    const [data, setData] = useState<EventPageData>(DEFAULT_EVENT_PAGE);

    const handleChange = (key: string, value: any) => {
        setData((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                handleChange(key, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreate = async () => {
        // Validate campaign details (title)
        const campaignValid = await campaignForm.trigger();
        // const formValid = await form.trigger();
        // if (!campaignValid || !form) return;

        const { title, expiresAt } = campaignForm.getValues();
        setIsSaving(true);
        try {

            // Step 1: Create Draft
            const result = await createQRCode({
                title: title || "Untitled QR",
                type: "app",
                dynamicData: data,
                designStats: {},
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            });

            if (result.success && result.id) {
                setShortId(result.id);
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <QRCreatorShell
                step={step}
                shortId={shortId}
                shortUrl={shortUrl}
                previewSlot={<PagePreview type="eventPage" data={data} />}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                        name="title"
                        control={campaignForm.control}
                        render={({ field, fieldState }) => (
                            <div className="space-y-2">
                                <Label htmlFor="qr-title">Campaign Name</Label>
                                <Input
                                    id="qr-title"
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Enter campaign name"
                                />
                                {fieldState.error && (
                                    <p className="text-sm text-destructive">{fieldState.error.message}</p>
                                )}
                            </div>
                        )}
                    />
                    <Controller
                        name="expiresAt"
                        control={campaignForm.control}
                        render={({ field }) => (
                            <div className="space-y-2">
                                <Label htmlFor="qr-expiry">Expiration Date (Optional)</Label>
                                <Input
                                    id="qr-expiry"
                                    type="datetime-local"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                                <p className="text-xs text-muted-foreground">Set when the QR code expires</p>
                            </div>
                        )}
                    />
                </div>
                <div className="pt-4 border-t space-y-4">
                    <div className="flex items-center gap-2 mb-4 p-2 bg-muted/50 rounded-lg">
                        <Calendar className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-sm">
                            {QR_PAGE_TITLE["eventPage"] ?? "Unknown Page"}
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Event Title</Label>
                            <Input value={data.title || ""} onChange={(e) => handleChange("title", e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start</Label>
                                <Input type="datetime-local" value={data.startDate || ""} onChange={(e) => handleChange("startDate", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>End</Label>
                                <Input type="datetime-local" value={data.endDate || ""} onChange={(e) => handleChange("endDate", e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input value={data.location || ""} onChange={(e) => handleChange("location", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Hero Image</Label>
                            <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "heroImage")} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={data.description || ""} onChange={(e) => handleChange("description", e.target.value)} rows={3} />
                        </div>
                        <div className="space-y-2">
                            <Label>Theme Color</Label>
                            <div className="flex gap-2">
                                <Input type="color" className="w-12 h-10 p-1" value={data.themeColor ?? "#2563eb"} onChange={(e) => handleChange("themeColor", e.target.value)} />
                                <Input value={data.themeColor ?? ""} onChange={(e) => handleChange("themeColor", e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-4 border-t pt-4">
                            <div className="flex justify-between items-center">
                                <Label>Agenda / Schedule</Label>
                                <Button size="sm" variant="outline" onClick={(e) => {
                                    e.preventDefault();
                                    const newAgenda = [...(data.agenda ?? []), { time: "", activity: "" }];
                                    handleChange("agenda", newAgenda);
                                }}>+ Add Slot</Button>
                            </div>
                            {(data.agenda || []).map((slot: any, idx: number) => (
                                <div key={idx} className="flex gap-2 items-center">
                                    <Input type="time" className="w-32" value={slot.time ?? ""} onChange={(e) => {
                                        const newAgenda = [...(data.agenda ?? [])];
                                        newAgenda[idx].time = e.target.value;
                                        handleChange("agenda", newAgenda);
                                    }} />
                                    <Input className="flex-1" placeholder="Activity" value={slot.activity ?? ""} onChange={(e) => {
                                        const newAgenda = [...(data.agenda ?? [])];
                                        newAgenda[idx].activity = e.target.value;
                                        handleChange("agenda", newAgenda);
                                    }} />
                                    <Button variant="ghost" size="icon" onClick={(e) => {
                                        e.preventDefault();
                                        const newAgenda = (data.agenda ?? []).filter((_: any, i: number) => i !== idx);
                                        handleChange("agenda", newAgenda);
                                    }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Button onClick={handleCreate} className="w-full mt-6" size="lg" disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Next Step →
                </Button>
            </QRCreatorShell>
        </div>
    );
}
