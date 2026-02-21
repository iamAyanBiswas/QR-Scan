import React from "react";
import CouponTemplate from "@/components/renderer/templates/coupon-template";
import BusinessCardTemplate from "@/components/renderer/templates/business-card-template";
import MenuTemplate from "@/components/renderer/templates/menu-template";
import EventTemplate from "@/components/renderer/templates/event-template";
import MarketingTemplate from "@/components/renderer/templates/marketing-template";
import TextTemplate from "@/components/renderer/templates/text-template";

interface PagePreviewProps {
    type: QrPageType
    data: any;
}

export function PagePreview({ type, data }: PagePreviewProps) {
    return (
        <div className="relative mx-auto border-12 border-zinc-900 dark:border-zinc-700 rounded-[3rem] overflow-hidden shadow-2xl max-w-75 aspect-9/19 ring-1 ring-black/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-zinc-900 dark:bg-zinc-700 rounded-b-xl z-20"></div>
            <div className="absolute inset-0 overflow-y-auto custom-scrollbar bg-white">
                {type === "couponPage" && <div className="origin-top w-full"><CouponTemplate data={data as CouponData} /></div>}
                {type === "businessCard" && <div className="origin-top w-full"><BusinessCardTemplate data={data as BusinessCardData} /></div>}
                {type === "menuCard" && <div className="origin-top w-full min-h-full"><MenuTemplate data={data as MenuData} /></div>}
                {type === "eventPage" && <div className="origin-top w-full min-h-full"><EventTemplate data={data as EventPageData} /></div>}
                {type === "marketingPage" && <div className="origin-top w-full min-h-full"><MarketingTemplate data={data as MarketingData} /></div>}
                {type === "textPage" && <div className="origin-top w-full min-h-full"><TextTemplate data={data as TextPageData} /></div>}
            </div>
        </div>
    );
}
