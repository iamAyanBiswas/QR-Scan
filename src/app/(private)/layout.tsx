import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/custom/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider";
import { ProfileDropdown } from "@/components/custom/profile";
import { ModeToggle } from "@/components/custom/toggle";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="sticky top-0 z-50 w-full border-b bg-sidebar/95 backdrop-blur supports-backdrop-filter:bg-sidebar/60 flex h-16 shrink-0 items-center justify-between gap-2 px-4">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="ml-1" />
                        </div>
                        <div className="flex items-center gap-2">
                            <ModeToggle />
                            <ProfileDropdown variant="header" />
                        </div>
                    </header>
                    <main className="flex flex-1 flex-col p-4 md:p-6 bg-background ">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}
