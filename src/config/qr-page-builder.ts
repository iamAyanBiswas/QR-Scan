export const QR_PAGE_TITLE = {
    couponPage: "Editing Coupon Details",
    businessCard: "Editing Business Card",
    menuCard: "Editing Restaurant Menu",
    eventPage: "Editing Event Page",
    marketingPage: "Editing Marketing Layout",
    textPage: "Editing Text Content",
};


export const DEFAULT_COUPON: CouponData = {
    title: "Summer Sale",
    discountCode: "SUMMER50",
    discountValue: "50% OFF",
    description: "Get half off on all items this summer. Limited time offer.",
    expiryDate: "",
    terms: "One use per customer.",
    brandingColor: "#ec4899",
    buttonText: "Redeem Now"
};

export const DEFAULT_BUSINESS_CARD: BusinessCardData = {
    fullName: "Alex Smith",
    title: "Senior Developer",
    company: "Tech Corp",
    email: "alex@example.com",
    phone: "+1 234 567 8900",
    website: "https://example.com",
    bio: "Passionate about building great software.",
    themeColor: "#000000",
    avatar: "https://github.com/shadcn.png"
};


export const DEFAULT_MENU: MenuData = {
    restaurantName: "The Gourmet Spot",
    currency: "$",
    themeColor: "#ea580c", // Orange
    sections: [
        {
            title: "Starters",
            items: [
                { name: "Bruschetta", price: "8.99", description: "Toasted bread with tomatoes and basil." },
                { name: "Calamari", price: "12.99", description: "Fried squid with marinara." }
            ]
        },
        {
            title: "Mains",
            items: [
                { name: "Grilled Salmon", price: "24.99", description: "Served with asparagus." }
            ]
        }
    ]
};

export const DEFAULT_EVENT_PAGE: EventPageData = {
    title: "Tech Conference 2024",
    startDate: "",
    endDate: "",
    location: "Convention Center, SF",
    description: "Join us for the biggest tech event of the year.",
    organizer: "TechWorld Inc.",
    themeColor: "#2563eb", // Blue
    agenda: [
        { time: "09:00", activity: "Registration" },
        { time: "10:00", activity: "Keynote Speech" }
    ]
};

export const DEFAULT_MARKETING: MarketingData = {
    headline: "Launch Your Product",
    subheadline: "The best platform for growth.",
    bodyText: "Start your journey today with our amazing tools.",
    ctaIdentifier: "Get Started",
    ctaUrl: "https://example.com/signup",
    themeColor: "#7c3aed" // Violet
};

export const DEFAULT_TEXT_PAGE: TextPageData = {
    title: "Information",
    content: "<h2>Welcome</h2><p>This is a simple text page. You can add <b>bold</b> text or links.</p>",
    backgroundColor: "#ffffff",
    textColor: "#000000"
};


