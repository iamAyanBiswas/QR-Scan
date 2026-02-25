"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { createQRCode } from "@/actions/qr-actions";

import { UtmUrlInput } from "@/components/custom/utm-url-input";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { RedirectPreview } from "@/components/block/redirect-preview";

const campaignSchema = z.object({
    title: z.string().min(1, "Campaign name is required").max(100, "Length should not more then 100"),
    expiresAt: z.string().optional(),
});
const urlSchema = z.object({
    value: z.string()
        .overwrite((val) => {
            const s = val.trim();
            if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s)) return s;
            return `https://${s}`;
        })
        .max(1500, "URL is too long")
        .pipe(z.httpUrl("Enter valid URL"))
}) satisfies z.ZodType<Url>;

type UrlFormValues = z.infer<typeof urlSchema>;
type CampaignFormValues = z.infer<typeof campaignSchema>;


export default function CreateUrlQR() {
    const [isSaving, setIsSaving] = useState(false);
    const [shortUrl, setShortUrl] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2>(1);
    const [shortId, setShortId] = useState<string | null>(null);


    const campaignForm = useForm<CampaignFormValues>({
        resolver: zodResolver(campaignSchema),
        defaultValues: { title: "Untitled QR", expiresAt: "" },
        mode: "onChange",
    });

    const form = useForm<UrlFormValues>({
        resolver: zodResolver(urlSchema),
        defaultValues: { value: "" },
        mode: "onChange",
    });

    // Live data for the shell (used for QR creation payload & preview)
    const data = form.watch();
    const parsed = urlSchema.safeParse(data);
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
                type: "url",
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
        <div className="flex flex-col items-center justify-start min-h-full">
            <QRCreatorShell
                step={step}
                shortId={shortId}
                shortUrl={shortUrl}
                previewSlot={<RedirectPreview type="url" data={normalizedData} />}
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
                    <div className="space-y-2">
                        <Controller
                            name="value"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div className="space-y-1">
                                    <UtmUrlInput
                                        value={field.value}
                                        requireStarStyle={true}
                                        onChange={(val) => field.onChange(val)}
                                    />
                                    {fieldState.error && (
                                        <p className="text-sm text-destructive">
                                            {fieldState.error.message}
                                        </p>
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
