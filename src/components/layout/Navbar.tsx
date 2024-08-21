"use client"
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import React from "react";
import { navSections } from '@/config/siteConfig';
import Image from "next/image";
import Logo from "../../../public/logo.png";
import ProfileAvatar from '@/components/auth/ProfileAvatar'
import SearchBar from "../ui/users/searchBar";

export default function Navbar() {
    const pathname = usePathname()
    return (
        <div className="flex w-full flex-col relative min-h-16">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 lg:w-full">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base shrink-0"
                    >
                        <Image
                            src={Logo}
                            alt="Company Logo"
                            width={48}
                            height={48}
                        />
                        <span className="sr-only">CreciScore</span>
                    </Link>
                    {navSections.map((section, index) => (
                        <Link
                            key={index}
                            href={section.href}
                            className={`${section.className} ${pathname === section.href ? 'text-foreground ' : 'text-muted-foreground'} text-nowrap h-16 flex items-center justify-center`}
                        >
                            {section.label}
                        </Link>
                    ))}
                </nav>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link
                                href="#"
                                className="flex items-center gap-2 text-lg font-semibold"
                            >
                                <Image
                                    src={Logo}
                                    alt="Company Logo"
                                    width={48}
                                    height={48}
                                />
                                <span className="sr-only">CreciScore</span>
                            </Link>
                            {navSections.map((section, index) => (
                                <Link
                                    key={index}
                                    href={section.href}
                                    className={`${section.className} ${pathname === section.href ? 'font-bold' : ''}`}
                                >
                                    {section.label}
                                </Link>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <form className="ml-auto flex-1 sm:flex-initial">
                        <div className="relative">
                            <SearchBar />
                        </div>
                    </form>
                    <ProfileAvatar />
                </div>
            </header>
        </div>
    );
}
