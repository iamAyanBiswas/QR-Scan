"use client"
import Link from "next/link"
import { Archive, ChartNoAxesCombined, LayoutDashboard, Plus, Puzzle, QrCode } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar"
import { ProfileDropdown } from "@/components/custom/profile"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "New QR",
        url: "/qr/create",
        icon: Plus,
    },
    {
        title: "Analytics",
        url: "/analytics",
        icon: ChartNoAxesCombined
    },
    {
        title: "Integration",
        url: "/integration",
        icon: Puzzle
    },
    {
        title: "Archive",
        url: "/archive",
        icon: Archive
    }
]

export function AppSidebar() {
    return (
        <Sidebar className="border-r shadow-sm">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent cursor-pointer">
                            <Link href="/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <QrCode className="size-5" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold text-base">QR Scan</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-muted-foreground tracking-wider mb-2">MAIN MENU</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild size="default" className="text-sm font-medium h-9">
                                        <Link href={item.url}>
                                            <item.icon className="size-4.5!" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <ProfileDropdown variant="sidebar" />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
