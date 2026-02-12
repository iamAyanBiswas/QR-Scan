// Visual icon components for QR code style options

// Dots Style Icons
export const DotsSquareIcon = () => (
    <div className="w-8 h-8 grid grid-cols-3 gap-0.5">
        {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-current rounded-none" />
        ))}
    </div>
);

export const DotsRoundIcon = () => (
    <div className="w-8 h-8 grid grid-cols-3 gap-0.5">
        {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-current rounded-full" />
        ))}
    </div>
);

export const DotsRoundedIcon = () => (
    <div className="w-8 h-8 grid grid-cols-3 gap-0.5">
        {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-current rounded-sm" />
        ))}
    </div>
);

export const DotsExtraRoundedIcon = () => (
    <div className="w-8 h-8 grid grid-cols-3 gap-0.5">
        {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-current rounded-md" />
        ))}
    </div>
);

export const DotsClassyIcon = () => (
    <div className="w-8 h-8 grid grid-cols-3 gap-0.5">
        {Array.from({ length: 9 }).map((_, i) => (
            <div
                key={i}
                className="bg-current"
                style={{
                    clipPath: i % 2 === 0
                        ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                        : 'circle(50%)'
                }}
            />
        ))}
    </div>
);

export const DotsClassyRoundedIcon = () => (
    <div className="w-8 h-8 grid grid-cols-3 gap-0.5">
        {Array.from({ length: 9 }).map((_, i) => (
            <div
                key={i}
                className="bg-current rounded-sm"
                style={{
                    clipPath: i % 2 === 0
                        ? 'none'
                        : 'circle(50%)'
                }}
            />
        ))}
    </div>
);

// Corner Style Icons
export const CornerSquareIcon = () => (
    <div className="w-8 h-8 p-0.5 border-2 border-current rounded-none">
        <div className="w-full h-full border border-current" />
    </div>
);

export const CornerDotIcon = () => (
    <div className="w-8 h-8 p-0.5 border-2 border-current rounded-full">
        <div className="w-full h-full bg-current rounded-full" />
    </div>
);

export const CornerExtraRoundedIcon = () => (
    <div className="w-8 h-8 p-0.5 border-2 border-current rounded-lg">
        <div className="w-full h-full border border-current rounded-md" />
    </div>
);

export const CornerNoneIcon = () => (
    <div className="w-8 h-8 flex items-center justify-center">
        <div className="w-6 h-0.5 bg-current rotate-45" />
        <div className="w-6 h-0.5 bg-current -rotate-45 absolute" />
    </div>
);

// Corner Center Dot Icons
export const CornerCenterSquareIcon = () => (
    <div className="w-8 h-8 flex items-center justify-center">
        <div className="w-4 h-4 bg-current rounded-none" />
    </div>
);

export const CornerCenterDotIcon = () => (
    <div className="w-8 h-8 flex items-center justify-center">
        <div className="w-4 h-4 bg-current rounded-full" />
    </div>
);
