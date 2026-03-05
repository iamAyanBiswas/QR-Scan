"use client"

import Link from "next/link"
import { ChevronsUpDown, Settings, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"

const letterColors = {
    a: "#2C3E50", b: "#1F618D", c: "#4A235A", d: "#7B241C", e: "#0E6251", f: "#512E5F",
    g: "#154360", h: "#641E16", i: "#1B4F72", j: "#4A235A", k: "#145A32", l: "#6C3483",
    m: "#7D6608", n: "#1A5276", o: "#78281F", p: "#0B5345", q: "#212F3D", r: "#4D5656",
    s: "#512E5F", t: "#1C2833", u: "#7E5109", v: "#943126", w: "#0E6655", x: "#5B2C6F",
    y: "#17202A", z: "#6E2C00"
};

export function ProfileDropdown({ variant = "sidebar" }: { variant?: "sidebar" | "header" }) {
    // NOTE: Mock user object. Replace with actual user session data when authentication is ready.
    const user = {
        name: "Pyan Biswas",
        email: "ayan@qrscan.com",
        avatar: "", // Empty so it uses the fallback
    }

    const firstLetter = (user.name ? user.name[0] : user.email ? user.email[0] : 'Q').toLowerCase();
    const bgColor = letterColors[firstLetter as keyof typeof letterColors] || "#2C3E50";
    const initials = (user.name ? user.name[0] : user.email ? user.email[0] : 'Q').toUpperCase();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {variant === "sidebar" ? (
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground pb-2"
                    >
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="rounded-lg font-semibold" style={{ backgroundColor: bgColor, color: '#ffffff' }}>
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user.name}</span>
                            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                    </SidebarMenuButton>
                ) : (
                    <div className="cursor-pointer flex items-center gap-2 outline-none">
                        <Avatar className="h-8 w-8 rounded-full border shadow-sm">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="rounded-full font-semibold" style={{ backgroundColor: bgColor, color: '#ffffff' }}>
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 rounded-lg"
                side={variant === "sidebar" ? "bottom" : "bottom"}
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="rounded-lg font-semibold" style={{ backgroundColor: bgColor, color: '#ffffff' }}>
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user.name}</span>
                            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/account">
                            <User className="mr-2 size-4" />
                            <span>Account</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/settings">
                            <Settings className="mr-2 size-4" />
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
