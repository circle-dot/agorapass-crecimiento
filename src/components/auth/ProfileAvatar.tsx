"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePrivy, useLogin } from "@privy-io/react-auth";
import Link from "next/link";
import createUser from "@/utils/createUser";
import Swal from "sweetalert2";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getAvatar } from "../ui/users/getAvatarImg";
import { useFetchUserProfile } from "@/hooks/useFetchUser";
import ZupassButton from "../layout/ZupassButton";
import ConnectQuarkId from "../ui/ConnectQuarkId";
import { ChevronDown, WalletCards, Wallet } from "lucide-react";
import {
    Dialog,
    DialogTrigger,
} from "@/components/ui/dialog";

const ProfileAvatar = () => {
    const [updateTrigger, setUpdateTrigger] = useState(false);
    const { data, isLoading, error } = useFetchUserProfile(updateTrigger);
    const { authenticated, logout, ready } = usePrivy();

    const wallet = data?.wallet || "Unknown";
    const avatarType = data?.avatarType || "blockies";
    const zupassUser = data?.Zupass;
    const quarkidUser = data?.Quarkid;
    const isClient = typeof window !== "undefined";
    const avatar = useMemo(
        () => (isClient ? getAvatar(wallet, avatarType) : null),
        [wallet, avatarType]
    );
    const handleNewUserCreation = useCallback(async (user: any) => {
        Swal.fire({
            title: "Creating user...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            await createUser(user);
            Swal.fire({
                icon: "success",
                title: "User created successfully!",
                showConfirmButton: false,
                timer: 1500,
            }).then(() => window.location.reload());
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to create user. Please try again.",
            });
        }
    }, []);

    const { login } = useLogin({
        onComplete: async (user, isNewUser) => {
            if (isNewUser) await handleNewUserCreation(user);
        },
        onError: () => {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Login failed. Please try again.",
            });
        },
    });

    const disableLogin = !ready || authenticated;

    return (
        <>
            {authenticated ? (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" className="px-0.5 mr-1">
                                <WalletCards /> <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="flex !flex-column justify-center items-center">
                            {zupassUser ? (
                                <DropdownMenuItem disabled={true}>
                                    Zupass connected 🎉
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem>
                                    <ZupassButton />
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        {quarkidUser ? "QuarkId connected 🎉" : <ConnectQuarkId />}
                                    </DialogTrigger>
                                </Dialog>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <Avatar className="w-9 h-9 mx-auto ">
                                    {typeof avatar === "string" ? (
                                        <AvatarImage src={avatar} alt="Avatar Image" />
                                    ) : (
                                        avatar
                                    )}
                                </Avatar>
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href="/me" className="cursor-pointer">
                                    My Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <a
                                    href={"mailto:" + process.env.NEXT_PUBLIC_MAIL_SUPPORT}
                                    className="cursor-pointer"
                                >
                                    Support
                                </a>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout} className="cursor-pointer">
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            ) : (
                <button disabled={disableLogin} onClick={login}>
                    <Wallet className="h-5 w-5 lg:hidden" />
                    <p className="hidden lg:flex border border-gray-200 bg-gray-50 font-medium px-4 py-2 rounded-full cursor-pointer items-center">
                        Sign in
                    </p>
                </button>
            )}
        </>
    );
};

export default ProfileAvatar;
