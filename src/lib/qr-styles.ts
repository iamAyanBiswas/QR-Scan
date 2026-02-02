import { Options } from "qr-code-styling";

export type QRStyle = {
    name: string;
    label: string;
    description?: string;
    options: Partial<Options>;
};

export type QRCategory = {
    id: string;
    label: string;
    styles: QRStyle[];
};

// Helper for linear gradients
const linearGradient = (deg: number, c1: string, c2: string) => ({
    type: "linear" as const,
    rotation: deg,
    colorStops: [{ offset: 0, color: c1 }, { offset: 1, color: c2 }]
});

// Helper for radial gradients
const radialGradient = (c1: string, c2: string) => ({
    type: "radial" as const,
    rotation: 0,
    colorStops: [{ offset: 0, color: c1 }, { offset: 1, color: c2 }]
});

// ============================================================================
// 1. GEN-Z VIBE (Neon, Bold, High Contrast, Glitchy)
// ============================================================================
const GEN_Z_STYLES: QRStyle[] = [
    {
        name: "genz-neon-pink", label: "Neon Pop",
        options: {
            dotsOptions: { type: "square", gradient: linearGradient(45, "#FF00CC", "#3333FF") },
            backgroundOptions: { color: "#ffffff" },
            cornersSquareOptions: { type: "extra-rounded", color: "#FF00CC" },
            cornersDotOptions: { type: "dot", color: "#3333FF" }
        }
    },
    {
        name: "genz-acid-green", label: "Acid Slime",
        options: {
            dotsOptions: { type: "classy", color: "#ccff00" },
            backgroundOptions: { color: "#000000" },
            cornersSquareOptions: { type: "square", color: "#ccff00" },
            cornersDotOptions: { type: "square", color: "#ffffff" }
        }
    },
    {
        name: "genz-glitch", label: "Glitch",
        options: {
            dotsOptions: { type: "square", gradient: linearGradient(90, "#00FFFF", "#FF0055") },
            cornersSquareOptions: { type: "square", color: "#000000" },
            cornersDotOptions: { type: "square", color: "#FF0055" }
        }
    },
    {
        name: "genz-lavender", label: "Soft Haze",
        options: {
            dotsOptions: { type: "rounded", color: "#A78BFA" },
            backgroundOptions: { color: "#F5F3FF" },
            cornersSquareOptions: { type: "extra-rounded", color: "#8B5CF6" },
            cornersDotOptions: { type: "dot", color: "#7C3AED" }
        }
    },
    {
        name: "genz-orange-soda", label: "Orange Soda",
        options: {
            dotsOptions: { type: "dots", color: "#FF6600" },
            backgroundOptions: { color: "#FFF7ED" },
            cornersSquareOptions: { type: "dot", color: "#FF4500" },
            cornersDotOptions: { type: "dot", color: "#FF4500" }
        }
    },
    {
        name: "genz-cyber-yellow", label: "Cyber Yellow",
        options: {
            dotsOptions: { type: "classy-rounded", color: "#FFD600" },
            backgroundOptions: { color: "#212121" },
            cornersSquareOptions: { type: "extra-rounded", color: "#FFFF00" },
            cornersDotOptions: { type: "dot", color: "#FFFF00" }
        }
    },
    {
        name: "genz-vaporwave", label: "Vaporwave",
        options: {
            dotsOptions: { type: "rounded", gradient: linearGradient(135, "#ff71ce", "#01cdfe") },
            backgroundOptions: { color: "#fff" },
            cornersSquareOptions: { type: "extra-rounded", color: "#05ffa1" },
            cornersDotOptions: { type: "dot", color: "#b967ff" }
        }
    },
    {
        name: "genz-y2k", label: "Y2K Chrome",
        options: {
            dotsOptions: { type: "square", gradient: linearGradient(0, "#C0C0C0", "#505050") },
            cornersSquareOptions: { type: "square", color: "#A0A0A0" },
            cornersDotOptions: { type: "square", color: "#404040" }
        }
    },
    {
        name: "genz-hyper-blue", label: "Hyper Blue",
        options: {
            dotsOptions: { type: "dots", color: "#2E55FF" },
            backgroundOptions: { color: "#E0E7FF" },
            cornersSquareOptions: { type: "extra-rounded", color: "#0022AA" },
            cornersDotOptions: { type: "dot", color: "#0022AA" }
        }
    },
    {
        name: "genz-candy", label: "Candy Shop",
        options: {
            dotsOptions: { type: "classy", gradient: radialGradient("#FF9A9E", "#FECFEF") },
            cornersSquareOptions: { type: "extra-rounded", color: "#FF6B6B" },
            cornersDotOptions: { type: "dot", color: "#FF6B6B" }
        }
    }
];

