import { create } from "zustand";
import { DotType, CornerSquareType, CornerDotType } from "qr-code-styling";
import { ALL_STYLES as PREMIUM_STYLES } from "@/lib/qr-styles";

interface QrStyleState {
    qrCodeStyle: QRCodeStyle;
    logoFile: File | null;
}

interface QrStyleActions {
    // Full state setters
    setQrCodeStyle: (style: QRCodeStyle | ((prev: QRCodeStyle) => QRCodeStyle)) => void;
    setLogoFile: (file: File | null) => void;

    // Template
    updateTemplate: (templateName: string) => void;

    // Direct nested setters — replaces updateStyleOption
    setDotsType: (type: DotType) => void;
    setDotsColor: (color: string | undefined) => void;
    setDotsGradient: (gradient: any) => void;

    setCornersSquareType: (type: CornerSquareType | undefined) => void;
    setCornersSquareColor: (color: string) => void;

    setCornersDotType: (type: CornerDotType | undefined) => void;
    setCornersDotColor: (color: string) => void;

    setBackgroundColor: (color: string | undefined) => void;
    setBackgroundGradient: (gradient: any) => void;

    setImage: (image: string) => void;
    setImageHideBackgroundDots: (hide: boolean) => void;
    setImageMargin: (margin: number) => void;

    setPublicImage: (isPublic: boolean) => void;

    // Reset
    resetStyle: () => void;
}

const initialStyle: QRCodeStyle = {
    template: "general-minimal",
    style: {},
    publicImage: false,
};

export const useQrStyleStore = create<QrStyleState & QrStyleActions>()((set) => ({
    qrCodeStyle: { ...initialStyle },
    logoFile: null,

    setQrCodeStyle: (style) =>
        set((state) => ({
            qrCodeStyle: typeof style === "function" ? style(state.qrCodeStyle) : style,
        })),

    setLogoFile: (file) => set({ logoFile: file }),

    updateTemplate: (templateName) => {
        const templateOptions = PREMIUM_STYLES.find((s) => s.name === templateName);
        set({
            qrCodeStyle: {
                template: templateName,
                style: templateOptions?.options || {},
                publicImage: templateOptions?.publicImage || false,
            },
        });
    },

    // --- Dots ---
    setDotsType: (type) =>
        set((state) => ({
            qrCodeStyle: {
                ...state.qrCodeStyle,
                style: {
                    ...state.qrCodeStyle.style,
                    dotsOptions: { ...state.qrCodeStyle.style.dotsOptions, type },
                },
            },
        })),

    setDotsColor: (color) =>
        set((state) => ({
            qrCodeStyle: {
                ...state.qrCodeStyle,
                style: {
                    ...state.qrCodeStyle.style,
                    dotsOptions: { ...state.qrCodeStyle.style.dotsOptions, color },
                },
            },
        })),

    setDotsGradient: (gradient) =>
        set((state) => ({
            qrCodeStyle: {
                ...state.qrCodeStyle,
                style: {
                    ...state.qrCodeStyle.style,
                    dotsOptions: { ...state.qrCodeStyle.style.dotsOptions, gradient },
                },
            },
        })),

    // --- Corners Square ---
    setCornersSquareType: (type) =>
        set((state) => ({
            qrCodeStyle: {
                ...state.qrCodeStyle,
                style: {
                    ...state.qrCodeStyle.style,
                    cornersSquareOptions: { ...state.qrCodeStyle.style.cornersSquareOptions, type },
                },
            },
        })),

    setCornersSquareColor: (color) =>
        set((state) => ({
            qrCodeStyle: {
                ...state.qrCodeStyle,
                style: {
                    ...state.qrCodeStyle.style,
                    cornersSquareOptions: { ...state.qrCodeStyle.style.cornersSquareOptions, color },
                },
            },
        })),

    // --- Corners Dot ---
    setCornersDotType: (type) =>
        set((state) => ({
            qrCodeStyle: {
                ...state.qrCodeStyle,
                style: {
                    ...state.qrCodeStyle.style,
                    cornersDotOptions: { ...state.qrCodeStyle.style.cornersDotOptions, type },
                },
            },
        })),

    setCornersDotColor: (color) =>
        set((state) => ({
            qrCodeStyle: {
                ...state.qrCodeStyle,
                style: {
                    ...state.qrCodeStyle.style,
                    cornersDotOptions: { ...state.qrCodeStyle.style.cornersDotOptions, color },
                },
            },
        })),

    // --- Background ---
    setBackgroundColor: (color) =>
        set((state) => ({
            qrCodeStyle: {
                ...state.qrCodeStyle,
                style: {
                    ...state.qrCodeStyle.style,
                    backgroundOptions: { ...state.qrCodeStyle.style.backgroundOptions, color },
                },
            },
        })),

    setBackgroundGradient: (gradient) =>
        set((state) => ({
            qrCodeStyle: {
                ...state.qrCodeStyle,
                style: {
                    ...state.qrCodeStyle.style,
                    backgroundOptions: { ...state.qrCodeStyle.style.backgroundOptions, gradient },
                },
            },
        })),

    // --- Image / Logo ---
    setImage: (image) =>
        set((state) => ({
            qrCodeStyle: {
                ...state.qrCodeStyle,
                style: { ...state.qrCodeStyle.style, image },
            },
        })),

    setImageHideBackgroundDots: (hide) =>
        set((state) => ({
            qrCodeStyle: {
                ...state.qrCodeStyle,
                style: {
                    ...state.qrCodeStyle.style,
                    imageOptions: { ...state.qrCodeStyle.style.imageOptions, hideBackgroundDots: hide },
                },
            },
        })),

    setImageMargin: (margin) =>
        set((state) => ({
            qrCodeStyle: {
                ...state.qrCodeStyle,
                style: {
                    ...state.qrCodeStyle.style,
                    imageOptions: { ...state.qrCodeStyle.style.imageOptions, margin },
                },
            },
        })),

    setPublicImage: (isPublic) =>
        set((state) => ({
            qrCodeStyle: { ...state.qrCodeStyle, publicImage: isPublic },
        })),

    resetStyle: () => set({ qrCodeStyle: { ...initialStyle }, logoFile: null }),
}));
