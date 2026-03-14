"use client";

import { useRef, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import QRCodeDisplay, { QRCodeDisplayRef } from "@/components/custom/qr-code-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingButton from "@/components/custom/loading-button";
import { DateTimePicker } from "@/components/custom/date-time-picker";
import {
    Download,
    Link as LinkIcon,
    Calendar,
    Activity,
    Info,
    Copy,
    Palette,
    FileText,
    Hash,
    Clock,
    QrCode,
    Smartphone,
    Save,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { PagePreview } from "@/components/block/page-preview";
import { RedirectPreview } from "@/components/block/redirect-preview";

// ─── Schema ─────────────────────────────────────────────────────────────────

const formSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or fewer"),
    expiresAt: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Types ───────────────────────────────────────────────────────────────────

interface QRCodeDisplayData {
    id: string;
    shortCode: string;
    title: string;
    type: QRType;
    status: string;
    scans: number;
    expiresAt: Date | null;
    createdAt: Date;
    designStats: any;
    dynamicData: any;
}

interface QRDetailClientProps {
    qr: QRCodeDisplayData;
    domain: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TYPE_BADGE: Record<QRType, string> = {
    url: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    app: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    payment: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    couponPage: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    businessCard: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    menuCard: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    eventPage: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    textPage: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

const PAGE_TYPES: QrPageType[] = ["couponPage", "businessCard", "menuCard", "eventPage", "textPage"];
const isPageType = (type: QRType) => PAGE_TYPES.includes(type as any);


const formatDate = (date: Date | string | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

// ─── Component ───────────────────────────────────────────────────────────────


export default function QRDetailClient({ qr, domain }: QRDetailClientProps) {
    const qrRef = useRef<QRCodeDisplayRef>(null);
    const router = useRouter();

    const fullUrl = `${domain}/${qr.shortCode}`;

    // Memoize so QRCodeDisplay's [options] dep doesn't fire on every form keystroke
    const qrOptions = useMemo(() => ({
        ...qr.designStats,
        width: 260,
        height: 260,
    }), [qr.designStats]);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: qr.title,
            expiresAt: qr.expiresAt ? new Date(qr.expiresAt).toISOString() : "",
        },
    });

    const onSave = async (values: FormValues) => {
        try {
            const res = await fetch("/api/qr", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: qr.id,
                    title: values.title.trim(),
                    expiresAt: values.expiresAt ? new Date(values.expiresAt).toISOString() : null,
                }),
            });
            if (!res.ok) throw new Error();
            toast.success("Changes saved successfully");
        } catch {
            toast.error("Failed to save changes");
        }
    };

    const handleDownload = (format: "png" | "svg") => {
        if (qrRef.current) {
            qrRef.current.download(format);
            toast.success(`QR Code downloaded as ${format.toUpperCase()}`);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(fullUrl);
        toast.success("Link copied to clipboard");
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">QR Code Details</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage and monitor your QR code</p>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">

                {/* ── LEFT: Form + Details ──────────────────────────────────── */}
                <div className="space-y-4">

                    {/* Editable Fields Card */}
                    <Card className="shadow-sm border-border/60">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Info className="h-4 w-4 text-primary" />
                                Edit Details
                            </CardTitle>
                            <CardDescription>Update the title and expiration date</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSave)} className="space-y-5">
                                {/* Title */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="Enter QR code title"
                                        {...register("title")}
                                        className={cn(errors.title && "border-destructive focus-visible:ring-destructive")}
                                    />
                                    {errors.title && (
                                        <p className="text-xs text-destructive">{errors.title.message}</p>
                                    )}
                                </div>

                                {/* Expiration */}
                                <Controller
                                    name="expiresAt"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="space-y-1.5">
                                            <Label htmlFor="expiresAt">Expiration Date</Label>
                                            <DateTimePicker
                                                id="expiresAt"
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Set expiry date & time"
                                                fromDate={new Date()}
                                            />
                                            <p className="text-xs text-muted-foreground">Leave empty for no expiration</p>
                                        </div>
                                    )}
                                />
                                <LoadingButton type="submit" isLoading={isSubmitting} disabled={isSubmitting || !isDirty} className="w-full">
                                    Save Changes
                                </LoadingButton>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Static Details Card */}
                    <Card className="shadow-sm border-border/60">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                Campaign Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid grid-cols-2 gap-4">
                                {/* Status */}
                                <div className="space-y-1 col-span-1">
                                    <dt className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                        <Activity className="h-3.5 w-3.5" /> Status
                                    </dt>
                                    <dd className="flex items-center gap-2">
                                        <span className={cn(
                                            "h-2 w-2 rounded-full shrink-0",
                                            qr.status === "active" ? "bg-emerald-500" : "bg-gray-400"
                                        )} />
                                        <span className="font-semibold capitalize text-sm">{qr.status}</span>
                                    </dd>
                                </div>

                                {/* Type */}
                                <div className="space-y-1 col-span-1">
                                    <dt className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                        <LinkIcon className="h-3.5 w-3.5" /> Type
                                    </dt>
                                    <dd>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide",
                                            TYPE_BADGE[qr.type]
                                        )}>
                                            {qr.type}
                                        </span>
                                    </dd>
                                </div>

                                {/* Total Scans */}
                                <div className="space-y-1 col-span-1">
                                    <dt className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                        <Activity className="h-3.5 w-3.5" /> Total Scans
                                    </dt>
                                    <dd className="font-bold text-xl tracking-tight">{qr.scans.toLocaleString()}</dd>
                                </div>

                                {/* Expiration */}
                                <div className="space-y-1 col-span-1">
                                    <dt className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" /> Expires
                                    </dt>
                                    <dd className="font-medium text-sm">{formatDate(qr.expiresAt)}</dd>
                                </div>

                                {/* Short Code */}
                                <div className="space-y-1 col-span-1">
                                    <dt className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                        <Hash className="h-3.5 w-3.5" /> Short Code
                                    </dt>
                                    <dd className="font-mono text-sm font-medium">{qr.shortCode}</dd>
                                </div>

                                {/* Created At */}
                                <div className="space-y-1 col-span-1">
                                    <dt className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" /> Created
                                    </dt>
                                    <dd className="font-medium text-sm">{formatDate(qr.createdAt)}</dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push(`/qr/update/style/${qr.id}`)}
                        >
                            <Palette className="h-4 w-4 mr-2" />
                            Update Style
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push(`/qr/update/content/${qr.id}`)}
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Update Content
                        </Button>
                    </div>
                </div>

                {/* ── RIGHT: QR Code + Preview Tabs ──────────────────────── */}
                <div>
                    <Tabs defaultValue="qr" className="w-full">
                        <TabsList className="w-full mb-4">
                            <TabsTrigger value="preview" className="flex-1 gap-2">
                                <Smartphone className="h-4 w-4" />
                                Preview
                            </TabsTrigger>
                            <TabsTrigger value="qr" className="flex-1 gap-2">
                                <QrCode className="h-4 w-4" />
                                QR Code
                            </TabsTrigger>

                        </TabsList>

                        {/* Preview Tab */}
                        <TabsContent value="preview">
                            <Card className="shadow-sm border-border/60">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Live Preview</CardTitle>
                                    <CardDescription>
                                        {isPageType(qr.type)
                                            ? "Mobile page users will see after scanning"
                                            : "Redirect destination for this QR code"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex justify-center pb-6">
                                    {
                                        isPageType(qr.type) ?

                                            <PagePreview data={qr.dynamicData} type={qr.type as any} />
                                            :
                                            <RedirectPreview type={qr.type as any} data={qr.dynamicData} />
                                    }
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* QR Tab */}
                        <TabsContent value="qr">
                            <Card className="shadow-sm border-border/60">
                                <CardContent className="p-6">
                                    {/* QR Display — rendered only once */}
                                    <div className="flex justify-center">
                                        <div className="bg-white p-5 rounded-2xl shadow-sm border inline-block">
                                            <QRCodeDisplay
                                                ref={qrRef}
                                                data={fullUrl}
                                                options={qrOptions}
                                                size={260}
                                            />
                                        </div>
                                    </div>

                                    {/* Copy URL Bar */}
                                    <div className="flex items-center justify-between mt-5 p-2.5 bg-muted/50 rounded-lg border">
                                        <span className="text-sm font-mono truncate px-2 text-muted-foreground">
                                            {fullUrl}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 shrink-0 hover:bg-muted"
                                            onClick={handleCopy}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Download Buttons */}
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => handleDownload("svg")}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download SVG
                                        </Button>
                                        <Button
                                            className="w-full"
                                            onClick={() => handleDownload("png")}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download PNG
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>


                    </Tabs>
                </div>
            </div>
        </div>
    );
}
