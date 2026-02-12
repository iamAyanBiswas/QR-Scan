import { cn } from "@/lib/utils";

interface StyleButtonProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    className?: string;
}

export function StyleButton({
    icon,
    label,
    isActive,
    onClick,
    className
}: StyleButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "relative p-3 rounded-lg border-2 transition-all duration-200",
                "hover:border-primary hover:shadow-md hover:scale-105",
                "flex flex-col items-center justify-center gap-2",
                "min-w-20",
                isActive
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card",
                className
            )}
            aria-label={label}
            type="button"
        >
            <div className="w-8 h-8 flex items-center justify-center">
                {icon}
            </div>
            <span className="text-xs font-medium capitalize leading-tight">
                {label}
            </span>
        </button>
    );
}
