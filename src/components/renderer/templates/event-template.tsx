'use client'
import React from "react";
import { Calendar, Clock, MapPin, User, ArrowRight } from "lucide-react";
import { RendererButton } from "@/components/renderer/ui/button";

export default function EventTemplate({ data }: { data: EventPageData }) {
    if (!data) return null;

    const theme = data.themeColor || "#2563eb"

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-white pb-12" style={{ "--custom-theme": theme } as React.CSSProperties}>
            {/* Hero Image */}
            {data.heroImage ? (
                <div className="h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${data.heroImage})` }} />
            ) : (
                <div className="h-32 w-full bg-custom-theme/10" />
            )}

            <div className="max-w-md mx-auto p-6 -mt-8 relative z-10 bg-white text-black rounded-t-3xl shadow-sm border-t space-y-6">
                <div className="space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-custom-theme">EVENT</span>
                    <h1 className="text-2xl font-bold">{data.title || "Event Title"}</h1>
                    {data.organizer && (
                        <div className="flex items-center text-sm text-black/50 gap-2">
                            <User className="w-4 h-4" /> Hosted by {data.organizer}
                        </div>
                    )}
                </div>

                <div className="space-y-4 text-sm bg-custom-relative-theme/5 p-4 rounded-xl">
                    <div className="flex gap-3 items-start">
                        <Calendar className="w-5 h-5 text-custom-theme shrink-0" />
                        <div>
                            <div className="font-semibold">Start</div>
                            <div className="text-black/50">{formatDate(data.startDate) || "Date TBD"}</div>
                        </div>
                    </div>
                    {data.endDate && (
                        <div className="flex gap-3 items-start">
                            <Clock className="w-5 h-5 text-custom-theme shrink-0" />
                            <div>
                                <div className="font-semibold">End</div>
                                <div className="text-black/50">{formatDate(data.endDate)}</div>
                            </div>
                        </div>
                    )}
                    <div className="flex gap-3 items-start">
                        <MapPin className="w-5 h-5 text-custom-theme shrink-0" />
                        <div>
                            <div className="font-semibold">Location</div>
                            <div className="text-black/50">{data.location || "Location TBD"}</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-bold text-lg">About</h3>
                    <p className="text-blck/50 leading-relaxed text-sm">{data.description || "Event details..."}</p>
                </div>

                {data.agenda && data.agenda.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Agenda</h3>
                        <div className="space-y-0 relative border-l-2 border-custom-relative-theme/30 ml-2 pl-6 pb-2">
                            {data.agenda.map((slot, idx) => (
                                <div key={idx} className="relative mb-6 last:mb-0">
                                    <div className="absolute -left-7.75 top-1 w-3 h-3 rounded-full bg-custom-theme ring-4 ring-white" />
                                    <div className="font-bold text-sm">{slot.time}</div>
                                    <div className="text-black/50 text-sm">{slot.activity}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <RendererButton className="w-full font-bold bg-custom-theme hover:bg-custom-theme/90" size="lg">
                    Register Now <ArrowRight className="w-4 h-4 ml-2" />
                </RendererButton>
            </div>
        </div>
    );
}
