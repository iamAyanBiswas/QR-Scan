'use client'
import React from "react";
import { Calendar, Clock, MapPin, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventTemplate({ data }: { data: EventPageData }) {
    if (!data) return null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-background pb-12" style={{ "--primary": data.themeColor || "#2563eb" } as React.CSSProperties}>
            {/* Hero Image */}
            {data.heroImage ? (
                <div className="h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${data.heroImage})` }} />
            ) : (
                <div className="h-32 w-full bg-primary/10" style={{ backgroundColor: "var(--primary)", opacity: 0.1 }} />
            )}

            <div className="max-w-md mx-auto p-6 -mt-8 relative z-10 bg-background rounded-t-3xl shadow-sm border-t space-y-6">
                <div className="space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-primary" style={{ backgroundColor: "var(--primary)" }}>EVENT</span>
                    <h1 className="text-2xl font-bold">{data.title || "Event Title"}</h1>
                    {data.organizer && (
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                            <User className="w-4 h-4" /> Hosted by {data.organizer}
                        </div>
                    )}
                </div>

                <div className="space-y-4 text-sm bg-muted/30 p-4 rounded-xl">
                    <div className="flex gap-3 items-start">
                        <Calendar className="w-5 h-5 text-primary shrink-0" style={{ color: "var(--primary)" }} />
                        <div>
                            <div className="font-semibold">Start</div>
                            <div className="text-muted-foreground">{formatDate(data.startDate) || "Date TBD"}</div>
                        </div>
                    </div>
                    {data.endDate && (
                        <div className="flex gap-3 items-start">
                            <Clock className="w-5 h-5 text-primary shrink-0" style={{ color: "var(--primary)" }} />
                            <div>
                                <div className="font-semibold">End</div>
                                <div className="text-muted-foreground">{formatDate(data.endDate)}</div>
                            </div>
                        </div>
                    )}
                    <div className="flex gap-3 items-start">
                        <MapPin className="w-5 h-5 text-primary shrink-0" style={{ color: "var(--primary)" }} />
                        <div>
                            <div className="font-semibold">Location</div>
                            <div className="text-muted-foreground">{data.location || "Location TBD"}</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-bold text-lg">About</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{data.description || "Event details..."}</p>
                </div>

                {data.agenda && data.agenda.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Agenda</h3>
                        <div className="space-y-0 relative border-l-2 border-muted ml-2 pl-6 pb-2">
                            {data.agenda.map((slot, idx) => (
                                <div key={idx} className="relative mb-6 last:mb-0">
                                    <div className="absolute -left-7.75 top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-background" style={{ backgroundColor: "var(--primary)" }} />
                                    <div className="font-bold text-sm">{slot.time}</div>
                                    <div className="text-muted-foreground text-sm">{slot.activity}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <Button className="w-full font-bold" size="lg" style={{ backgroundColor: "var(--primary)" }}>
                    Register Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
