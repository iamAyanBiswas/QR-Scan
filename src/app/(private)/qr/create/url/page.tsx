"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { UtmUrlInput } from "@/components/custom/utm-url-input";

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

export default function CreateUrlQR() {
    const form = useForm<UrlFormValues>({
        resolver: zodResolver(urlSchema),
        defaultValues: { value: "" },
        mode: "onChange",
    });

    // Live data for the shell (used for QR creation payload & preview)
    const data = form.watch();

    const parsed = urlSchema.safeParse(data);
    const normalizedData = parsed.success ? parsed.data : data;

    return (
        <div className="flex flex-col items-center justify-start min-h-full">
            <QRCreatorShell
                type="url"
                data={normalizedData}
                onDataChange={(newData) => form.reset(newData)}
                onValidate={() => form.trigger()}
            >
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
            </QRCreatorShell>
        </div>
    );
}
