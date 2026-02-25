"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { createQRCode } from "@/actions/qr-actions";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { IconImageInput } from "@/components/custom/input";

import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { RedirectPreview } from "@/components/block/redirect-preview";

const appRedirectIconsURL = {
    playstore: "https://img.icons8.com/fluency/48/google-play-store-new.png",
    appstore: "https://img.icons8.com/fluency/48/apple-app-store.png",
    fallback: "https://img.icons8.com/pulsar-gradient/48/external-link.png"
};

const urlRegex = /^(https?:\/\/)(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3})(:\d+)?(\/.*)?$/i;

const campaignSchema = z.object({
    title: z.string().min(1, "Campaign name is required").max(100, "Length should not more then 100"),
    expiresAt: z.string().optional(),
});

const appDataSchema = z.object({
    iosUrl: z.string().optional().refine((val) => !val || urlRegex.test(val), "Enter a valid URL"),
    androidUrl: z.string().optional().refine((val) => !val || urlRegex.test(val), "Enter a valid URL"),
    fallbackUrl: z.string().min(1, "Fallback URL is required").refine((val) => urlRegex.test(val), "Enter a valid URL"),
}).refine((data) => data.iosUrl || data.androidUrl, {
    message: "At least one app store URL (iOS or Android) is required",
    path: ["iosUrl"]
}) satisfies z.ZodType<AppData>;

type AppDataFormValues = z.infer<typeof appDataSchema>;
type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function CreateAppStoreQR() {

    const [isSaving, setIsSaving] = useState(false);
    const [shortUrl, setShortUrl] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2>(1);
    const [shortId, setShortId] = useState<string | null>(null);

    const campaignForm = useForm<CampaignFormValues>({
        resolver: zodResolver(campaignSchema),
        defaultValues: { title: "Untitled QR", expiresAt: "" },
        mode: "onChange",
    });

    const form = useForm<AppDataFormValues>({
        resolver: zodResolver(appDataSchema),
        defaultValues: { iosUrl: "", androidUrl: "", fallbackUrl: "" },
        mode: "onChange",
    });


    const data = form.watch();
    const parsed = appDataSchema.safeParse(data);
    const normalizedData = parsed.success ? parsed.data : data;

    const handleCreate = async () => {
        // Validate campaign details (title)
        const campaignValid = await campaignForm.trigger();
        const formValid = await form.trigger();

        if (!campaignValid || !formValid) return;

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
        <div className="flex flex-col items-center justify-center min-h-full">
            <QRCreatorShell
                step={step}
                shortId={shortId}
                shortUrl={shortUrl}
                previewSlot={<RedirectPreview type="app" data={normalizedData} />}
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
                <div className="pt-4 border-t">
                    <div className="space-y-4 w-full">
                        <Controller
                            name="iosUrl"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div className="space-y-1">
                                    <IconImageInput
                                        label="iOS App Store URL"
                                        placeholder="https://apps.apple.com/..."
                                        url={appRedirectIconsURL.appstore}
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    {fieldState.error && (
                                        <p className="text-sm text-destructive">{fieldState.error.message}</p>
                                    )}
                                </div>
                            )}
                        />
                        <Controller
                            name="androidUrl"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div className="space-y-1">
                                    <IconImageInput
                                        label="Google Play Store URL"
                                        placeholder="https://play.google.com/..."
                                        url={appRedirectIconsURL.playstore}
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                    {fieldState.error && (
                                        <p className="text-sm text-destructive">{fieldState.error.message}</p>
                                    )}
                                </div>
                            )}
                        />
                        <Controller
                            name="fallbackUrl"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div className="space-y-1">
                                    <IconImageInput
                                        label="Fallback URL (Web)"
                                        placeholder="https://myapp.com"
                                        url={appRedirectIconsURL.fallback}
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        requireStarStyle={true}
                                    />
                                    {fieldState.error && (
                                        <p className="text-sm text-destructive">{fieldState.error.message}</p>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                </div>
                <Button onClick={handleCreate} className="w-full mt-6" size="lg" disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Create QR
                </Button>
            </QRCreatorShell>
        </div>
    );
}
