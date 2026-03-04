"use client";

import { useState } from "react";
import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { PagePreview } from "@/components/block/page-preview";
import { DEFAULT_EVENT_PAGE, QR_PAGE_TITLE } from "@/config/qr-page-builder";
import { z } from "zod";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createQRCode } from "@/actions/qr-actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { imageUploadInR2 } from "@/lib/image-upload";

const campaignSchema = z.object({
    title: z.string().min(1, "Campaign name is required").max(100, "Length should not more then 100"),
    expiresAt: z.string().optional(),
});

const formSchema = z.object({
    title: z.string().min(1, "Event title is required").max(150, "Title must be under 150 characters"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    location: z.string().optional(),
    description: z.string().max(1000, "Description must be under 1000 characters").optional(),
    organizer: z.string().optional(),
    themeColor: z.string().min(1, "Theme color is required"),
    agenda: z.array(z.object({
        time: z.string().min(1, "Time is required"),
        activity: z.string().min(1, "Activity is required"),
    })).optional(),
    buttonConfig: z.object({
        buttontext: z.string().optional(),
        url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    }).optional(),
}).superRefine((data, ctx) => {
    if (data.endDate && data.startDate && data.endDate < data.startDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date must be after start date",
            path: ["endDate"],
        });
    }
}) satisfies z.ZodType<Omit<EventPageData, "heroImage">>;

type CampaignFormValues = z.infer<typeof campaignSchema>;
type FormValues = z.infer<typeof formSchema>;


