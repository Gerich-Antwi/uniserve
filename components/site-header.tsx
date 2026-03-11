"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
    const pathname = usePathname()

    const routes = [
        {
            href: "/",
            label: "Home",
            active: pathname === "/",
        },
        {
            href: "/services",
            label: "Services",
            active: pathname === "/services",
        },
        {
            href: "/announcements",
            label: "Announcements",
            active: pathname === "/announcements",
        },
        {
            href: "/chat",
            label: "Messages",
            active: pathname.startsWith("/chat"),
        },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-white">
            <div className="container flex h-16 items-center max-w-7xl mx-auto px-4 md:px-6">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-black text-xl sm:inline-block">
                            Campus<span className="text-pink-500">Services</span>
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-bold">
                        {routes.map((route) => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "transition-colors hover:text-pink-500",
                                    route.active
                                        ? "text-foreground font-black"
                                        : "text-foreground/60"
                                )}
                            >
                                {route.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Add search or other items here if needed */}
                    </div>
                    <nav className="flex items-center gap-3">
                        <Link href="/auth/sign-in">
                            <Button variant="outline" size="sm">
                                Log In
                            </Button>
                        </Link>
                        <Link href="/auth/sign-up">
                            <Button size="sm">
                                Get Started
                            </Button>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}