// ============================================================================
// 2. MODERN BRAND (Clean, Professional, Gradients, Rounded)
// ============================================================================
const BRAND_STYLES: QRStyle[] = [
    {
        name: "brand-corporate-blue", label: "Trust Blue",
        options: {
            dotsOptions: { type: "rounded", color: "#0F172A" },
            cornersSquareOptions: { type: "extra-rounded", color: "#334155" },
            cornersDotOptions: { type: "dot", color: "#334155" }
        }
    },
    {
        name: "brand-fintech", label: "Fintech Green",
        options: {
            dotsOptions: { type: "dots", gradient: linearGradient(90, "#10B981", "#059669") },
            cornersSquareOptions: { type: "extra-rounded", color: "#047857" },
            cornersDotOptions: { type: "dot", color: "#047857" }
        }
    },
    {
        name: "brand-luxury", label: "Luxury Dark",
        options: {
            dotsOptions: { type: "classy", color: "#D4AF37" },
            backgroundOptions: { color: "#18181B" },
            cornersSquareOptions: { type: "square", color: "#D4AF37" },
            cornersDotOptions: { type: "square", color: "#D4AF37" }
        }
    },
    {
        name: "brand-minimal-grey", label: "Minimal Grey",
        options: {
            dotsOptions: { type: "rounded", color: "#525252" },
            cornersSquareOptions: { type: "extra-rounded", color: "#262626" },
            cornersDotOptions: { type: "dot", color: "#262626" } // Clean, Apple-esque
        }
    },
    {
        name: "brand-startup-purple", label: "Startup Purple",
        options: {
            dotsOptions: { type: "dots", gradient: linearGradient(135, "#7C3AED", "#4F46E5") },
            cornersSquareOptions: { type: "extra-rounded", color: "#4338CA" },
            cornersDotOptions: { type: "dot", color: "#4338CA" }
        }
    },
    {
        name: "brand-social-red", label: "Social Red",
        options: {
            dotsOptions: { type: "rounded", gradient: linearGradient(45, "#EF4444", "#DC2626") },
            cornersSquareOptions: { type: "extra-rounded", color: "#B91C1C" },
            cornersDotOptions: { type: "dot", color: "#B91C1C" }
        }
    },
    {
        name: "brand-eco", label: "Eco Friendly",
        options: {
            dotsOptions: { type: "classy-rounded", color: "#65A30D" }, // Lime/Green
            cornersSquareOptions: { type: "extra-rounded", color: "#4D7C0F" },
            cornersDotOptions: { type: "dot", color: "#3F6212" }
        }
    },
    {
        name: "brand-health", label: "Health Blue",
        options: {
            dotsOptions: { type: "dots", color: "#0EA5E9" }, // Sky blue
            cornersSquareOptions: { type: "extra-rounded", color: "#0284C7" },
            cornersDotOptions: { type: "dot", color: "#0284C7" }
        }
    },
    {
        name: "brand-sunset-gradient", label: "Warm Brand",
        options: {
            dotsOptions: { type: "rounded", gradient: linearGradient(180, "#F59E0B", "#EA580C") },
            cornersSquareOptions: { type: "extra-rounded", color: "#C2410C" },
            cornersDotOptions: { type: "dot", color: "#C2410C" }
        }
    },
    {
        name: "brand-dark-mode", label: "SaaS Dark",
        options: {
            dotsOptions: { type: "square", color: "#94A3B8" },
            backgroundOptions: { color: "#0F172A" },
            cornersSquareOptions: { type: "square", color: "#E2E8F0" },
            cornersDotOptions: { type: "square", color: "#E2E8F0" }
        }
    }
];