export default function CreateEventQR() {
    // Dynamic QR State
    const [isSaving, setIsSaving] = useState(false);
    const [shortUrl, setShortUrl] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2>(1);
    const [shortId, setShortId] = useState<string | null>(null);
    const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
    const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);


    const campaignForm = useForm<CampaignFormValues>({
        resolver: zodResolver(campaignSchema),
        defaultValues: { title: "Untitled QR", expiresAt: "" },
        mode: "onChange",
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: DEFAULT_EVENT_PAGE.title,
            startDate: DEFAULT_EVENT_PAGE.startDate,
            endDate: DEFAULT_EVENT_PAGE.endDate ?? "",
            location: DEFAULT_EVENT_PAGE.location ?? "",
            description: DEFAULT_EVENT_PAGE.description ?? "",
            organizer: DEFAULT_EVENT_PAGE.organizer ?? "",
            themeColor: DEFAULT_EVENT_PAGE.themeColor,
            agenda: DEFAULT_EVENT_PAGE.agenda ?? [],
            buttonConfig: {
                buttontext: DEFAULT_EVENT_PAGE.buttonConfig?.buttontext ?? "",
                url: DEFAULT_EVENT_PAGE.buttonConfig?.url ?? "",
            },
        },
        mode: "onChange",
    });

    const { fields: agendaFields, append: appendAgenda, remove: removeAgenda } = useFieldArray({
        control: form.control,
        name: "agenda",
    });

    // Watch all form values for the live preview
    const watchedValues = form.watch();
    const previewData: EventPageData = {
        ...watchedValues,
        heroImage: heroImagePreview
            ? { publicImage: false, link: heroImagePreview }
            : DEFAULT_EVENT_PAGE.heroImage,
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setHeroImageFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setHeroImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreate = async () => {
        // Validate campaign details (title)
        const campaignValid = await campaignForm.trigger();
        const formValid = await form.trigger();
        if (!campaignValid || !formValid) return;

        const { title, expiresAt } = campaignForm.getValues();
        const formValues = form.getValues();
        setIsSaving(true);
        try {
            let dynamicData: EventPageData = {
                ...formValues,
                heroImage: heroImagePreview
                    ? { publicImage: false, link: heroImagePreview }
                    : undefined,
            };

            if (heroImageFile) {
                const upload = await imageUploadInR2(heroImageFile);
                if (upload.success) {
                    dynamicData = {
                        ...dynamicData, heroImage: { publicImage: false, link: upload.key }
                    };
                }
                else {
                    toast.error(upload.message as string);
                }
            }
            // Step 1: Create Draft
            const result = await createQRCode({
                title: title || "Untitled QR",
                type: "app",
                dynamicData: dynamicData,
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
                previewSlot={<PagePreview type="eventPage" data={previewData} />}
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
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div className="space-y-2">
                                    <Label>Event Title</Label>
                                    <Input {...field} />
                                    {fieldState.error && (
                                        <p className="text-sm text-destructive">{fieldState.error.message}</p>
                                    )}
                                </div>
                            )}
                        />
                        <Controller
                            name="organizer"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div className="space-y-2">
                                    <Label>Host</Label>
                                    <Input {...field} />
                                    {fieldState.error && (
                                        <p className="text-sm text-destructive">{fieldState.error.message}</p>
                                    )}
                                </div>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                name="startDate"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <div className="space-y-2">
                                        <Label>Start</Label>
                                        <Input type="datetime-local" {...field} />
                                        {fieldState.error && (
                                            <p className="text-sm text-destructive">{fieldState.error.message}</p>
                                        )}
                                    </div>
                                )}
                            />
                            <Controller
                                name="endDate"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <div className="space-y-2">
                                        <Label>End</Label>
                                        <Input type="datetime-local" {...field} />
                                        {fieldState.error && (
                                            <p className="text-sm text-destructive">{fieldState.error.message}</p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                        <Controller
                            name="location"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input {...field} />
                                    {fieldState.error && (
                                        <p className="text-sm text-destructive">{fieldState.error.message}</p>
                                    )}
                                </div>
                            )}
                        />
                        <div className="space-y-2">
                            <Label>Hero Image</Label>
                            <Input type="file" accept="image/*" onChange={handleImageUpload} />
                        </div>
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea {...field} rows={3} />
                                    {fieldState.error && (
                                        <p className="text-sm text-destructive">{fieldState.error.message}</p>
                                    )}
                                </div>
                            )}
                        />
                        <Controller
                            name="themeColor"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div className="space-y-2">
                                    <Label>Theme Color</Label>
                                    <div className="flex gap-2">
                                        <Input type="color" className="w-12 h-10 p-1" value={field.value} onChange={field.onChange} />
                                        <Input value={field.value} onChange={field.onChange} />
                                    </div>
                                    {fieldState.error && (
                                        <p className="text-sm text-destructive">{fieldState.error.message}</p>
                                    )}
                                </div>
                            )}
                        />
                        <div className="space-y-4 border-t pt-4">
                            <div className="flex justify-between items-center">
                                <Label>Agenda / Schedule</Label>
                                <Button size="sm" variant="outline" onClick={(e) => {
                                    e.preventDefault();
                                    appendAgenda({ time: "", activity: "" });
                                }}>+ Add Slot</Button>
                            </div>
                            {agendaFields.map((field, idx) => (
                                <div key={field.id} className="flex gap-2 items-start">
                                    <Controller
                                        name={`agenda.${idx}.time`}
                                        control={form.control}
                                        render={({ field: timeField, fieldState }) => (
                                            <div>
                                                <Input type="time" className="w-32" {...timeField} />
                                                {fieldState.error && (
                                                    <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                                                )}
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        name={`agenda.${idx}.activity`}
                                        control={form.control}
                                        render={({ field: activityField, fieldState }) => (
                                            <div className="flex-1">
                                                <Input placeholder="Activity" {...activityField} />
                                                {fieldState.error && (
                                                    <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>
                                                )}
                                            </div>
                                        )}
                                    />
                                    <Button variant="ghost" size="icon" onClick={(e) => {
                                        e.preventDefault();
                                        removeAgenda(idx);
                                    }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                name="buttonConfig.buttontext"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <div className="space-y-2">
                                        <Label>Button Name</Label>
                                        <Input type="text" {...field} />
                                        {fieldState.error && (
                                            <p className="text-sm text-destructive">{fieldState.error.message}</p>
                                        )}
                                    </div>
                                )}
                            />
                            <Controller
                                name="buttonConfig.url"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <div className="space-y-2">
                                        <Label>Button Redirect URL</Label>
                                        <Input type="text" {...field} />
                                        {fieldState.error && (
                                            <p className="text-sm text-destructive">{fieldState.error.message}</p>
                                        )}
                                    </div>
                                )}
                            />
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
