import type { Options as QRCodeStylingConfig } from "qr-code-styling"
declare global {
    type QrRedirectType = "url" | "app" | "payment"
    type QrPageType = "couponPage" | "businessCard" | "menuCard" | "eventPage" | "textPage"
    type QRType = QrPageType | QrRedirectType

    type DynamicPageDataType = CouponData | BusinessCardData | MenuData | EventPageData | TextPageData
    type DynamicRedirectDataType = AppData | PaymentData | Url

    interface CouponData {
        title: string;
        discountCode: string;
        discountValue?: string; // "50% OFF"
        description?: string;
        expiryDate?: string;
        terms?: string;
        heroImage?: { publicImage: boolean, link: string };
        websiteUrl?: string;
        buttonText?: string;
        themeColor: string;
    }

    interface BusinessCardData {
        fullName: string;
        title?: string;
        company?: string;
        email?: string;
        phone?: string;
        website?: string; //link
        bio?: string;
        image?: { publicImage: boolean, link: string };
        linkedin?: string; //link
        twitter?: string;  //link
        instagram?: string; //link
        address?: string;
        themeColor: string;
    }


    interface MenuData {
        restaurantName: string;
        logo?: { publicImage: boolean, link: string };
        currency: string;
        sections: {
            title: string;
            items: {
                name: string;
                description?: string;
                price?: string;
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
        heroImage?: { publicImage: boolean, link: string };
        organizer: string;
        agenda?: { time: string; activity: string }[];
        registrationUrl?: string;
        themeColor: string;
    }

    interface TextPageData {
        content: string;
        themeColor: string;
    }

    interface Url {
        value: string;
    }

    interface AppData {
        iosUrl?: string;
        androidUrl?: string;
        fallbackUrl: string;
    }

    type PaymentGateway = "upi" | "custom";

    interface UpiPaymentData {
        gateway: "upi";
        config: {
            upiId: string;
            currency: string;
            recipientName?: string;
            amount?: string;
        };
    }

    interface CustomPaymentData {
        gateway: "custom";
        config: {
            url: string;
        };
    }

    type PaymentData = UpiPaymentData | CustomPaymentData;


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