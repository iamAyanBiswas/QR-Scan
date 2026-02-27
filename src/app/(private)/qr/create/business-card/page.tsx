"use client";

import { useState } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Loader2 } from "lucide-react";

import { createQRCode } from "@/actions/qr-actions";

import { DEFAULT_BUSINESS_CARD, QR_PAGE_TITLE } from "@/config/qr-page-builder";

import { imageUploadInR2 } from "@/lib/image-upload";

import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { PagePreview } from "@/components/block/page-preview";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const campaignSchema = z.object({
    title: z.string().min(1, "Campaign name is required").max(100, "Length should not more then 100"),
    expiresAt: z.string().optional(),
});


const businessCardSchema = z.object({
    fullName: z.string().min(1, "Full name is required").max(100, "Length should not be more than 100"),
    title: z.string().optional(),
    company: z.string().optional(),
    email: z.union([z.literal(""), z.string().email("Invalid email address")]).optional(),
    phone: z.string().optional(),
    website: z.union([z.literal(""), z.string().url("Invalid URL (e.g., https://example.com)")]).optional(),
    bio: z.string().optional(),
    image: z.object({ publicImage: z.boolean(), link: z.string() }).optional(),
    linkedin: z.union([z.literal(""), z.string().url("Invalid URL (e.g., https://linkedin.com/...)")]).optional(),
    twitter: z.union([z.literal(""), z.string().url("Invalid URL")]).optional(),
    instagram: z.union([z.literal(""), z.string().url("Invalid URL")]).optional(),
    address: z.string().optional(),
    themeColor: z.string().min(1, "Theme color is required"),
}) satisfies z.ZodType<BusinessCardData>;

type CampaignFormValues = z.infer<typeof campaignSchema>;
type BusinessCardFormValues = z.infer<typeof businessCardSchema>


export default function CreateBusinessCardQR() {
    // Dynamic QR State
    const [isSaving, setIsSaving] = useState(false);
    const [shortUrl, setShortUrl] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2>(1);
    const [shortId, setShortId] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null)


    const campaignForm = useForm<CampaignFormValues>({
        resolver: zodResolver(campaignSchema),
        defaultValues: { title: "Untitled QR", expiresAt: "" },
        mode: "onChange",
    });

    const form = useForm<BusinessCardFormValues>({
        resolver: zodResolver(businessCardSchema),
        defaultValues: DEFAULT_BUSINESS_CARD,
        mode: "onChange",
    });

    const data = form.watch()



    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file)
            const reader = new FileReader();
            reader.onload = () => {
                form.setValue("image", { publicImage: false, link: reader.result as string }, { shouldDirty: true, shouldValidate: true })
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
            let dynamicData = { ...data }

            if (imageFile) {
                const upload = await imageUploadInR2(imageFile)
                if (upload.success) {
                    dynamicData = {
                        ...dynamicData, image: { publicImage: false, link: upload.key }
                    }
                }
                else {
                    toast.error(upload.message as string)
                }
            }

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
                previewSlot={<PagePreview type="businessCard" data={data} />}
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

                {/* Form start fron here */}

                <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-4 p-2 bg-muted/50 rounded-lg">
                        <Briefcase className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-sm">{QR_PAGE_TITLE['businessCard']}</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Avatar</Label>
                            <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "avatar")} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input {...form.register("fullName")} />
                                {form.formState.errors.fullName && <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Job Title</Label>
                                <Input {...form.register("title")} />
                                {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Company</Label>
                            <Input {...form.register("company")} />
                            {form.formState.errors.company && <p className="text-sm text-destructive">{form.formState.errors.company.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <Textarea {...form.register("bio")} rows={3} />
                            {form.formState.errors.bio && <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" {...form.register("email")} />
                                {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input type="tel" {...form.register("phone")} />
                                {form.formState.errors.phone && <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Website</Label>
                                <Input type="url" placeholder="https://..." {...form.register("website")} />
                                {form.formState.errors.website && <p className="text-sm text-destructive">{form.formState.errors.website.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Twiter</Label>
                                <Input type="url" placeholder="https://twitter.com/..." {...form.register("twitter")} />
                                {form.formState.errors.twitter && <p className="text-sm text-destructive">{form.formState.errors.twitter.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Linkedin</Label>
                                <Input type="url" placeholder="https://linkedin.com/in/..." {...form.register("linkedin")} />
                                {form.formState.errors.linkedin && <p className="text-sm text-destructive">{form.formState.errors.linkedin.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Instagram</Label>
                                <Input type="url" placeholder="https://instagram.com/..." {...form.register("instagram")} />
                                {form.formState.errors.instagram && <p className="text-sm text-destructive">{form.formState.errors.instagram.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Input {...form.register("address")} />
                                {form.formState.errors.address && <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Theme Color</Label>
                            <Controller
                                name="themeColor"
                                control={form.control}
                                render={({ field }) => (
                                    <div className="flex gap-2">
                                        <Input
                                            type="color"
                                            className="w-12 h-10 p-1"
                                            {...field}
                                            value={field.value || "#000000"}
                                        />
                                        <Input
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </div>
                                )}
                            />
                            {form.formState.errors.themeColor && <p className="text-sm text-destructive">{form.formState.errors.themeColor.message}</p>}
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
