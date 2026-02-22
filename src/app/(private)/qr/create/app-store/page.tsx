"use client";

import { useState } from "react";
import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { IconImageInput } from "@/components/custom/input";

const appRedirectIconsURL = {
    playstore: "https://img.icons8.com/fluency/48/google-play-store-new.png",
    appstore: "https://img.icons8.com/fluency/48/apple-app-store.png",
    fallback: "https://img.icons8.com/pulsar-gradient/48/external-link.png"
};

export default function CreateAppStoreQR() {
    const [data, setData] = useState({ ios: "", android: "", fallback: "" });

    return (
        <div className="flex flex-col items-center justify-center min-h-full">
            <QRCreatorShell type="app" data={data} onDataChange={setData}>
                <div className="space-y-4">
                    <IconImageInput
                        name="ios"
                        label="iOS App Store URL"
                        placeholder="https://apps.apple.com/..."
                        url={appRedirectIconsURL.appstore}
                        value={data.ios || ""}
                        onChange={(e) => setData((prev) => ({ ...prev, ios: e.target.value }))}
                    />
                    <IconImageInput
                        name="android"
                        label="Google Play Store URL"
                        placeholder="https://play.google.com/..."
                        url={appRedirectIconsURL.playstore}
                        value={data.android || ""}
                        onChange={(e) => setData((prev) => ({ ...prev, android: e.target.value }))}
                    />
                    <IconImageInput
                        name="fallback"
                        label="Fallback URL (Web)"
                        placeholder="https://myapp.com"
                        url={appRedirectIconsURL.fallback}
                        value={data.fallback || ""}
                        onChange={(e) => setData((prev) => ({ ...prev, fallback: e.target.value }))}
                    />
                </div>
            </QRCreatorShell>
        </div>
    );
}
