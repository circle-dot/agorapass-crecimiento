"use client"
import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// import { CircleUser } from "lucide-react";
import { usePrivy, useLogin } from '@privy-io/react-auth';
import Link from 'next/link';
import { Wallet } from 'lucide-react';
import iconLogo from '../../../public/agora.png'
import Image from 'next/image';
import createUser from '@/utils/createUser';

function ProfileAvatar() {
    const { authenticated, logout } = usePrivy();

    if (authenticated) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <Image
                            src={iconLogo}
                            alt="Company Logo"
                            width={36}
                            height={36}
                            className='cursor-pointer'
                        />
                        {/* <CircleUser className="h-5 w-5" /> */}
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href='/agora/me' className='cursor-pointer'>My Profile</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><a href="#" className='cursor-pointer'>Support</a></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className='cursor-pointer'>
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    } else {
        return (
            <LoginButton />
        );
    }
}

function LoginButton() {
    const { ready, authenticated } = usePrivy();

    const { login } = useLogin({
        onComplete: async (user, isNewUser, wasAlreadyAuthenticated, loginMethod) => {
            // console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod);

            if (isNewUser) {
                // Call createUser function for new users
                await createUser(user);
            }

            // Any logic you'd like to execute if the user is/becomes authenticated while this
            // component is mounted
        },
        onError: (error) => {
            console.log(error);
            // Any logic you'd like to execute after a user exits the login flow or there is an error
        },
    });

    // Disable login when Privy is not ready or the user is already authenticated
    const disableLogin = !ready || (ready && authenticated);

    return (
        <button disabled={disableLogin} onClick={login}>
            <Wallet className='h-5 w-5 lg:hidden' />
            <p className='hidden lg:flex border border-gray-200 bg-gray-50 font-medium px-4 py-2 rounded-full cursor-pointer items-center'>Connect with wallet</p>
        </button>
    );
}

export default ProfileAvatar;