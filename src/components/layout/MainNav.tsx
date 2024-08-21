"use client";
import React from "react";
import Link from "next/link";
import ProfileAvatar from "@/components/auth/ProfileAvatar";
import Logo from "../../../public/logo.png";
import Image from "next/image";
import { navSections } from "@/config/siteConfig";
import { usePathname } from "next/navigation";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { IBM_Plex_Sans } from 'next/font/google';

const Plex_Sans = IBM_Plex_Sans({
    weight: '200',
    subsets: ['latin'],
});
function MainNav() {
    const pathname = usePathname();



    return (
        <div className="flex flex-col">
            <div className="flex flex-row w-full items-center gap-1 p-4">
                <div className="sm:w-full flex justify-start">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base shrink-0"
                    >
                        <Image src={Logo} alt="Company Logo" width={20} height={20} />
                        <span className="hidden lg:flex">CreciScore </span>
                        <sup>Beta</sup>
                    </Link>
                </div>

                <div className="w-full flex justify-center lg:hidden">
                    <Sheet>
                        <SheetTrigger className={`${Plex_Sans.className} text-lg font-medium bg-primarydark p-1 rounded uppercase text-white`} >Menu</SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Navigation</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 mt-4">
                                {navSections.map((section, index) => (
                                    <Link
                                        key={index}
                                        href={section.href}
                                        className={`${pathname === section.href
                                            ? "text-accentdark bg-primarydark font-medium hover:text-white"
                                            : "text-muted-foreground"
                                            } py-1 px-2 rounded-md`}
                                    >
                                        {section.label}
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="hidden lg:flex w-full justify-center">
                    <div className="flex flex-row bg-white rounded-full border border-gray-200 font-medium shadow-md lg:gap-4 lg:text-lg">
                        {navSections.map((section, index) => (
                            <Link
                                key={index}
                                href={section.href}
                                className={`${pathname === section.href
                                    ? "text-accentdark bg-primarydark font-medium hover:text-white"
                                    : "text-muted-foreground"
                                    } text-nowrap py-1 px-2 rounded-full`}
                            >
                                {section.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="min-w-[24px] sm:w-full flex justify-end">
                    <ProfileAvatar />
                </div>
            </div>
        </div>
    );
}

export default MainNav;
