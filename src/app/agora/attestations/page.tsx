"use client";
import React, { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { fetchAttestations, fetchAggregateAttestations } from "@/lib/fetchers/attestations";

const Attestations = () => {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Fetch attestations data
    const { data: attestationsData, isLoading, isError } = useQuery({
        queryKey: ['attestations', page, pageSize],
        queryFn: () => fetchAttestations(page, pageSize),
        placeholderData: (prev) => prev
    });

    // Fetch aggregate count data
    const { data: aggregateData } = useQuery({
        queryKey: ['aggregateAttestations'],
        queryFn: fetchAggregateAttestations,
        placeholderData: (prev) => prev
    });

    const tasks = attestationsData?.map((attestation: any) => ({
        id: attestation.id,
        attester: attestation.attester,
        recipient: attestation.recipient,
        timeCreated: attestation.timeCreated,
        revocable: attestation.revocable,
        revocationTime: attestation.revocationTime,
        expirationTime: attestation.expirationTime,
        data: attestation.data,
    })) || [];

    const totalPages = aggregateData ? Math.ceil(aggregateData / pageSize) : 0;

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading data...</p>;

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <DataTable
                data={tasks}
                columns={columns}
                pagination={{
                    page,
                    pageSize,
                    onPageChange: setPage,
                    onPageSizeChange: setPageSize,
                    totalPages,
                }}
                loading={isLoading}  // Pass the loading state to DataTable
            />
        </div>
    );
};

export default Attestations;
