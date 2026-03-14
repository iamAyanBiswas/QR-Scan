import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

type LoadingButtonProps = Omit<React.ComponentProps<"button">, "asChild"> &
    VariantProps<typeof buttonVariants> & {
        isLoading?: boolean
        loaderClassName?: string
    }

export default function LoadingButton({
    isLoading = false,
    disabled,
    loaderClassName,
    children,
    ...props
}: LoadingButtonProps) {
    return (
        <Button disabled={isLoading || disabled} {...props}>
            {isLoading && <Loader2 className={cn("animate-spin", loaderClassName)} />}
            {children}
        </Button>
    )
}