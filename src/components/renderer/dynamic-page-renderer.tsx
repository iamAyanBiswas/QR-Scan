
import React from 'react';
import CouponTemplate from '@/components/renderer/templates/coupon-template';
import BusinessCardTemplate from '@/components/renderer/templates/business-card-template';
import MenuTemplate from '@/components/renderer/templates/menu-template';
import EventTemplate from '@/components/renderer/templates/event-template';
import MarketingTemplate from '@/components/renderer/templates/marketing-template';
import TextTemplate from '@/components/renderer/templates/text-template';
import { AlertTriangle } from 'lucide-react';

interface DynamicRendererProps {
    type: QrPageType;
    data: any;
}

export default function DynamicPageRenderer({ type, data }: DynamicRendererProps) {
    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8">
                    <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold">No Content Found</h1>
                </div>
            </div>
        );
    }


    switch (type) {
        case "couponPage":
            return <CouponTemplate data={data as CouponData} />;

        case "businessCard":
            return <BusinessCardTemplate data={data as BusinessCardData} />;

        case "menuCard":
            return <MenuTemplate data={data as MenuData} />;

        case "eventPage":
            return <EventTemplate data={data as EventPageData} />;

        case "marketingPage":
            return <MarketingTemplate data={data as MarketingData} />;

        case "textPage":
            return <TextTemplate data={data as TextPageData} />;

        default:
            // If it's a legacy URL type getting here by mistake, or unknown
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-muted-foreground">Unknown Page Type: {type}</p>
                </div>
            );
    }
}
