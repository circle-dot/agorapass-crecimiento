"use client"

import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePrivy, useLogin } from '@privy-io/react-auth';
import Link from 'next/link';
import { Wallet } from 'lucide-react';
import createUser from '@/utils/createUser';
import Swal from 'sweetalert2';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getAvatar } from '../ui/users/getAvatarImg';
import { useFetchUser } from '@/hooks/useFetchUser';

function ProfileAvatar() {
    const [updateTrigger, setUpdateTrigger] = useState(false);
    const { data, isLoading, error } = useFetchUser(updateTrigger);
    const { authenticated, logout, ready } = usePrivy();

    const name = data?.name || 'Unknown';
    const wallet = data?.wallet || 'Unknown';
    const bio = data?.bio || '';
    const twitter = data?.twitter || '';
    const rankScore = data?.rankScore || 0;
    const attestationReceived = data?.attestationReceived || 0;
    const avatarType = data?.avatarType || 'blockies';

    // Check if running on client side before calling getAvatar
    const avatar = typeof window !== 'undefined' ? getAvatar(wallet, avatarType) : null;

    const { login } = useLogin({
        onComplete: async (user, isNewUser) => {
            if (isNewUser) {
                // Show loading Swal
                Swal.fire({
                    title: 'Creating user...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                try {
                    // Call createUser function for new users
                    await createUser(user);

                    // Show success Swal
                    Swal.fire({
                        icon: 'success',
                        title: 'User created successfully!',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        // Trigger component update or redirect
                        window.location.reload();
                    });
                } catch (error) {
                    // Show error Swal
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to create user. Please try again.'
                    });
                }
            }
        },
        onError: (error) => {
            console.log(error);
            // Show error Swal
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Login failed. Please try again.'
            });
        },
    });

    // Disable login when Privy is not ready or the user is already authenticated
    const disableLogin = !ready || (ready && authenticated);

    return (
        <>
            {authenticated ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <Avatar className="w-9 h-9 mx-auto ">
                                {typeof avatar === 'string' ? (
                                    <AvatarImage src={avatar} alt="Avatar Image" />
                                ) : (
                                    avatar
                                )}
                                {/* <AvatarFallback className="flex items-center justify-center">{email?.charAt(0)}</AvatarFallback> */}
                            </Avatar>
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link href='/me' className='cursor-pointer'>My Profile</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><a href={"mailto:" + process.env.NEXT_PUBLIC_MAIL_SUPPORT} className='cursor-pointer'>Support</a></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className='cursor-pointer'>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <button disabled={disableLogin} onClick={login}>
                    <Wallet className='h-5 w-5 lg:hidden' />
                    <p className='hidden lg:flex border border-gray-200 bg-gray-50 font-medium px-4 py-2 rounded-full cursor-pointer items-center'>Sign in</p>
                </button>
            )}
        </>
    );
}

export default ProfileAvatar;
