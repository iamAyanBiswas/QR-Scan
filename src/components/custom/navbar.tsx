"use client";

import Link from "next/link";
import { QrCode, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <QrCode className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-primary">QR Scan</span>
                </div>
                
                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">Product</Link>
                    <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">Enterprise</Link>
                    <Link className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" href="#">Pricing</Link>
                </div>
                
                {/* Actions (Desktop) */}
                <div className="hidden md:flex flex-row items-center gap-3">
                    <Link className="text-sm font-medium text-muted-foreground hover:text-primary px-3 py-2 transition-colors" href="/login">Login</Link>
                    <Link className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all" href="/signup">
                        Start Free
                    </Link>
                </div>

                {/* Mobile Menu */}
                <div className="flex md:hidden items-center gap-3">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-foreground">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetHeader>
                                <SheetTitle className="text-left flex items-center gap-2 mb-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                        <QrCode className="w-5 h-5" />
                                    </div>
                                    <span className="text-xl font-bold tracking-tight text-primary">QR Scan</span>
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-6 mt-4">
                                <div className="flex flex-col gap-4 border-b border-border pb-6">
                                    <Link href="#" className="text-base font-medium text-foreground transition-colors hover:text-primary">
                                        Product
                                    </Link>
                                    <Link href="#" className="text-base font-medium text-foreground transition-colors hover:text-primary">
                                        Enterprise
                                    </Link>
                                    <Link href="#" className="text-base font-medium text-foreground transition-colors hover:text-primary">
                                        Pricing
                                    </Link>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Link className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all" href="/login">
                                        Login
                                    </Link>
                                    <Link className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all" href="/signup">
                                        Start Free
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
