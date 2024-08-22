"use client";

import { useEffect, useState } from "react";
import { usePrivy } from '@privy-io/react-auth';
import { useQuery } from '@tanstack/react-query';
import { fetchAttestationsMadeCount, fetchAttestationsReceivedCount, fetchEnsNamesByAddress, fetchAttestationsMade, fetchAttestationsReceived } from '@/lib/fetchers/attestations';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from 'framer-motion';
import Loader from '@/components/ui/Loader';
import VouchButtonCustom from '@/components/ui/VouchButton';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { getAvatar } from '@/components/ui/users/getAvatarImg';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import TwitterLogo from '@/../../public/X.svg'
import { View } from 'lucide-react';
import FarcasterLogo from '@/../../public/farcaster.svg'
import Image from 'next/image';
import React, { lazy, Suspense } from 'react';
const ShareProfile = lazy(() => import('@/components/ui/users/ShareProfile'));
import displayRanking from "@/utils/displayRanking";
//!TODO replace this schemaId
const schemaId = process.env.NEXT_PUBLIC_SCHEMA_ID || "0x5ee00c7a6606190e090ea17749ec77fe23338387c23c0643c4251380f37eebc3"; // Replace with your schemaId

export default function Page({ params }: { params: { slug: string } }) {

    const [authStatus, setAuthStatus] = useState(false);
    const [dialogOpenedMade, setDialogOpenedMade] = useState(false);
    const [dialogOpenedReceived, setDialogOpenedReceived] = useState(false);
    const { ready, authenticated } = usePrivy();

    useEffect(() => {
        if (ready) {
            setAuthStatus(authenticated);
        }
    }, [ready, authenticated]);

    const address = params.slug; // Replace with the wallet address

    const { data: madeData, error: madeError, isLoading: madeLoading } = useQuery({
        queryKey: ['attestationsMadeCount', schemaId, address],
        queryFn: () => fetchAttestationsMadeCount(schemaId, address),
    });

    const { data: receivedData, error: receivedError, isLoading: receivedLoading } = useQuery({
        queryKey: ['attestationsReceivedCount', schemaId, address],
        queryFn: () => fetchAttestationsReceivedCount(schemaId, address),
    });

    const id = params.slug;

    const { data: ensName, error: ensNameerror, isLoading: ensNameLoading } = useQuery({
        queryKey: ['ensName', id],
        queryFn: () => fetchEnsNamesByAddress(id),
    });

    const { data: userData, error: rankScoreError, isLoading: rankScoreLoading } = useQuery({
        queryKey: ['userRankScore', address],
        queryFn: async () => {
            const res = await fetch(`/api/user/${address}`);
            if (res.status === 404) {
                return null; // Return null or any fallback value if user not found
            }
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        },
        retry: (failureCount, error) => {
            if (error) {
                return false; // Don't retry for any other errors
            }
            return failureCount < 3; // Retry up to 3 times for network issues
        },
        staleTime: Infinity,
    });

    const { data: madeVouchesData, error: madeVouchesError, isLoading: madeVouchesLoading } = useQuery({
        queryKey: ['attestationsMade', schemaId, address],
        queryFn: () => fetchAttestationsMade(schemaId, address),
        enabled: dialogOpenedMade,
        staleTime: Infinity,
    });

    const { data: receivedVouchesData, error: receivedVouchesError, isLoading: receivedVouchesLoading } = useQuery({
        queryKey: ['attestationsReceived', schemaId, address],
        queryFn: () => fetchAttestationsReceived(schemaId, address),
        enabled: dialogOpenedReceived,
        staleTime: Infinity,
    });

    if (madeLoading || receivedLoading || ensNameLoading || rankScoreLoading) return <div className="w-screen flex items-center justify-center"><Loader /></div>;
    if (madeError || receivedError || ensNameerror) return <div>Error: {madeError?.message || receivedError?.message}</div>;
    const handleCopy = () => {
        copyToClipboard(address);
    };
    const handleMadeOpen = () => {
        setDialogOpenedMade(true);
    };
    const handleReceivedOpen = () => {
        setDialogOpenedReceived(true);
    };
    const avatarType = userData?.user ? userData.user.avatarType || 'metamask' : 'metamask';
    const avatar = getAvatar(address, avatarType);

    return (
        <div className="flex items-center justify-center bg-gray-100 w-full p-4">
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: [20, -5, 0],
                }}
                transition={{
                    duration: 0.5,
                    ease: [0.4, 0.0, 0.2, 1],
                }}
                className="bg-white bg-opacity-90 shadow-lg p-6 rounded-lg max-w-md w-full"
            >
                <div className="flex justify-center mb-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                        {typeof avatar === 'string' ? (
                            <AvatarImage src={avatar} alt="Avatar Image" />
                        ) : (
                            avatar
                        )}
                    </Avatar>
                </div>
                <div className="text-center">
                    <div>
                        {userData?.user?.name && (
                            <h1>{userData.user?.name}</h1>
                        )}
                        {userData?.ranking ? (
                            <>
                                <p>Rank # {userData.ranking.position}</p>
                                <p>Score {displayRanking(userData.ranking.value)}</p>
                            </>
                        ) : (
                            <p>Ranking not yet assigned</p>
                        )}


                    </div>
                    <div className="flex flex-col gap-4 items-center">


                        <div className="flex flex-col sm:flex-row sm:space-x-8">
                            <div>
                                <span className="block text-xl font-bold">{receivedData}</span>
                                <Dialog onOpenChange={handleReceivedOpen}>
                                    <DialogTrigger className="text-gray-500 text-sm underline cursor-pointer">Vouches received</DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>List of vouches received</DialogTitle>
                                        </DialogHeader>
                                        {receivedVouchesLoading ? (
                                            <Loader />
                                        ) : receivedVouchesError ? (
                                            <div>Error: {receivedVouchesError.message}</div>
                                        ) : (
                                            <div className="max-h-96 overflow-y-auto">
                                                {receivedVouchesData?.map((attestationReceived: any) => (
                                                    <div key={attestationReceived.id} className={`p-4 my-2 rounded-lg shadow-sm ${attestationReceived.revoked ? 'bg-red-50' : 'bg-gray-50'}`}>
                                                        Received a vouch from <Link href={'/address/' + attestationReceived.attester} className="text-blue-600 hover:underline">{attestationReceived.attester}</Link> on {new Date(attestationReceived.timeCreated * 1000).toLocaleDateString()} <Link href={'/vouch/' + attestationReceived.id}> <br /> <span className='flex flex-row justify-start items-center'>See details<View className="h-5 w-5" /></span> </Link> {attestationReceived.revoked && <Badge variant="destructive">Revoked on {new Date(attestationReceived.revocationTime * 1000).toLocaleDateString()}</Badge>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div>
                                <span className="block text-xl font-bold">{madeData}</span>
                                <Dialog onOpenChange={handleMadeOpen}>
                                    <DialogTrigger className="text-gray-500 text-sm underline cursor-pointer">Vouches made</DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>List of vouches made</DialogTitle>
                                        </DialogHeader>
                                        {madeVouchesLoading ? (
                                            <Loader />
                                        ) : madeVouchesError ? (
                                            <div>Error: {madeVouchesError.message}</div>
                                        ) : (
                                            <div className="max-h-96 overflow-y-auto">
                                                {madeVouchesData?.map((attestation: any) => (
                                                    <div key={attestation.id} className={`p-4 my-2 rounded-lg shadow-sm ${attestation.revoked ? 'bg-red-50' : 'bg-gray-50'}`}>
                                                        Vouched for <Link href={'/address/' + attestation.recipient} className="text-blue-600 hover:underline">{attestation.recipient}</Link> on {new Date(attestation.timeCreated * 1000).toLocaleDateString()} <Link href={'/vouch/' + attestation.id}> <br /> <span className='flex flex-row justify-start items-center'>See details<View className="h-5 w-5" /></span> </Link> {attestation.revoked && <Badge variant="destructive">Revoked on {new Date(attestation.revocationTime * 1000).toLocaleDateString()}</Badge>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </div>

                        </div>

                    </div>
                    <div className="mt-6">
                        {/* {userData?.createdAt && (
                            <div>Joined: {new Date(userData.createdAt).toLocaleDateString()}</div>
                        )} */}

                        <h3 className="text-2xl font-semibold truncate">
                            <Suspense fallback={<div>Loading...</div>}>
                                <ShareProfile address={address} />
                            </Suspense>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild onClick={handleCopy}>
                                        <p className="whitespace-nowrap truncate cursor-pointer">{ensName?.length > 0 ? ensName[0].name : address || "No Data Available"}</p>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{ensName?.length > 0 ? ensName[0].name : address || "No Data Available"}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </h3>
                        <div className="mb-4 text-gray-600">
                            <a href={process.env.NEXT_PUBLIC_EASSCAN + '/address/' + address} target='_blank' className="underline">Check in EAS</a>
                        </div>

                        <div className='flex items-center justify-center flex-row'>
                            {userData?.user?.twitter && (
                                <a target="_blank" href={'https://x.com/' + userData.twitter} className='flex flex-row justify-center items-center  text-sky-400'><Image src={TwitterLogo} alt='User with Farcaster' className='mx-1 h-6 w-6 ' />@{userData.twitter}</a>
                            )}
                            {userData?.user?.farcaster && (
                                <a target="_blank" href={'https://warpcast.com/' + userData.farcaster} className='flex items-center justify-center flex-row text-[#8a63d2]'><Image src={FarcasterLogo} alt='User with Farcaster' className='mx-1 h-6 w-6 ' />@{userData.farcaster}</a>
                            )}
                        </div>
                        <hr className="my-4 border-gray-300" />
                        {userData?.user?.bio && (
                            <>
                                <div>{userData.user.bio}</div>
                                <hr className="my-4 border-gray-300" />
                            </>
                        )}

                        {userData?.user?.Quarkid?.ticketType && (
                            <>
                                Member of Aleph | {userData?.user?.Quarkid?.ticketType}
                                <hr className="my-4 border-gray-300" />
                            </>
                        )


                        }



                        <VouchButtonCustom recipient={address} className='!w-full py-1' authStatus={authStatus} />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

