import { Navbar } from "@/components/custom/navbar";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
        </div>
    );
}
