import { Options, CornerDotType, CornerSquareType, DotType } from "qr-code-styling";



export type QRStyle = {
    name: string;
    label: string;
    publicImage: boolean
    description?: string;
    options: QRStyleOptions;
};

export type QRCategory = {
    id: string;
    label: string;
    styles: QRStyle[];
};

// --- Helpers for Gradients ---
const linearGradient = (deg: number, c1: string, c2: string) => ({
    type: "linear" as const,
    rotation: deg,
    colorStops: [
        { offset: 0, color: c1 },
        { offset: 1, color: c2 },
    ],
});

const radialGradient = (c1: string, c2: string) => ({
    type: "radial" as const,
    rotation: 0,
    colorStops: [
        { offset: 0, color: c1 },
        { offset: 1, color: c2 },
    ],
});

// Common defaults for explicitly undefined properties
// This helps ensure we meet the strict type requirement while keeping code clean(er)
const defaults: QRStyleOptions = {
    shape: "square",
    margin: 0,
    image: undefined,
    imageOptions: {
        'hideBackgroundDots': undefined,
        'crossOrigin': undefined,
        'imageSize': undefined,
        'margin': undefined,
        'saveAsBlob': undefined
    },
    dotsOptions: {
        'color': undefined,
        'gradient': undefined,
        'roundSize': undefined,
        'type': undefined
    },
    cornersDotOptions: {
        'color': undefined,
        'gradient': undefined,
        'type': undefined
    },
    cornersSquareOptions: {
        'color': undefined,
        'gradient': undefined,
        'type': undefined
    },
    backgroundOptions: {
        'color': undefined,
        'gradient': undefined,
        'round': undefined
    }
};

// ============================================================================
// 1. GENERAL STYLES (Simple, Beautiful, Clean)
// ============================================================================
const GENERAL_STYLES: QRStyle[] = [
    {
        name: "general-minimal",
        label: "Minimalist",
        publicImage: false,
        options: {
            ...defaults,
            shape: "square",
            margin: 0,
            image: undefined,
            dotsOptions: { type: "rounded", color: "#1e293b", gradient: undefined }, // Slate-800
            backgroundOptions: { color: "#ffffff", gradient: undefined },
            cornersSquareOptions: { type: "extra-rounded", color: "#1e293b", gradient: undefined },
            cornersDotOptions: { type: "dot", color: "#1e293b", gradient: undefined },
        },
    },
    {
        name: "general-elegant",
        label: "Gold Elegance",
        publicImage: false,
        options: {
            ...defaults,
            shape: "square",
            margin: 0,
            image: undefined,
            dotsOptions: {
                type: "classy",
                gradient: radialGradient("#d4af37", "#a67c00"),
                color: undefined,
            },
            backgroundOptions: { color: "#fafafa", gradient: undefined },
            cornersSquareOptions: { type: "square", color: "#8a6603", gradient: undefined },
            cornersDotOptions: { type: "square", color: "#d4af37", gradient: undefined },
        },
    },
    {
        name: "general-soft",
        label: "Soft Pastel",
        publicImage: false,
        options: {
            ...defaults,
            dotsOptions: {
                type: "extra-rounded",
                gradient: linearGradient(45, "#a78bfa", "#f472b6"), // Purple to Pink
                color: undefined,
            },
            backgroundOptions: { color: "#fdf4ff", gradient: undefined },
            cornersSquareOptions: { type: "extra-rounded", color: "#9333ea", gradient: undefined },
            cornersDotOptions: { type: "dot", color: "#db2777", gradient: undefined },
        },
    },
    {
        name: "general-neon",
        label: "Cyber Neon",
        publicImage: false,
        options: {
            ...defaults,
            dotsOptions: { type: "square", color: "#00ff9d", gradient: undefined },
            backgroundOptions: { color: "#0a0a0a", gradient: undefined },
            cornersSquareOptions: { type: "square", color: "#00cc7d", gradient: undefined },
            cornersDotOptions: { type: "square", color: "#00ff9d", gradient: undefined },
        },
    },
    {
        name: "general-corporate",
        label: "Corporate Tech",
        publicImage: false,
        options: {
            ...defaults,
            dotsOptions: { type: "dots", color: "#0f172a", gradient: undefined }, // Dark Blue
            backgroundOptions: { color: "#f1f5f9", gradient: undefined },
            cornersSquareOptions: { type: "extra-rounded", color: "#334155", gradient: undefined },
            cornersDotOptions: { type: "dot", color: "#0f172a", gradient: undefined },
        },
    },
    {
        name: "general-crimson",
        label: "Bold Crimson",
        publicImage: false,
        options: {
            ...defaults,
            dotsOptions: {
                type: "rounded",
                gradient: linearGradient(135, "#ef4444", "#991b1b"),
                color: undefined,
            },
            backgroundOptions: { color: "#fffebf", gradient: undefined }, // Very light yellow tint
            cornersSquareOptions: { type: "extra-rounded", color: "#7f1d1d", gradient: undefined },
            cornersDotOptions: { type: "dot", color: "#b91c1c", gradient: undefined },
        },
    },
];

