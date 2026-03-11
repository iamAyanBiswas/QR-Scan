"use client";

import { useState } from "react";
import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { PagePreview } from "@/components/block/page-preview";
import { DEFAULT_MENU, QR_PAGE_TITLE } from "@/config/qr-page-builder";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createQRCode } from "@/actions/qr-actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Utensils, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { imageUploadInR2 } from "@/lib/image-upload";

const campaignSchema = z.object({
    title: z.string().min(1, "Campaign name is required").max(100, "Length should not more then 100"),
    expiresAt: z.string().optional(),
});

const menuSchema = z.object({
    restaurantName: z.string().min(1, "Restaurant name is required").max(100, "Length should not more than 100"),
    logo: z.object({ publicImage: z.boolean(), link: z.string() }).optional(),
    currency: z.string().min(1, "Currency symbol is required"),
    sections: z.array(z.object({
        title: z.string().min(1, "Section title is required"),
        items: z.array(z.object({
            name: z.string().min(1, "Item name is required"),
            description: z.string().optional(),
            price: z.string().optional(),
        })).min(1, "At least one item is required")
    })).min(1, "At least one section is required"),
    themeColor: z.string().min(1, "Theme color is required"),
}) satisfies z.ZodType<MenuData>;

type CampaignFormValues = z.infer<typeof campaignSchema>;
type MenuFormValues = z.infer<typeof menuSchema>;

