'use client'
import { RendererButton } from "@/components/renderer/ui/button";
import { Clock, Ticket, ExternalLink, Copy } from "lucide-react";
import { toast } from 'sonner';

export default function CouponTemplate({ data }: { data: CouponData }) {

    const theme = data.themeColor || "back"
    const handleCopy = () => {
        navigator.clipboard.writeText(data.discountCode);
        toast.success("Coupon code copied!");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50" style={{ "--custom-theme": theme } as React.CSSProperties}>
            <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-xl border border-border">
                {/* Hero Section */}
                <div className="relative h-48">
                    {data.heroImage ? (
                        <img
                            src={data.heroImage}
                            alt="Offer"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-custom-theme">
                            <Ticket className="w-16 h-16 text-custom-relative-theme" />
                        </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-black px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        {data.discountValue}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 text-center space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight text-black/80">{data.title}</h1>
                        <p className="text-black/60 text-sm leading-relaxed">
                            {data.description}
                        </p>
                    </div>

                    {/* Coupon Box */}
                    <div
                        className="bg-custom-theme/3 p-4 rounded-xl border-2 border-dashed border-black/20 relative group cursor-pointer hover:border-black/50 transition-colors"
                        onClick={handleCopy}
                    >
                        <p className="text-xs text-black/40 mb-1 uppercase tracking-wider font-semibold">Your Code</p>
                        <div className="flex items-center justify-center gap-2">
                            <code className="text-2xl font-mono font-bold text-black">{data.discountCode}</code>
                            <Copy className="w-4 h-4 text-muted-foreground opacity-50 group-hover:opacity-100" />
                        </div>
                    </div>

                    {/* Meta Info */}
                    {(data.expiryDate || data.terms) && (
                        <div className="text-xs text-muted-foreground space-y-1">
                            {data.expiryDate && (
                                <div className="flex items-center justify-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>Expires: {new Date(data.expiryDate).toLocaleDateString()}</span>
                                </div>
                            )}
                            {data.terms && (
                                <p className="opacity-75 italic">{data.terms}</p>
                            )}
                        </div>
                    )}

                    {/* Action Button */}
                    {data.websiteUrl && (
                        <RendererButton
                            className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl hover:bg-custom-theme/90 transition-all bg-custom-theme"
                            onClick={() => window.open(data.websiteUrl, '_blank')}
                        >
                            {data.buttonText || "Redeem Offer"} <ExternalLink className="w-4 h-4 ml-2" />
                        </RendererButton>
                    )}
                </div>
            </div>
        </div>
    );
}