// ============================================================================
// 3. CREATIVE & ARTISTIC (Unusual shapes, mixed colors)
// ============================================================================
const CREATIVE_STYLES: QRStyle[] = [
    {
        name: "creative-dots", label: "Polka Dots",
        options: {
            dotsOptions: { type: "dots", color: "#EC4899" },
            backgroundOptions: { color: "#FDF2F8" },
            cornersSquareOptions: { type: "dot", color: "#BE185D" },
            cornersDotOptions: { type: "dot", color: "#BE185D" }
        }
    },
    {
        name: "creative-fluid", label: "Fluid Blue",
        options: {
            dotsOptions: { type: "classy", gradient: radialGradient("#60A5FA", "#2563EB") },
            cornersSquareOptions: { type: "extra-rounded", color: "#1D4ED8" },
            cornersDotOptions: { type: "dot", color: "#1E3A8A" }
        }
    },
    {
        name: "creative-galaxy", label: "Galaxy",
        options: {
            dotsOptions: { type: "rounded", gradient: linearGradient(60, "#6366f1", "#d946ef") },
            backgroundOptions: { color: "#1e1b4b" },
            cornersSquareOptions: { type: "extra-rounded", color: "#c026d3" },
            cornersDotOptions: { type: "dot", color: "#4f46e5" }
        }
    },
    {
        name: "creative-nature", label: "Forest",
        options: {
            dotsOptions: { type: "classy-rounded", color: "#166534" },
            cornersSquareOptions: { type: "extra-rounded", color: "#14532D" },
            cornersDotOptions: { type: "dot", color: "#14532D" },
            backgroundOptions: { color: "#F0FDF4" }
        }
    },
    {
        name: "creative-mosaic", label: "Mosaic",
        options: {
            dotsOptions: { type: "square", color: "#0D9488" },
            cornersSquareOptions: { type: "square", color: "#0F766E" },
            cornersDotOptions: { type: "square", color: "#115E59" },
            backgroundOptions: { color: "#F0FDFA" }
        }
    },
    {
        name: "creative-sunflower", label: "Sunflower",
        options: {
            dotsOptions: { type: "classy", color: "#EAB308" },
            cornersSquareOptions: { type: "dot", color: "#A16207" },
            cornersDotOptions: { type: "dot", color: "#A16207" },
            backgroundOptions: { color: "#FEFCE8" }
        }
    },
    {
        name: "creative-berry", label: "Berry Mix",
        options: {
            dotsOptions: { type: "rounded", gradient: linearGradient(120, "#9F1239", "#881337") },
            cornersSquareOptions: { type: "extra-rounded", color: "#4C0519" },
            cornersDotOptions: { type: "dot", color: "#4C0519" }
        }
    },
    {
        name: "creative-ocean", label: "Deep Ocean",
        options: {
            dotsOptions: { type: "dots", gradient: linearGradient(0, "#0891B2", "#0E7490") },
            backgroundOptions: { color: "#ECFEFF" },
            cornersSquareOptions: { type: "extra-rounded", color: "#155E75" },
            cornersDotOptions: { type: "dot", color: "#155E75" }
        }
    },
    {
        name: "creative-coffee", label: "Coffee Break",
        options: {
            dotsOptions: { type: "rounded", color: "#78350F" },
            backgroundOptions: { color: "#FFFBEB" },
            cornersSquareOptions: { type: "extra-rounded", color: "#451A03" },
            cornersDotOptions: { type: "dot", color: "#451A03" }
        }
    },
    {
        name: "creative-royal", label: "Royal Gold",
        options: {
            dotsOptions: { type: "classy", gradient: linearGradient(45, "#8E44AD", "#F1C40F") },
            cornersSquareOptions: { type: "dot", color: "#F39C12" },
            cornersDotOptions: { type: "dot", color: "#8E44AD" }
        }
    }
];