export default function CreateMenuQR() {
    // Dynamic QR State
    const [isSaving, setIsSaving] = useState(false);
    const [shortUrl, setShortUrl] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2>(1);
    const [shortId, setShortId] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);


    const campaignForm = useForm<CampaignFormValues>({
        resolver: zodResolver(campaignSchema),
        defaultValues: { title: "Untitled QR", expiresAt: "" },
        mode: "onChange",
    });
    const form = useForm<MenuFormValues>({
        resolver: zodResolver(menuSchema),
        defaultValues: DEFAULT_MENU,
        mode: "onChange",
    });

    const watchedData = form.watch();
    // Deep clone to break Proxy references so child components properly detect changes
    const data: MenuFormValues = JSON.parse(JSON.stringify(watchedData));

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: "logo") => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                form.setValue(key, { publicImage: false, link: reader.result as string }, { shouldDirty: true, shouldValidate: true });
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
        setIsSaving(true);
        try {
            let dynamicData = { ...data };

            if (imageFile) {
                const upload = await imageUploadInR2(imageFile);
                if (upload.success) {
                    dynamicData = {
                        ...dynamicData, logo: { publicImage: false, link: upload.key }
                    };
                } else {
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

            if (result.success && result.id && result.shortCode) {
                setShortId(result.id);
                const domain = process.env.NEXT_PUBLIC_SHORT_DOMAIN;
                const finalUrl = `${domain}/${result.shortCode}`;
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
                previewSlot={<PagePreview type="menuCard" data={data} />}
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
                        <Utensils className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-sm">
                            {QR_PAGE_TITLE["menuCard"]}
                        </h3>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Restaurant Name</Label>
                                <Input {...form.register("restaurantName")} />
                                {form.formState.errors.restaurantName && <p className="text-sm text-destructive">{form.formState.errors.restaurantName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Currency Symbol</Label>
                                <Input {...form.register("currency")} className="w-20" />
                                {form.formState.errors.currency && <p className="text-sm text-destructive">{form.formState.errors.currency.message}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Logo</Label>
                            <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "logo")} />
                        </div>
                        <div className="space-y-2">
                            <Label>Theme Color</Label>
                            <Controller
                                name="themeColor"
                                control={form.control}
                                render={({ field }) => (
                                    <div className="flex gap-2">
                                        <Input type="color" className="w-12 h-10 p-1" {...field} value={field.value || "#ea580c"} />
                                        <Input {...field} value={field.value || ""} />
                                    </div>
                                )}
                            />
                            {form.formState.errors.themeColor && <p className="text-sm text-destructive">{form.formState.errors.themeColor.message}</p>}
                        </div>

                        <div className="space-y-4 border-t pt-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-lg">Menu Sections</Label>
                                <Button size="sm" variant="outline" onClick={() => {
                                    const newSections = [...(data.sections || []), { title: "New Section", items: [] }];
                                    form.setValue("sections", newSections, { shouldDirty: true, shouldValidate: true });
                                }}>+ Add Section</Button>
                            </div>
                            {form.formState.errors.sections?.message && <p className="text-sm text-destructive">{form.formState.errors.sections.message}</p>}

                            {(data.sections || []).map((section: any, sIdx: number) => (
                                <div key={sIdx} className="border rounded-lg p-4 bg-muted/20 space-y-4">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-full">
                                            <Input
                                                className="font-bold"
                                                placeholder="Section Title (e.g. Starters)"
                                                value={data.sections?.[sIdx]?.title ?? ""}
                                                onChange={(e) => form.setValue(`sections.${sIdx}.title`, e.target.value, { shouldValidate: true, shouldDirty: true })}
                                            />
                                            {form.formState.errors.sections?.[sIdx]?.title && <p className="text-sm text-destructive">{form.formState.errors.sections[sIdx]?.title?.message}</p>}
                                        </div>
                                        <Button variant="ghost" size="icon" className="mb-auto mt-1" onClick={() => {
                                            const newSections = data.sections.filter((_: any, i: number) => i !== sIdx);
                                            form.setValue("sections", newSections, { shouldDirty: true, shouldValidate: true });
                                        }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                    </div>

                                    {
                                        form.formState.errors.sections?.[sIdx]?.items?.message && <p className="text-sm text-destructive">{form.formState.errors.sections?.[sIdx]?.items?.message}</p>
                                    }

                                    <div className="space-y-2 pl-4 border-l-2 overflow-x-scroll custom-scrollbar">
                                        {(section.items || []).map((item: any, iIdx: number) => (
                                            <div key={iIdx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start">
                                                <div className="col-span-1 md:col-span-4">
                                                    <Label htmlFor={`name-${sIdx}-${iIdx}`} className="mb-2 block">Item Name</Label>
                                                    <Input id={`name-${sIdx}-${iIdx}`} placeholder="Item Name"
                                                        value={data.sections?.[sIdx]?.items?.[iIdx]?.name ?? ""}
                                                        onChange={(e) => form.setValue(`sections.${sIdx}.items.${iIdx}.name`, e.target.value, { shouldValidate: true, shouldDirty: true })}
                                                    />
                                                    {form.formState.errors.sections?.[sIdx]?.items?.[iIdx]?.name && <p className="text-sm text-destructive">{form.formState.errors.sections[sIdx]?.items?.[iIdx]?.name?.message}</p>}
                                                </div>
                                                <div className="col-span-1 md:col-span-2">
                                                    <Label htmlFor={`price-${sIdx}-${iIdx}`} className="mb-2 block">Price</Label>
                                                    <Input id={`price-${sIdx}-${iIdx}`} placeholder="Price"
                                                        value={data.sections?.[sIdx]?.items?.[iIdx]?.price ?? ""}
                                                        onChange={(e) => form.setValue(`sections.${sIdx}.items.${iIdx}.price`, e.target.value, { shouldValidate: true, shouldDirty: true })}
                                                    />
                                                    {form.formState.errors.sections?.[sIdx]?.items?.[iIdx]?.price && <p className="text-sm text-destructive">{form.formState.errors.sections[sIdx]?.items?.[iIdx]?.price?.message}</p>}
                                                </div>
                                                <div className="col-span-1 md:col-span-5">
                                                    <Label htmlFor={`desc-${sIdx}-${iIdx}`} className="mb-2 block">Description</Label>
                                                    <Input id={`desc-${sIdx}-${iIdx}`} placeholder="Description"
                                                        value={data.sections?.[sIdx]?.items?.[iIdx]?.description ?? ""}
                                                        onChange={(e) => form.setValue(`sections.${sIdx}.items.${iIdx}.description`, e.target.value, { shouldValidate: true, shouldDirty: true })}
                                                    />
                                                    {form.formState.errors.sections?.[sIdx]?.items?.[iIdx]?.description && <p className="text-sm text-destructive">{form.formState.errors.sections[sIdx]?.items?.[iIdx]?.description?.message}</p>}
                                                </div>
                                                <Button variant="ghost" size="icon" className="col-span-1 md:col-span-1 justify-self-end mt-7" onClick={() => {
                                                    const newSections = data.sections.map((s, i) =>
                                                        i === sIdx
                                                            ? { ...s, items: s.items.filter((_: any, j: number) => j !== iIdx) }
                                                            : s
                                                    );
                                                    form.setValue("sections", newSections, { shouldDirty: true, shouldValidate: true });
                                                }}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                                            </div>
                                        ))}

                                        <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => {
                                            const newSections = data.sections.map((s, i) =>
                                                i === sIdx
                                                    ? { ...s, items: [...s.items, { name: "", price: "", description: "" }] }
                                                    : s
                                            );
                                            form.setValue("sections", newSections, { shouldDirty: true, shouldValidate: true });
                                        }}>+ Add Item</Button>
                                    </div>
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
