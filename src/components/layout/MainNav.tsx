"use client"
import React from 'react'
import Link from 'next/link'
import ProfileAvatar from '@/components/auth/ProfileAvatar'
import Logo from "../../../public/agora.png";
import Image from 'next/image';
import { navSections } from '@/config/siteConfig';
import { usePathname } from 'next/navigation'


function MainNav() {
    const pathname = usePathname()
    return (
        <div className='flex flex-col'>
            <div className='flex flex-row w-full items-center gap-1 p-4'>

                <div className='sm:w-full flex justify-start'>
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base shrink-0"
                    >
                        <Image
                            src={Logo}
                            alt="Company Logo"
                            width={20}
                            height={20}
                        />
                        <span className="hidden lg:flex">Agora City <sup>Beta</sup></span>
                    </Link>
                </div>
                <div className='w-full flex justify-center'>
                    <div className='flex flex-row bg-white rounded-full border border-gray-200  font-medium shadow-md lg:gap-4 lg:text-lg  px-2'>
                        {/* <Link href='/'>Welcome</Link>
                        <Link href='/agora/attestations'>Vouches</Link>
                        <Link href='/agora/profiles'>Profiles</Link> */}
                        {navSections.map((section, index) => (
                            <Link
                                key={index}
                                href={section.href}
                                className={`${section.className} ${pathname === section.href ? 'text-foreground bg-[#fafafa] font-medium' : 'text-muted-foreground'} text-nowrap py-1 px-2 rounded-full`}
                            >
                                {section.label}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className='min-w-[24px] sm:w-full flex justify-end'><ProfileAvatar /></div>

            </div>
        </div>
    )
}

export default MainNav