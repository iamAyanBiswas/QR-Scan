
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default async function ExpiredPage({
    searchParams,
}: {
    searchParams: Promise<{ reason?: string }>;
}) {
    // Await searchParams before accessing properties
    const { reason } = await searchParams;

    // Map reason codes to user-friendly messages
    // "limit" -> "This QR Code has reached its scan limit."
    // "expired" -> "This QR Code has expired."
    // "inactive" -> "This QR Code has been deactivated."

    let message = "This QR Link is no longer active.";
    if (reason === "limit") message = "This QR Code has reached its maximum scan limit.";
    if (reason === "expired") message = "This promotion has ended.";
    if (reason === "inactive") message = "This code has been disabled by the owner.";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full flex flex-col items-center">
                <div className="bg-orange-100 p-4 rounded-full mb-6">
                    <AlertTriangle className="w-12 h-12 text-orange-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h1>
                <p className="text-gray-500 mb-8">
                    {message}
                </p>
                <Link href="/">
                    <Button className="w-full">Create Your Own QR Code</Button>
                </Link>
            </div>
        </div>
    );
}
