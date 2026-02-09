export const QR_REDIRECT_TYPE: QrRedirectType[] = ["url", "social", "app", "payment", "location"]
export const QR_PAGE_TYPE: QrPageType[] = ["couponPage", "businessCard", "menuCard", "eventPage", "marketingPage", "textPage"]


export const QR_CODE_PAGE_TYPE = ["couponPage", "businessCard", "menuCard", "eventPage", "marketingPage", "textPage"] as const
export const QrCodePageType = typeof QR_CODE_PAGE_TYPE

