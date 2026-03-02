"use client";

import { useState } from "react";
import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { PagePreview } from "@/components/block/page-preview";
import { DEFAULT_COUPON, QR_PAGE_TITLE } from "@/config/qr-page-builder";
import { z } from "zod"
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createQRCode } from "@/actions/qr-actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Ticket } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { imageUploadInR2 } from "@/lib/image-upload";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    discountCode: z.string().min(1, "Discount code is required"),
    discountValue: z.string().optional(),
    description: z.string().optional(),
    expiryDate: z.string().optional(),
    terms: z.string().optional(),
    heroImage: z.object({
        publicImage: z.boolean(),
        link: z.string(),
    }).optional(),
    websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    buttonText: z.string().optional(),
    themeColor: z.string().min(1, "Theme color is required"),
}) satisfies z.ZodType<CouponData>;

const campaignSchema = z.object({
    title: z.string().min(1, "Campaign name is required").max(100, "Length should not more then 100"),
    expiresAt: z.string().optional(),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;
type FormValues = z.infer<typeof formSchema>;

export default function CreateCouponQR() {
    // Dynamic QR State
    const [isSaving, setIsSaving] = useState(false);
    const [shortUrl, setShortUrl] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2>(1);
    const [shortId, setShortId] = useState<string | null>(null);
    const [heroImageFile, setHeroImageFile] = useState<File | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: DEFAULT_COUPON,
        mode: "onChange",
    });
    const campaignForm = useForm<CampaignFormValues>({
        resolver: zodResolver(campaignSchema),
        defaultValues: { title: "Untitled QR", expiresAt: "" },
        mode: "onChange",
    });

    const data = form.watch();


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const file = e.target.files?.[0];
        if (file) {
            setHeroImageFile(file)
            const reader = new FileReader();
            reader.onload = () => {
                form.setValue("heroImage", { link: reader.result as string, publicImage: false }, { shouldValidate: true });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreate = async () => {
        const campaignValid = await campaignForm.trigger();
        const formValid = await form.trigger();
        if (!campaignValid || !formValid) return;

        const { title, expiresAt } = campaignForm.getValues();

        setIsSaving(true);
        try {
            let dynamicData = { ...data }

            if (heroImageFile) {
                const upload = await imageUploadInR2(heroImageFile)
                if (upload.success) {
                    dynamicData = {
                        ...dynamicData, heroImage: { publicImage: false, link: upload.key }
                    }
                }
                else {
                    toast.error(upload.message as string)
                }
            }
            // Step 1: Create Draft
            const result = await createQRCode({
                title: title,
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
                previewSlot={<PagePreview type="couponPage" data={data} />}
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
                        <Ticket className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-sm">
                            {QR_PAGE_TITLE["couponPage"]}
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Coupon Title</Label>
                            <Input {...form.register("title")} />
                            {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Discount Code</Label>
                                <Input {...form.register("discountCode")} />
                                {form.formState.errors.discountCode && <p className="text-sm text-destructive">{form.formState.errors.discountCode.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Value Label</Label>
                                <Input {...form.register("discountValue")} placeholder="50% OFF" />
                                {form.formState.errors.discountValue && <p className="text-sm text-destructive">{form.formState.errors.discountValue.message}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea {...form.register("description")} rows={3} />
                            {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Expiry Date</Label>
                            <Input type="date" {...form.register("expiryDate")} />
                            {form.formState.errors.expiryDate && <p className="text-sm text-destructive">{form.formState.errors.expiryDate.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Hero Image</Label>
                            <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "heroImage")} />
                            {form.formState.errors.heroImage && <p className="text-sm text-destructive">{form.formState.errors.heroImage?.link?.message || form.formState.errors.heroImage?.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Theme Color</Label>
                            <div className="flex gap-2">
                                <Input type="color" className="w-12 h-10 p-1" {...form.register("themeColor")} />
                                <Input {...form.register("themeColor")} />
                            </div>
                            {form.formState.errors.themeColor && <p className="text-sm text-destructive">{form.formState.errors.themeColor.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Website URL</Label>
                            <Input {...form.register("websiteUrl")} placeholder="https://..." />
                            {form.formState.errors.websiteUrl && <p className="text-sm text-destructive">{form.formState.errors.websiteUrl.message}</p>}
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
