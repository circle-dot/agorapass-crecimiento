"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAttestationsMade, fetchAttestationsReceived, fetchEnsNamesByAddress } from '@/lib/fetchers/attestations';
import imageLogo from '@/../../public/agora.png';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from 'framer-motion';
import Link from 'next/link';

//!TODO replace this schemaId
const schemaId = process.env.NEXT_PUBLIC_SCHEMA_ID || "0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"; // Replace with your schemaId

export default function Page({ params }: { params: { slug: string } }) {
    const address = params.slug; // Replace with the wallet address

    const { data: madeData, error: madeError, isLoading: madeLoading } = useQuery({
        queryKey: ['attestationsMade', schemaId, address],
        queryFn: () => fetchAttestationsMade(schemaId, address),
    });

    const { data: receivedData, error: receivedError, isLoading: receivedLoading } = useQuery({
        queryKey: ['attestationsReceived', schemaId, address],
        queryFn: () => fetchAttestationsReceived(schemaId, address),
    });

    const id = params.slug;

    const { data: ensName, error: ensNameerror, isLoading: ensNameLoading } = useQuery({
        queryKey: ['ensName', id],
        queryFn: () => fetchEnsNamesByAddress(id),
    });

    if (madeLoading || receivedLoading || ensNameLoading) return <div>Loading...</div>;
    if (madeError || receivedError || ensNameerror) return <div>Error: {madeError?.message || receivedError?.message}</div>;

    return (
        <div className="flex items-center justify-center bg-gray-100 w-full  p-4">
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
                    <div className="h-32 w-32 rounded-full overflow-hidden">
                        <Image
                            src={imageLogo}
                            width={100}
                            height={100}
                            alt='Profile pic'
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
                <div className="text-center">
                    <div className="flex flex-col gap-4 items-center">
                        <div className="flex flex-col sm:flex-row sm:space-x-8">
                            <div>
                                <span className="block text-xl font-bold">{receivedData}</span>
                                <span className="text-gray-500 text-sm">Vouches received</span>
                            </div>
                            <div>
                                <span className="block text-xl font-bold">{madeData}</span>
                                <span className="text-gray-500 text-sm">Vouches made</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-2xl font-semibold truncate">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <p className="whitespace-nowrap">{ensName?.length > 0 ? ensName[0].name : params.slug || "No Data Available"}</p>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{ensName?.length > 0 ? ensName[0].name : params.slug || "No Data Available"}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </h3>
                        <div className="mt-4 text-gray-600">
                            <a href={'https://base.easscan.org/address/' + params.slug} target='_blank' className="underline">Check in EAS</a>
                        </div>
                        <hr className="my-4 border-gray-300" />
                        <Button variant="outline" className='w-full'>Vouch</Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
