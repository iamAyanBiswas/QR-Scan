import type { Options as QRCodeStylingConfig } from "qr-code-styling"
declare global {
    type QrRedirectType = "url" | "app" | "payment"
    type QrPageType = "couponPage" | "businessCard" | "menuCard" | "eventPage" | "marketingPage" | "textPage"
    type QRType = QrPageType | QrRedirectType

    type DynamicPageData = CouponData | BusinessCardData | MenuData | EventPageData | MarketingData | TextPageData | SocialData | AppData | PaymentData

    interface CouponData {
        title: string;
        discountCode: string;
        discountValue: string; // "50% OFF"
        description: string;
        expiryDate: string;
        terms: string;
        brandingColor: string;
        heroImage?: string; // Base64 or URL
        websiteUrl?: string;
        buttonText?: string;
    }

    interface BusinessCardData {
        fullName: string;
        title: string;
        company: string;
        email: string;
        phone: string;
        website: string;
        bio: string;
        avatar?: string;
        linkedin?: string;
        twitter?: string;
        instagram?: string;
        address?: string;
        themeColor: string;
    }


    interface MenuData {
        restaurantName: string;
        logo?: string;
        currency: string;
        sections: {
            title: string;
            items: {
                name: string;
                description?: string;
                price: string;
                image?: string;
                allergens?: string[];
            }[];
        }[];
        themeColor: string;
    }

    interface EventPageData {
        title: string;
        startDate: string;
        endDate: string;
        location: string;
        description: string;
        heroImage?: string;
        organizer: string;
        agenda?: { time: string; activity: string }[];
        registrationUrl?: string;
        themeColor: string;
    }

    interface MarketingData {
        headline: string;
        subheadline?: string;
        heroImage?: string;
        bodyText: string;
        ctaIdentifier: string;
        ctaUrl: string;
        themeColor: string;
    }

    interface TextPageData {
        title?: string;
        content: string; // HTML or Markdown supported
        backgroundColor: string;
        textColor: string;
    }



    interface SocialData {
        platforms: { platform: string; url: string; }[];
        autoRedirect?: boolean; // If true, tries to detect user agent or just shows a list
    }

    interface AppData {
        iosUrl?: string;
        androidUrl?: string;
        fallbackUrl: string;
    }

    interface PaymentData {
        recipientName: string;
        amount?: string;
        currency?: string;
        paypalHandle?: string;
        upiId?: string;
        // Stripe link or other payment links
        customLink?: string;
    }
    // Exclude: type, width, height, data, nodeCanvas, jsdom, qrOptions
    type QRStyleOptions = Omit<
        QRCodeStylingConfig,
        "type" | "width" | "height" | "data" | "nodeCanvas" | "jsdom" | "qrOptions"
    >;

    interface QRCodeStyle {
        publicImage: boolean;
        template: string;
        style: QRStyleOptions;
        frame?: unknown;
    }






}

export { }