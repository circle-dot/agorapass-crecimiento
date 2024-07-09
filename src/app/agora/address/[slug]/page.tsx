"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAttestationsMade, fetchAttestationsReceived, fetchEnsNamesByAddress } from '@/lib/fetchers/attestations';
import imageLogo from '@/../../public/agora.png'
import Image from 'next/image';
import { Button } from '@/components/ui/button'; import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

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
        <div className="font-sans bg-gray-100 flex flex-col items-center justify-start w-screen ">
            <div className="container mt-14">
                <div className="flex justify-center">
                    <div className="bg-white shadow-lg rounded-lg lg:w-3/4 ">
                        <div className="flex justify-center mt-5">
                            <div className=" h-32 rounded-full ">

                                <Image
                                    src={imageLogo}
                                    width={100}
                                    height={100}
                                    alt='Profile pic'
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                        <div className="text-center py-6 px-4">

                            <div className="mt-6">
                                <div className="flex justify-center space-x-8">
                                    <div>
                                        <span className="block text-xl font-bold">{receivedData}</span>
                                        <span className="text-gray-500">Vouches received</span>
                                    </div>
                                    <div>
                                        <span className="block text-xl font-bold">{madeData}</span>
                                        <span className="text-gray-500">Vouches made</span>
                                    </div>

                                </div>
                            </div>
                            <div className="text-center mt-6">
                                <h3 className="text-2xl font-semibold truncate">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <p >{ensName?.length > 0 ? ensName[0].name : params.slug || "No Data Available"}</p>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{ensName?.length > 0 ? ensName[0].name : params.slug || "No Data Available"}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                </h3>
                                {/* <div className="text-gray-500 mt-2">
                                    <i className="fas fa-map-marker-alt mr-2"></i>Bucharest, Romania
                                </div> */}
                                {/* <div className="mt-4 text-gray-600">
                                    <i className="fas fa-briefcase mr-2"></i>Solution Manager - Creative Tim Officer
                                </div> */}
                                <div className="mt-4 text-gray-600">
                                    <a href={'https://base.easscan.org/address/' + params.slug} target='_blank'>Check in EAS</a>
                                </div>
                                <hr className="my-4 border-gray-300" />
                                <Button variant="outline" className='w-full'>Vouch</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
