"use client";
import React, { useEffect } from "react";
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import SearchBar from "@/components/ui/users/searchBar";
import { fetchAttestationsReduced } from "@/lib/fetchers/attestations";
import { Attestation } from '@/types/attestations'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHeader,
    TableHead,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link";

const truncateAddress = (address: string, length: number) => {
    if (address.length <= length) return address;
    return `${address.slice(0, length)}...`;
};

const Attestations: React.FC = () => {
    // Set up the inView hook with the threshold to only trigger when the element is 50% visible
    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ['attestations'],
        queryFn: ({ pageParam = 0 }) => fetchAttestationsReduced(pageParam, 10),
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.length === 0) return undefined;
            return pages.length;
        },
    });

    useEffect(() => {
        // Fetch the next page only if the element is in view and there are more pages to load
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading data...</p>;

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex w-screen justify-center items-center">
            <SearchBar />
            <div className="overflow-x-auto md:w-3/4 mx-auto">
                <Table>
                    <TableCaption>A list of vouches.</TableCaption>
                    <TableHeader >
                        <TableRow className="bg-primarydark hover:bg-primarydark">
                            <TableHead className="w-[150px] md:w-auto rounded-r-sm text-black">UID</TableHead>
                            <TableHead className="w-[200px] md:w-auto text-black">From</TableHead>
                            <TableHead className="w-[200px] md:w-auto text-black">To</TableHead>
                            <TableHead className="w-[150px] md:w-[200px] text-black">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.pages?.map((page, pageIndex) => (
                            <React.Fragment key={pageIndex}>
                                {page.map((attestation: Attestation, attestationIndex: number) => (
                                    <TableRow key={`${pageIndex}-${attestationIndex}`}>
                                        <TableCell className="truncate">
                                            <Link href={`/agora/attestation/${attestation.id}`} className="text-link">
                                                {truncateAddress(attestation.id, 20)} {/* Truncate to 20 characters */}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="truncate">
                                            <Link href={`/agora/address/${attestation.attester}`} className="text-link">
                                                {truncateAddress(attestation.attester, 20)} {/* Truncate to 20 characters */}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="truncate">
                                            <Link href={`/agora/address/${attestation.recipient}`} className="text-link">
                                                {truncateAddress(attestation.recipient, 20)} {/* Truncate to 20 characters */}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="truncate">
                                            {new Date(attestation.timeCreated * 1000).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </React.Fragment>
                        ))}
                    </TableBody>
                    {/* Optionally include TableFooter if needed */}
                </Table>
                <div ref={ref}>
                    {isFetchingNextPage && <p>Loading more...</p>}
                </div>
            </div>
        </div>
    );
};

export default Attestations;
