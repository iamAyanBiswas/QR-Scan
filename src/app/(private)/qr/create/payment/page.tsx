"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconImageInput } from "@/components/custom/input";
import { cn } from "@/lib/utils";

const urlRegex = /^(https?:\/\/)(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3})(:\d+)?(\/.*)?$/i;

// Regex for UPI ID (e.g., name@bank, phone@paytm)
const upiRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+$/;

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
    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: { gateway: "custom", config: { url: "" } },
        mode: "onChange",
    });

    const data = form.watch();

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

    const parsed = paymentSchema.safeParse(data);
    const normalizedData = parsed.success ? parsed.data : data;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <QRCreatorShell
                type="payment"
                data={normalizedData}
                onDataChange={(newData) => form.reset(newData as PaymentFormValues)}
                onValidate={() => form.trigger()}
            >

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
                                    />
                                    {fieldState.error && <p className="text-sm text-destructive">{fieldState.error.message}</p>}
                                </div>
                            )}
                        />
                    )}
                </div>
            </QRCreatorShell>
        </div>
    );
}
