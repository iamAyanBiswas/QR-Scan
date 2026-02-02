import { LoaderCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function Loader({ size, className }: { size?: number, className?: string }) {
    return (
        <LoaderCircle size={size || 52} className={cn("animate-spin", className)} />)
}