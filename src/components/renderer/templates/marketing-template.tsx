'use client'
import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketingTemplate({ data }: { data: MarketingData }) {
    if (!data) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col" style={{ "--primary": data.themeColor || "#7c3aed" } as React.CSSProperties}>
            {/* Hero Section */}
            <div className="bg-primary/5 pb-12 rounded-b-[3rem]" style={{ backgroundColor: "var(--primary)", opacity: 0.1 }}></div>
            <div className="-mt-12 px-6 pb-6 text-center space-y-6">
                {data.heroImage && (
                    <img src={data.heroImage} alt="Hero" className="w-full aspect-video object-cover rounded-2xl shadow-xl mb-6 bg-muted" />
                )}

                <h1 className="text-3xl font-black tracking-tight leading-none" style={{ color: "var(--primary)" }}>
                    {data.headline || "Headline Goes Here"}
                </h1>
                <p className="text-xl font-medium text-muted-foreground">
                    {data.subheadline || "Subheadline to support the main message."}
                </p>
            </div>

            {/* Body Content */}
            <div className="px-6 space-y-6 flex-1">
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                    {data.bodyText}
                </div>
            </div>

            {/* CTA */}
            <div className="p-6 mt-auto">
                <Button className="w-full text-lg font-bold h-14 shadow-xl shadow-primary/20" style={{ backgroundColor: "var(--primary)" }} asChild>
                    <a href={data.ctaUrl || "#"} target="_blank" rel="noreferrer">
                        {data.ctaIdentifier || "Get Started"} <ArrowRight className="ml-2 w-5 h-5" />
                    </a>
                </Button>
            </div>
        </div>
    );
}
