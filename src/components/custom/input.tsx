import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label";

export interface IconImageInputProps extends Omit<React.ComponentProps<"input">, "type"> {
    url: string;
    value: string;
    label: string
    iconClassName?: string;
    containerClassName?: string;
}

export function IconImageInput({
    url,
    value,
    name,
    label,
    iconClassName,
    containerClassName,
    className,
    ...props
}: IconImageInputProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>

            <div className={cn(
                "relative flex items-center w-full",
                containerClassName
            )}>
                {/* Icon Container */}
                <div className={cn(
                    "absolute left-3 flex items-center justify-center pointer-events-none z-10",
                    iconClassName
                )}>
                    <img
                        src={url}
                        alt="Input icon"
                        className="w-5 h-5 object-contain opacity-90"
                    />
                </div>

                {/* Input Field */}
                <Input
                    type="text"
                    value={value}
                    className={cn(
                        "pl-11", // Extra left padding to accommodate the icon
                        className
                    )}
                    {...props}
                />
            </div>
        </div>
    )
}