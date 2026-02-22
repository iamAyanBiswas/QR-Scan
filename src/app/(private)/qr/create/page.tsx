import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
    Link as LinkIcon,
    AppWindow,
    CreditCard,
    Briefcase,
    Ticket,
    Utensils,
    Calendar,
    Megaphone,
    FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const qrCategories = [
    {
        section: "Hosted Pages",
        items: [
            { href: "/qr/create/business-card", icon: Briefcase, label: "Business Card", description: "Contact information" },
            { href: "/qr/create/coupon", icon: Ticket, label: "Coupon", description: "Discount codes" },
            { href: "/qr/create/menu", icon: Utensils, label: "Menu", description: "Restaurant menu" },
            { href: "/qr/create/event", icon: Calendar, label: "Event", description: "Event details" },
            { href: "/qr/create/marketing", icon: Megaphone, label: "Marketing", description: "Landing page" },
            { href: "/qr/create/text", icon: FileText, label: "Text Page", description: "Rich text content" },
        ],
    },
    {
        section: "Smart Redirects",
        items: [
            { href: "/qr/create/url", icon: LinkIcon, label: "URL", description: "Simple website link" },
            { href: "/qr/create/app-store", icon: AppWindow, label: "App Store", description: "iOS/Android apps" },
            { href: "/qr/create/payment", icon: CreditCard, label: "Payment", description: "Payment details" },
        ],
    },
];

export default function CreateQR() {
    return (
        <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Create a QR Code</h1>
                <p className="text-muted-foreground">Choose the type of QR code you want to create</p>
            </div>

            {qrCategories.map((category) => (
                <div key={category.section} className="space-y-4">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        {category.section}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {category.items.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <Card className={cn(
                                        "h-full cursor-pointer border-2 transition-all hover:shadow-lg hover:scale-105 hover:border-primary/50"
                                    )}>
                                        <CardContent className="flex flex-col items-center p-6">
                                            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                                                <Icon className="w-7 h-7" />
                                            </div>
                                            <h3 className="font-semibold text-sm mb-1">{item.label}</h3>
                                            <p className="text-xs text-muted-foreground text-center">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}