// ============================================================================
// 2. SOCIAL STYLES (Brand Colors)
// ============================================================================
const SOCIAL_STYLES: QRStyle[] = [
    {
        name: "social-instagram",
        label: "Instagram Vibe",
        publicImage: false,
        options: {
            ...defaults,
            dotsOptions: {
                type: "extra-rounded",
                gradient: linearGradient(45, "#833ab4", "#fd1d1d"), // Insta Gradient
                color: undefined,
            },
            backgroundOptions: { color: "#fff0f5", gradient: undefined },
            cornersSquareOptions: { type: "extra-rounded", color: "#c13584", gradient: undefined },
            cornersDotOptions: { type: "dot", color: "#fd1d1d", gradient: undefined },
        },
    },
    {
        name: "social-whatsapp",
        label: "WhatsApp Vibe",
        publicImage: false,
        options: {
            ...defaults,
            dotsOptions: { type: "dots", color: "#25D366", gradient: undefined },
            backgroundOptions: { color: "#dcf8c6", gradient: undefined },
            cornersSquareOptions: { type: "extra-rounded", color: "#128C7E", gradient: undefined },
            cornersDotOptions: { type: "dot", color: "#075E54", gradient: undefined },
        },
    },
    {
        name: "social-telegram",
        label: "Telegram Vibe",
        publicImage: false,
        options: {
            ...defaults,
            dotsOptions: { type: "classy", color: "#229ED9", gradient: undefined },
            backgroundOptions: { color: "#f0f8ff", gradient: undefined },
            cornersSquareOptions: { type: "extra-rounded", color: "#0088cc", gradient: undefined },
            cornersDotOptions: { type: "dot", color: "#0088cc", gradient: undefined },
        },
    },
    {
        name: "social-facebook",
        label: "Facebook Vibe",
        publicImage: false,
        options: {
            ...defaults,
            dotsOptions: { type: "rounded", color: "#1877F2", gradient: undefined },
            backgroundOptions: { color: "#ffffff", gradient: undefined },
            cornersSquareOptions: { type: "square", color: "#1877F2", gradient: undefined },
            cornersDotOptions: { type: "square", color: "#1877F2", gradient: undefined },
        },
    },
    {
        name: "social-twitter",
        label: "X / Twitter",
        publicImage: false,
        options: {
            ...defaults,
            dotsOptions: { type: "square", color: "#000000", gradient: undefined },
            backgroundOptions: { color: "#ffffff", gradient: undefined },
            cornersSquareOptions: { type: "extra-rounded", color: "#000000", gradient: undefined },
            cornersDotOptions: { type: "square", color: "#000000", gradient: undefined },
        },
    },
    {
        name: "social-youtube",
        label: "YouTube Vibe",
        publicImage: false,
        options: {
            ...defaults,
            dotsOptions: { type: "classy-rounded", color: "#FF0000", gradient: undefined },
            backgroundOptions: { color: "#ffffff", gradient: undefined },
            cornersSquareOptions: { type: "extra-rounded", color: "#FF0000", gradient: undefined },
            cornersDotOptions: { type: "dot", color: "#282828", gradient: undefined },
        },
    },
];

// Combine all for easy access if needed
export const ALL_STYLES = [...GENERAL_STYLES, ...SOCIAL_STYLES];

// Export Categories
export const QR_CATEGORIES: QRCategory[] = [
    { id: "general", label: "General", styles: GENERAL_STYLES },
    { id: "social", label: "Social", styles: SOCIAL_STYLES },
];
