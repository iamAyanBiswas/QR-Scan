"use client";

import { useState } from "react";
import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconImageInput } from "@/components/custom/input";
import { cn } from "@/lib/utils";

function InputField({ name, placeholder, label, value, onChange, type = "text" }: {
    name: string;
    placeholder: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

const paymentGateways: { value: PaymentGateway; label: string; icon: string }[] = [
    { value: "paypal", label: "PayPal", icon: "https://img.icons8.com/fluency/48/paypal.png" },
    { value: "stripe", label: "Stripe", icon: "https://img.icons8.com/fluency/48/stripe.png" },
    { value: "upi", label: "UPI", icon: "https://img.icons8.com/color/48/bhim.png" },
    { value: "crypto", label: "Crypto", icon: "https://img.icons8.com/fluency/48/bitcoin.png" },
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
    const [data, setData] = useState<PaymentData>({
        gateway: "paypal",
        config: { recipientName: "", amount: "", currency: "USD", paypalHandle: "" }
    } as PaymentData);

    const handleGatewayChange = (gw: PaymentGateway) => {
        const base = { recipientName: (data.config as any)?.recipientName || "", amount: (data.config as any)?.amount || "", currency: (data.config as any)?.currency || "USD" };
        switch (gw) {
            case "paypal": setData({ gateway: "paypal", config: { ...base, paypalHandle: "" } }); break;
            case "stripe": setData({ gateway: "stripe", config: { ...base, stripeLink: "" } }); break;
            case "upi": setData({ gateway: "upi", config: { ...base, upiId: "" } }); break;
            case "crypto": setData({ gateway: "crypto", config: { ...base, walletAddress: "", network: "" } }); break;
            case "custom": setData({ gateway: "custom", config: { url: "" } }); break;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <QRCreatorShell type="payment" data={data} onDataChange={setData}>
                <div className="space-y-5">
                    {/* Payment Gateway Selector */}
                    <div className="space-y-2">
                        <Label>Payment Gateway</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {paymentGateways.map((gw) => (
                                <button
                                    key={gw.value}
                                    type="button"
                                    onClick={() => handleGatewayChange(gw.value)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:shadow-sm",
                                        data.gateway === gw.value
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

                    {/* Common fields (hidden for custom) */}
                    {data.gateway !== "custom" && (
                        <>
                            <InputField
                                name="recipientName"
                                label="Recipient Name"
                                placeholder="John Doe or Business Name"
                                value={data.config?.recipientName || ""}
                                onChange={(e) => setData((prev: any) => ({ ...prev, config: { ...prev.config, recipientName: e.target.value } }))}
                            />

                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={(data.config as any)?.amount || ""}
                                        onChange={(e) => setData((prev: any) => ({ ...prev, config: { ...prev.config, amount: e.target.value } }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Currency</Label>
                                    <Select
                                        value={(data.config as any)?.currency || "USD"}
                                        onValueChange={(val) => setData((prev: any) => ({ ...prev, config: { ...prev.config, currency: val } }))}
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
                                </div>
                            </div>
                        </>
                    )}

                    {/* Gateway-specific Fields */}
                    {data.gateway === "paypal" && (
                        <IconImageInput
                            name="paypalHandle"
                            label="PayPal Username / Email"
                            placeholder="user@email.com or @username"
                            url="https://img.icons8.com/fluency/48/paypal.png"
                            value={(data.config as any)?.paypalHandle || ""}
                            onChange={(e) => setData((prev: any) => ({ ...prev, config: { ...prev.config, paypalHandle: e.target.value } }))}
                        />
                    )}

                    {data.gateway === "stripe" && (
                        <IconImageInput
                            name="stripeLink"
                            label="Stripe Payment Link"
                            placeholder="https://buy.stripe.com/..."
                            url="https://img.icons8.com/fluency/48/stripe.png"
                            value={(data.config as any)?.stripeLink || ""}
                            onChange={(e) => setData((prev: any) => ({ ...prev, config: { ...prev.config, stripeLink: e.target.value } }))}
                        />
                    )}

                    {data.gateway === "upi" && (
                        <IconImageInput
                            name="upiId"
                            label="UPI ID"
                            placeholder="name@upi or 9876543210@paytm"
                            url="https://img.icons8.com/ios-filled/50/bhim-upi.png"
                            value={(data.config as any)?.upiId || ""}
                            onChange={(e) => setData((prev: any) => ({ ...prev, config: { ...prev.config, upiId: e.target.value } }))}
                        />
                    )}

                    {data.gateway === "crypto" && (
                        <div className="space-y-4">
                            <InputField
                                name="walletAddress"
                                label="Wallet Address"
                                placeholder="0x1234... or bc1q..."
                                value={(data.config as any)?.walletAddress || ""}
                                onChange={(e) => setData((prev: any) => ({ ...prev, config: { ...prev.config, walletAddress: e.target.value } }))}
                            />
                            <div className="space-y-2">
                                <Label>Network</Label>
                                <Select
                                    value={(data.config as any)?.network || ""}
                                    onValueChange={(val) => setData((prev: any) => ({ ...prev, config: { ...prev.config, network: val } }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select network" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ethereum">Ethereum</SelectItem>
                                        <SelectItem value="bitcoin">Bitcoin</SelectItem>
                                        <SelectItem value="solana">Solana</SelectItem>
                                        <SelectItem value="polygon">Polygon</SelectItem>
                                        <SelectItem value="bnb">BNB Chain</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {data.gateway === "custom" && (
                        <IconImageInput
                            name="url"
                            label="Payment URL"
                            placeholder="https://your-payment-link.com/pay"
                            url="https://img.icons8.com/pulsar-gradient/48/external-link.png"
                            value={(data.config as any)?.url || ""}
                            onChange={(e) => setData((prev: any) => ({ ...prev, config: { ...prev.config, url: e.target.value } }))}
                        />
                    )}
                </div>
            </QRCreatorShell>
        </div>
    );
}
