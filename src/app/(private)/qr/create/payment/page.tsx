"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { IconImageInput } from "@/components/custom/input";

import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { RedirectPreview } from "@/components/block/redirect-preview";

import { createQRCode } from "@/actions/qr-actions";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const urlRegex = /^(https?:\/\/)(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3})(:\d+)?(\/.*)?$/i;

// Regex for UPI ID (e.g., name@bank, phone@paytm)
const upiRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+$/;
const campaignSchema = z.object({
    title: z.string().min(1, "Campaign name is required").max(100, "Length should not more then 100"),
    expiresAt: z.string().optional(),
});

const upiSchema = z.object({
    gateway: z.literal("upi"),
    config: z.object({
        upiId: z.string().min(1, "UPI ID is required").regex(upiRegex, "Invalid UPI ID"),
        currency: z.string().min(1, "Currency is required"),
        recipientName: z.string().optional(),
        amount: z.string().optional(),
    }),
});

const customSchema = z.object({
    gateway: z.literal("custom"),
    config: z.object({
        url: z.string().min(1, "URL is required").regex(urlRegex, "Enter a valid URL"),
    }),
});

const paymentSchema = z.discriminatedUnion("gateway", [
    upiSchema,
    customSchema,
]) satisfies z.ZodType<PaymentData>;

type PaymentFormValues = z.infer<typeof paymentSchema>;
type CampaignFormValues = z.infer<typeof campaignSchema>;


const paymentGateways: { value: PaymentGateway; label: string; icon: string }[] = [
    { value: "upi", label: "UPI", icon: "https://img.icons8.com/color/48/bhim.png" },
    { value: "custom", label: "Custom Link", icon: "https://img.icons8.com/pulsar-gradient/48/external-link.png" },
];

const currencies = [
    { value: "USD", label: "USD ($)", symbol: "$" },
    { value: "EUR", label: "EUR (€)", symbol: "€" },
    { value: "GBP", label: "GBP (£)", symbol: "£" },
    { value: "INR", label: "INR (₹)", symbol: "₹" },
    { value: "JPY", label: "JPY (¥)", symbol: "¥" },
    { value: "CAD", label: "CAD ($)", symbol: "$" },
    { value: "AUD", label: "AUD ($)", symbol: "$" },
    { value: "BRL", label: "BRL (R$)", symbol: "R$" },
];

export default function CreatePaymentQR() {
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

    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: { gateway: "custom", config: { url: "" } },
        mode: "onChange",
    });

    const data = form.watch();
    const parsed = paymentSchema.safeParse(data);
    const normalizedData = parsed.success ? parsed.data : data;

    const handleGatewayChange = (gw: PaymentGateway) => {
        if (gw === "upi") {
            form.reset({
                gateway: "upi",
                config: { upiId: "", currency: "INR", recipientName: "", amount: "" }
            });
        } else {
            form.reset({
                gateway: "custom",
                config: { url: "" }
            });
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

            // Step 1: Create Draft
            const result = await createQRCode({
                title: title || "Untitled QR",
                type: "payment",
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
                previewSlot={<RedirectPreview type="payment" data={normalizedData} />}
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
                <div className="space-y-5 w-full">
                    {/* Payment Gateway Selector */}
                    <Controller
                        name="gateway"
                        control={form.control}
                        render={({ field }) => (
                            <div className="space-y-2">
                                <Label>Payment Gateway</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {paymentGateways.map((gw) => (
                                        <button
                                            key={gw.value}
                                            type="button"
                                            onClick={() => handleGatewayChange(gw.value)}
                                            className={cn(
                                                "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:shadow-sm",
                                                field.value === gw.value
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:border-primary/40"
                                            )}
                                        >
                                            <img src={gw.icon} alt={gw.label} className="w-7 h-7 object-contain" />
                                            <span className="text-xs font-medium">{gw.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    />

                    {data.gateway === "upi" && (
                        <>
                            <Controller
                                name="config.recipientName"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <div className="space-y-2">
                                        <Label>Recipient Name</Label>
                                        <Input
                                            type="text"
                                            placeholder="John Doe or Business Name"
                                            value={field.value || ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                        {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
                                    </div>
                                )}
                            />

                            <div className="grid grid-cols-3 gap-3">
                                <Controller
                                    name="config.amount"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <div className="col-span-2 space-y-2">
                                            <Label>Amount</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
                                        </div>
                                    )}
                                />

                                <Controller
                                    name="config.currency"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <div className="space-y-2">
                                            <Label>Currency</Label>
                                            <Select
                                                value={field.value}
                                                onValueChange={(val) => field.onChange(val)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Currency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {currencies.map((c) => (
                                                        <SelectItem key={c.value} value={c.value}>
                                                            {c.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
                                        </div>
                                    )}
                                />
                            </div>

                            <Controller
                                name="config.upiId"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <div className="space-y-1">
                                        <IconImageInput
                                            label="UPI ID"
                                            placeholder="name@upi or 9876543210@paytm"
                                            url="https://img.icons8.com/color/48/bhim.png"
                                            value={field.value || ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            requireStarStyle={true}
                                        />
                                        {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
                                    </div>
                                )}
                            />
                        </>
                    )}

                    {data.gateway === "custom" && (
                        <Controller
                            name="config.url"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div className="space-y-1">
                                    <IconImageInput
                                        label="Payment URL"
                                        placeholder="https://your-payment-link.com/pay"
                                        url="https://img.icons8.com/pulsar-gradient/48/external-link.png"
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        requireStarStyle={true}
                                    />
                                    {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
                                </div>
                            )}
                        />
                    )}
                </div>
                <Button onClick={handleCreate} className="w-full mt-6" size="lg" disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Create QR
                </Button>
            </QRCreatorShell>
        </div>
    );
}