// ============================================================================
// 4. AI & TECH (High-tech, Matrix, Futuristic)
// ============================================================================
const AI_STYLES: QRStyle[] = [
    {
        name: "ai-matrix", label: "The Matrix",
        options: {
            dotsOptions: { type: "square", color: "#00FF41" },
            backgroundOptions: { color: "#0D0208" },
            cornersSquareOptions: { type: "square", color: "#008F11" },
            cornersDotOptions: { type: "square", color: "#00FF41" }
        }
    },
    {
        name: "ai-cyber-grid", label: "Cyber Grid",
        options: {
            dotsOptions: { type: "square", color: "#00E5FF" },
            backgroundOptions: { color: "#001524" },
            cornersSquareOptions: { type: "square", color: "#2979FF" },
            cornersDotOptions: { type: "square", color: "#00E5FF" }
        }
    },
    {
        name: "ai-neural", label: "Neural Net",
        options: {
            dotsOptions: { type: "dots", gradient: radialGradient("#6366F1", "#A855F7") },
            backgroundOptions: { color: "#030712" },
            cornersSquareOptions: { type: "extra-rounded", color: "#A855F7" },
            cornersDotOptions: { type: "dot", color: "#6366F1" }
        }
    },
    {
        name: "ai-robotics", label: "Robotics",
        options: {
            dotsOptions: { type: "square", color: "#9CA3AF" },
            backgroundOptions: { color: "#111827" },
            cornersSquareOptions: { type: "square", color: "#E5E7EB" },
            cornersDotOptions: { type: "square", color: "#F3F4F6" }
        }
    },
    {
        name: "ai-future-red", label: "Red ALERT",
        options: {
            dotsOptions: { type: "square", color: "#EF4444" },
            backgroundOptions: { color: "#450A0A" },
            cornersSquareOptions: { type: "square", color: "#F87171" },
            cornersDotOptions: { type: "square", color: "#FCA5A5" }
        }
    },
    {
        name: "ai-quantum", label: "Quantum",
        options: {
            dotsOptions: { type: "classy", gradient: linearGradient(90, "#14B8A6", "#8B5CF6") },
            backgroundOptions: { color: "#FEF2F2" }, // White-ish
            cornersSquareOptions: { type: "extra-rounded", color: "#0F766E" },
            cornersDotOptions: { type: "dot", color: "#7C3AED" }
        }
    },
    {
        name: "ai-deep-mind", label: "Deep Thought",
        options: {
            dotsOptions: { type: "rounded", color: "#4F46E5" },
            backgroundOptions: { color: "#EEF2FF" },
            cornersSquareOptions: { type: "extra-rounded", color: "#312E81" },
            cornersDotOptions: { type: "dot", color: "#312E81" }
        }
    },
    {
        name: "ai-circuit", label: "Circuit Board",
        options: {
            dotsOptions: { type: "extra-rounded", color: "#059669" },
            backgroundOptions: { color: "#064E3B" },
            cornersSquareOptions: { type: "square", color: "#34D399" },
            cornersDotOptions: { type: "square", color: "#34D399" }
        }
    },
    {
        name: "ai-hologram", label: "Hologram",
        options: {
            dotsOptions: { type: "dots", color: "#22D3EE" },
            backgroundOptions: { color: "#083344" },
            cornersSquareOptions: { type: "extra-rounded", color: "#67E8F9" },
            cornersDotOptions: { type: "dot", color: "#A5F3FC" }
        }
    },
    {
        name: "ai-data-stream", label: "Data Stream",
        options: {
            dotsOptions: { type: "square", gradient: linearGradient(180, "#3B82F6", "#10B981") },
            cornersSquareOptions: { type: "square", color: "#1D4ED8" },
            cornersDotOptions: { type: "square", color: "#059669" }
        }
    }
];

