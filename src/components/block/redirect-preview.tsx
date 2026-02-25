import { Smartphone } from "lucide-react";

export function RedirectPreview({ type, data }: { type: QrRedirectType, data: any }) {
    return (
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-xl bg-muted/30">
            <div className="text-center text-muted-foreground p-6">
                <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
                <p className="text-sm max-w-xs mx-auto">
                    Enter your content and click &quot;Next&quot; to generate your dynamic QR code.

                    {/* Show Redirect preview only for url */}
                    {type === "url" && data.value && (
                        <span className="block mt-4 p-2 bg-background border rounded text-xs break-all">
                            Redirects to: <br />
                            <span className="text-primary">{data.value}</span>
                        </span>
                    )}
                </p>
            </div>
        </div>
    )
}