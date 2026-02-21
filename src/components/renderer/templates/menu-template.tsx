'use client'
import React from "react";
import { Utensils } from "lucide-react";

export default function MenuTemplate({ data }: { data: MenuData }) {
    if (!data) return null;
    const theme = data.themeColor || '#ea580c'

    return (
        <div className="min-h-screen bg-white text-black pb-12" style={{ "--custom-theme": theme } as React.CSSProperties}>
            {/* Header */}
            <div className="p-6 text-center space-y-4 bg-custom-theme">
                {data.logo && (
                    <img src={data.logo} alt="Logo" className="w-24 h-24 rounded-full mx-auto border-4 border-white object-cover" />
                )}
                <h1 className="text-3xl font-bold text-white">{data.restaurantName || "Restaurant Name"}</h1>
            </div>

            {/* Content */}
            <div className="max-w-md mx-auto p-4 space-y-8 mt-4">
                {(data.sections || []).map((section, idx) => (
                    <div key={idx} className="space-y-4">
                        <h2 className="text-xl font-bold border-b-2 border-custom-theme pb-2 uppercase tracking-wide text-custom-theme">
                            {section.title}
                        </h2>
                        <div className="space-y-4">
                            {section.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm text-black/60">{item.description}</p>
                                    </div>
                                    <div className="font-bold whitespace-nowrap text-custom-theme">
                                        {data.currency}{item.price}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {(!data.sections || data.sections.length === 0) && (
                    <div className="text-center text-muted-foreground py-12">
                        <Utensils className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Menu items will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
