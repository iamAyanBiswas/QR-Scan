import { Button } from "@/components/ui/button"

interface GoogleOAuthButtonProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function GoogleOAuthButton({ onClick }: GoogleOAuthButtonProps) {
    return (
        <Button variant="outline" className="w-full my-5 cursor-pointer" onClick={onClick}>
            <img src={'./oauth-google.svg'} height={28} width={28} alt="" />
            Continue with Google
        </Button>
    )
}