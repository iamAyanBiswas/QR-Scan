"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export function Navbar() {
    return (
        <div className="border-b bg-background">
            <div className="flex h-16 items-center px-4 container mx-auto justify-between">
                <Link href="/" className="font-bold text-xl">
                    QR Scan
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link href="/pricing" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Pricing
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 mt-8">
                                <Link href="/pricing" className="text-lg font-medium transition-colors hover:text-primary">
                                    Pricing
                                </Link>
                                <div className="flex flex-col gap-2 mt-4">
                                    <Button variant="outline" asChild className="w-full">
                                        <Link href="/login">Login</Link>
                                    </Button>
                                    <Button asChild className="w-full">
                                        <Link href="/signup">Sign Up</Link>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    );
}
