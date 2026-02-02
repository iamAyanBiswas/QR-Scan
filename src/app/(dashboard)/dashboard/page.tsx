import QRCodeGenerator from "@/components/custom/qr-code-generator";

export default function DashboardPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-zinc-50 dark:bg-zinc-950">
            <QRCodeGenerator />
        </div>
    );
}