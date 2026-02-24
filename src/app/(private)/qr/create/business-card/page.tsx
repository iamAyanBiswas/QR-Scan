"use client";

import { useState } from "react";
import { QRCreatorShell } from "@/components/block/qr-creator-shell";
import { PageBuilderForm } from "@/components/block/page-builder-form";
import { PagePreview } from "@/components/block/page-preview";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_BUSINESS_CARD } from "@/config/qr-page-builder";

export default function CreateBusinessCardQR() {
    const [data, setData] = useState<BusinessCardData>(DEFAULT_BUSINESS_CARD);

    const handleChange = (key: string, value: string) => {
        setData((prev) => ({ ...prev, [key]: value }))
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                handleChange(key, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <QRCreatorShell
                type="businessCard"
                data={data}
                onDataChange={setData}
                previewSlot={<PagePreview type="businessCard" data={data} />}
            >
                <div className="pt-4 border-t">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Avatar</Label>
                            <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "avatar")} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input value={data.fullName ?? ""} onChange={(e) => setData((prev) => ({ ...prev, fullName: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Job Title</Label>
                                <Input value={data.title ?? ""} onChange={(e) => handleChange("title", e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Company</Label>
                            <Input value={data.company ?? ""} onChange={(e) => handleChange("company", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <Textarea value={data.bio ?? ""} onChange={(e) => handleChange("bio", e.target.value)} rows={3} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value={data.email ?? ""} onChange={(e) => handleChange("email", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input value={data.phone ?? ""} onChange={(e) => handleChange("phone", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Twiter</Label>
                                <Input value={data.twitter ?? ""} onChange={(e) => handleChange("twitter", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Linkedin</Label>
                                <Input value={data.linkedin ?? ""} onChange={(e) => handleChange("linkedin", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Instagram</Label>
                                <Input value={data.instagram ?? ""} onChange={(e) => handleChange("instagram", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Input value={data.address ?? ""} onChange={(e) => handleChange("address", e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Theme Color</Label>
                            <div className="flex gap-2">
                                <Input type="color" className="w-12 h-10 p-1" value={data.themeColor ?? "#000000"} onChange={(e) => handleChange("themeColor", e.target.value)} />
                                <Input value={data.themeColor ?? ""} onChange={(e) => handleChange("themeColor", e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </QRCreatorShell>
        </div>
    );
}
