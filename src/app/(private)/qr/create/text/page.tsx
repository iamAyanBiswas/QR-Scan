"use client";

import { useState } from "react";
import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { PagePreview } from "@/components/block/page-preview";
import { DEFAULT_TEXT_PAGE } from "@/config/qr-page-builder";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextEditor } from "@/components/custom/text-editor";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createQRCode } from "@/actions/qr-actions";
import { toast } from "sonner";


const campaignSchema = z.object({
    title: z.string().min(1, "Campaign name is required").max(100, "Length should not more then 100"),
    expiresAt: z.string().optional(),
});
const formSchema = z.object({
    content: z.string().min(1, "Text is required").max(10000, "Too much text"),
    themeColor: z.string().min(1, "Theme color is required"),
}) satisfies z.ZodType<TextPageData>

type CampaignFormValues = z.infer<typeof campaignSchema>;
type FormValues = z.infer<typeof formSchema>;


export default function CreateTextPageQR() {
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
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: DEFAULT_TEXT_PAGE,
        mode: "onChange",
    })

    const data = form.watch()

    const handleCreate = async () => {
        const campaignValid = await campaignForm.trigger();
        const formValid = await form.trigger();
        console.log(form.formState.errors)
        if (!campaignValid || !formValid) return;

        const { title, expiresAt } = campaignForm.getValues();

        setIsSaving(true);
        try {
            // Step 1: Create Draft
            const result = await createQRCode({
                title: title,
                type: "textPage",
                dynamicData: data,
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
                previewSlot={<PagePreview type="textPage" data={data} />}
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
                    <Label className="mb-2 block">Text</Label>
                    <TextEditor data={data.content} onUpdate={(e) => { form.setValue('content', e) }} />
                    {form.formState.errors.content && <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>}
                </div>
                <Button onClick={handleCreate} className="w-full mt-6" size="lg" disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Next Step →
                </Button>
            </QRCreatorShell>
        </div >
    );
}
