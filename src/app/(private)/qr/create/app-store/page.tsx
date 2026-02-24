"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { IconImageInput } from "@/components/custom/input";

const appRedirectIconsURL = {
    playstore: "https://img.icons8.com/fluency/48/google-play-store-new.png",
    appstore: "https://img.icons8.com/fluency/48/apple-app-store.png",
    fallback: "https://img.icons8.com/pulsar-gradient/48/external-link.png"
};

const urlRegex = /^(https?:\/\/)(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3})(:\d+)?(\/.*)?$/i;

const appDataSchema = z.object({
    iosUrl: z.string().optional().refine((val) => !val || urlRegex.test(val), "Enter a valid URL"),
    androidUrl: z.string().optional().refine((val) => !val || urlRegex.test(val), "Enter a valid URL"),
    fallbackUrl: z.string().min(1, "Fallback URL is required").refine((val) => urlRegex.test(val), "Enter a valid URL"),
}).refine((data) => data.iosUrl || data.androidUrl, {
    message: "At least one app store URL (iOS or Android) is required",
    path: ["iosUrl"]
}) satisfies z.ZodType<AppData>;

type AppDataFormValues = z.infer<typeof appDataSchema>;

export default function CreateAppStoreQR() {
    const form = useForm<AppDataFormValues>({
        resolver: zodResolver(appDataSchema),
        defaultValues: { iosUrl: "", androidUrl: "", fallbackUrl: "" },
        mode: "onChange",
    });

    const data = form.watch();

    const parsed = appDataSchema.safeParse(data);
    const normalizedData = parsed.success ? parsed.data : data;

    return (
        <div className="flex flex-col items-center justify-center min-h-full">
            <QRCreatorShell
                type="app"
                data={normalizedData}
                onDataChange={(newData) => form.reset(newData)}
                onValidate={() => form.trigger()}
            >
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
                                    />
                                    {fieldState.error && (
                                        <p className="text-sm text-destructive">{fieldState.error.message}</p>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                </div>
            </QRCreatorShell>
        </div>
    );
}
