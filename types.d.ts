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
        heroImage?: string; // Base64 or URL
        websiteUrl?: string;
        buttonText?: string;
        themeColor: string;
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
    }

    interface AppData {
        iosUrl?: string;
        androidUrl?: string;
        fallbackUrl: string;
    }

    // --- Payment: type-safe discriminated union ---
    type PaymentGateway = "paypal" | "stripe" | "upi" | "crypto" | "custom";

    interface PaymentBaseConfig {
        recipientName: string;
        amount: string;
        currency: string;
    }

    interface PaypalPaymentData {
        gateway: "paypal";
        config: PaymentBaseConfig & {
            paypalHandle: string;
        };
    }

    interface StripePaymentData {
        gateway: "stripe";
        config: PaymentBaseConfig & {
            stripeLink: string;
        };
    }

    interface UpiPaymentData {
        gateway: "upi";
        config: PaymentBaseConfig & {
            upiId: string;
        };
    }

    interface CryptoPaymentData {
        gateway: "crypto";
        config: PaymentBaseConfig & {
            walletAddress: string;
            network?: string;
        };
    }

    interface CustomPaymentData {
        gateway: "custom";
        config: {
            url: string;
        };
    }

    type PaymentData = PaypalPaymentData | StripePaymentData | UpiPaymentData | CryptoPaymentData | CustomPaymentData;
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