// ============================================================================
// 5. CLASSIC & ESSENTIAL (Standard but polished)
// ============================================================================
const CLASSIC_STYLES: QRStyle[] = [
    {
        name: "classic-black", label: "Pure Black",
        options: { dotsOptions: { type: "square", color: "#000000" } }
    },
    {
        name: "classic-rounded", label: "Soft Black",
        options: { dotsOptions: { type: "rounded", color: "#171717" }, cornersSquareOptions: { type: "extra-rounded", color: "#171717" } }
    },
    {
        name: "classic-dots", label: "Dotted Black",
        options: { dotsOptions: { type: "dots", color: "#262626" }, cornersSquareOptions: { type: "dot", color: "#262626" } }
    },
    {
        name: "classic-blue", label: "Standard Blue",
        options: { dotsOptions: { type: "square", color: "#2563EB" }, cornersSquareOptions: { type: "square", color: "#1D4ED8" } }
    },
    {
        name: "classic-navy", label: "Navy",
        options: { dotsOptions: { type: "rounded", color: "#1E3A8A" }, cornersSquareOptions: { type: "extra-rounded", color: "#1E3A8A" } }
    },
    {
        name: "classic-red", label: "Alert Red",
        options: { dotsOptions: { type: "square", color: "#DC2626" } }
    },
    {
        name: "classic-white-bg", label: "Card White",
        options: { dotsOptions: { type: "square", color: "#000000" }, backgroundOptions: { color: "#FFFFFF" } }
    },
    {
        name: "classic-transparent", label: "Transparent",
        options: { dotsOptions: { type: "square", color: "#000000" }, backgroundOptions: { color: "transparent" } }
    },
    {
        name: "classic-heavy", label: "Heavy Duty",
        options: { dotsOptions: { type: "square", color: "#000000" }, cornersSquareOptions: { type: "square", color: "#000000" }, imageOptions: { margin: 0 } }
    },
    {
        name: "classic-light", label: "Light Grey",
        options: { dotsOptions: { type: "square", color: "#525252" } }
    }

];

// ============================================================================
// 6. THE HIVE (Branded / Featured)
// ============================================================================
const THE_HIVE_STYLES: QRStyle[] = [
    {
        name: "hive-tech-brand", label: "Tech Giant",
        options: {
            dotsOptions: { type: "square", gradient: linearGradient(135, "#000000", "#434343") },
            cornersSquareOptions: { type: "square", color: "#000000" },
            cornersDotOptions: { type: "square", color: "#000000" },
            backgroundOptions: { color: "#ffffff" },
            imageOptions: { margin: 5, imageSize: 0.4 }
        }
    },
    {
        name: "hive-eco-green", label: "Eco Innovator",
        options: {
            dotsOptions: { type: "classy-rounded", color: "#4d7c0f" },
            cornersSquareOptions: { type: "extra-rounded", color: "#365314" },
            cornersDotOptions: { type: "dot", color: "#365314" },
            backgroundOptions: { color: "#f7fee7" }
        }
    },
    {
        name: "hive-social-pop", label: "Social Influencer",
        options: {
            dotsOptions: { type: "dots", gradient: linearGradient(45, "#833ab4", "#fd1d1d") },
            cornersSquareOptions: { type: "extra-rounded", color: "#c13584" },
            cornersDotOptions: { type: "dot", color: "#fd1d1d" }
        }
    },
    {
        name: "hive-platinum", label: "Platinum Tier",
        options: {
            dotsOptions: { type: "classy", gradient: linearGradient(150, "#3E5151", "#DECBA4") },
            backgroundOptions: { color: "#1a1a1a" },
            cornersSquareOptions: { type: "dot", color: "#DECBA4" },
            cornersDotOptions: { type: "dot", color: "#DECBA4" }
        }
    }
];

export const QR_CATEGORIES: QRCategory[] = [
    { id: "the-hive", label: "The Hive (Featured)", styles: THE_HIVE_STYLES },
    { id: "gen-z", label: "Gen-Z Vibe", styles: GEN_Z_STYLES },
    { id: "modern", label: "Modern Brand", styles: BRAND_STYLES },
    { id: "creative", label: "Creative", styles: CREATIVE_STYLES },
    { id: "ai", label: "AI & Tech", styles: AI_STYLES },
    { id: "classic", label: "Classics", styles: CLASSIC_STYLES },
];

export const ALL_STYLES = [
    ...THE_HIVE_STYLES,
    ...GEN_Z_STYLES,
    ...BRAND_STYLES,
    ...CREATIVE_STYLES,
    ...AI_STYLES,
    ...CLASSIC_STYLES
];
