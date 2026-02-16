"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    MoreVertical,
    Plus,
    BarChart2,
    Calendar,
    Edit,
    Download,
    Copy,
    Trash2,
    Eye,
    PauseCircle,
    PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import QRCodeDisplay from "@/components/custom/qr-code-display";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QRCode {
    id: string;
    title: string;
    description: string | null;
    status: string;
    isComplete: boolean;
    designStats: any;
    createdAt: string;
    scans: number;
    type: string;
}

export default function Dashboard() {
    const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchQrCodes();
    }, []);

    const fetchQrCodes = async () => {
        try {
            const res = await fetch("/api/bulk-qr");
            if (!res.ok) throw new Error("Failed to fetch QR codes");
            const data = await res.json();
            setQrCodes(data);
        } catch (error) {
            console.error("Error fetching QR codes:", error);
            toast.error("Failed to load QR codes");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this QR code?")) return;

        try {
            const res = await fetch(`/api/qr?id=${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete");

            setQrCodes(prev => prev.filter(qr => qr.id !== id));
            toast.success("QR Code deleted");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete QR code");
        }
    };

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        toast.info("Duplicate feature coming soon");
    };

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        toast.info("Download feature coming soon");
    };

    const getTypeBadgeStyle = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'url': return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case 'vcard': return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case 'pdf': return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
            case 'wifi': return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
            default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-87.5 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 bg-gray-50/50 dark:bg-background min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">QR Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your dynamic QR codes</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => router.push("/create")} className="shadow-lg shadow-primary/20">
                        <Plus className="mr-2 h-4 w-4" /> Create New QR
                    </Button>
                </div>
            </div>

            {qrCodes.length === 0 ? (
                <div className="text-center py-20 border rounded-xl bg-background shadow-sm">
                    <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium">No QR Codes yet</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Create your first QR code to get started with tracking and analytics.</p>
                    <Button onClick={() => router.push("/create")} className="mt-6" variant="outline">
                        Create Now
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {qrCodes.map((qr) => (
                        <Card
                            key={qr.id}
                            className="group hover:shadow-lg transition-all duration-300 border-border/50 shadow-sm overflow-hidden flex flex-col gap-1"
                        >
                            <CardHeader className="px-4 py-0 flex flex-row items-center justify-between space-y-0">
                                <div className={cn(
                                    "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide",
                                    getTypeBadgeStyle(qr.type || 'URL')
                                )}>
                                    {qr.type || 'URL'}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem onClick={() => router.push(`/qr/${qr.id}/analytics`)}>
                                            <BarChart2 className="mr-2 h-4 w-4" /> View Analytics
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleDownload}>
                                            <Download className="mr-2 h-4 w-4" /> Download QR
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            {qr.status === 'active' ? (
                                                <><PauseCircle className="mr-2 h-4 w-4" /> Pause Tracking</>
                                            ) : (
                                                <><PlayCircle className="mr-2 h-4 w-4" /> Activate</>
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleDuplicate}>
                                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={(e) => handleDelete(qr.id, e)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>

                            <CardContent className="p-4 pt-0 grow flex items-center justify-center">
                                <div
                                    className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center p-4 cursor-pointer"
                                    onClick={() => router.push(`/qr/${qr.id}`)}
                                >
                                    <div className="relative w-full h-full flex items-center justify-center transform group-hover:scale-101 transition-transform duration-300">
                                        <QRCodeDisplay
                                            data={`${process.env.NEXT_PUBLIC_SHORT_DOMAIN}/${qr.id}`}
                                            options={{
                                                ...qr.designStats,
                                                width: 200,
                                                height: 200,
                                            }}
                                            size={200}
                                        />
                                    </div>

                                </div>
                            </CardContent>

                            <CardFooter className="px-4 [.border-t]:pt-2 flex flex-col gap-4 border-t border-border/50">
                                <div className="w-full space-y-1">
                                    <h3
                                        className="font-bold text-base truncate cursor-pointer hover:text-primary transition-colors"
                                        onClick={() => router.push(`/qr/${qr.id}`)}
                                    >
                                        {qr.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <span className={cn(
                                                "h-2 w-2 rounded-full",
                                                qr.status === 'active' ? "bg-green-500" : "bg-gray-400"
                                            )} />
                                            <span className="capitalize">{qr.status}</span>
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                            {formatDate(qr.createdAt)}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full flex items-center justify-between pt-1">
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                                        <BarChart2 className="h-4 w-4" />
                                        <span>{Number(qr.scans).toLocaleString()} Scans</span>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 gap-1.5"
                                        onClick={() => router.push(`/qr/${qr.id}/content`)}
                                    >
                                        <Download className="h-3.5 w-3.5" /> Download
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}