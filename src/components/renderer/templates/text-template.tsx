'use client'
import React from "react";

export default function TextTemplate({ data }: { data: TextPageData }) {
    if (!data) return null;

    return (
        <div
            className="min-h-screen p-6 md:p-12 prose prose-lg dark:prose-invert max-w-2xl mx-auto"
            style={{
                backgroundColor: data.backgroundColor || "#ffffff",
                color: data.textColor || "#000000"
            }}>
            {data.title && (
                <h1 className="mb-8 font-bold border-b pb-4" style={{ borderColor: data.textColor ? `${data.textColor}30` : 'currentColor' }}>
                    {data.title}
                </h1>
            )}

            <div
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: data.content || "" }}
            />
        </div>
    );
}
