import QRCodeGenerator from "@/components/block/qr-code-generator";

export default function CreateQR() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <QRCodeGenerator />
        </div>
    );
}