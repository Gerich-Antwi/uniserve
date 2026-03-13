'use client';

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2 min-w-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 border-4 border-black bg-yellow-300 px-2 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:scale-105 ease-in-out duration-200 transition-all shrink-0">
          <span className="font-black text-lg sm:text-xl tracking-tight">
            Uni<span className="text-pink-500">Serve</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/services" className="font-bold text-sm hover:text-pink-500 transition-colors">
            Services
          </Link>
          <Link href="/announcements" className="font-bold text-sm hover:text-pink-500 transition-colors">
            Announcements
          </Link>
        </div>

        {/* Mobile menu */}
        <div className="flex md:hidden items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 border-2 border-black shrink-0" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs border-l-4 border-black p-0 [&>button]:hidden">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex flex-col gap-1 pt-6 px-4">
                <Link href="/services" className="font-bold py-3 px-4 border-b-2 border-black/10 hover:bg-yellow-100 rounded-none transition-colors">
                  Services
                </Link>
                <Link href="/announcements" className="font-bold py-3 px-4 border-b-2 border-black/10 hover:bg-yellow-100 rounded-none transition-colors">
                  Announcements
                </Link>
                <Link href="/auth/sign-in" className="font-bold py-3 px-4 hover:bg-gray-100 rounded-none transition-colors">
                  Log In
                </Link>
                <Link href="/auth/sign-up" className="font-bold py-3 px-4 bg-black text-white hover:bg-black/90 rounded-none transition-colors">
                  Get Started
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link href="/auth/sign-in" className="font-bold text-sm hover:text-pink-500 transition-colors">
            Log In
          </Link>
          <Link href="/auth/sign-up" className="font-bold text-sm hover:text-pink-500 transition-colors hidden sm:inline">
            Sign Up
          </Link>
          <Link
            href="/auth/sign-up"
            className="bg-black text-white px-4 sm:px-5 py-2 font-black text-sm border-2 border-black 
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
            hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
             transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
