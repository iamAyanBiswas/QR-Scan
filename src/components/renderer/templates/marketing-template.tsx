'use client'
import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketingTemplate({ data }: { data: MarketingData }) {
    if (!data) return null;

    const theme = data.themeColor || "#7c3aed"

    return (
        <div className="bg-white flex flex-col" style={{ "--custom-theme": theme } as React.CSSProperties}>
            {/* Hero Section */}
            <div className="bg-custom-theme/5 pb-12 rounded-b-[3rem] opacity-[1]"></div>
            <div className="mt-12 px-6 pb-6 text-center space-y-6">
                {data.heroImage && (
                    <img src={data.heroImage} alt="Hero" className="w-full aspect-video object-cover rounded-2xl shadow-xl mb-6 bg-white" />
                )}

                <h1 className="text-3xl font-black tracking-tight leading-none text-custom-theme">
                    {data.headline || "Headline Goes Here"}
                </h1>
                <p className="text-xl font-medium text-black/70">
                    {data.subheadline || "Subheadline to support the main message."}
                </p>
            </div>

            {/* Body Content */}
            <div className="px-6 space-y-6 flex-1">
                <div className="text-black/50">
                    {data.bodyText}
                </div>
            </div>

            {/* CTA */}
            <div className="p-6 space-y-6">
                <Button className="w-full text-lg font-bold h-14 shadow-xl bg-custom-theme shadow-custom-theme/20" asChild>
                    <a href={data.ctaUrl || "#"} target="_blank" rel="noreferrer">
                        {data.ctaIdentifier || "Get Started"} <ArrowRight className="ml-2 w-5 h-5" />
                    </a>
                </Button>
            </div>
        </div>
    );
}
