"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAttestationsMade, fetchAttestationsReceived } from '@/lib/fetchers/attestations';
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

    if (madeLoading || receivedLoading) return <div>Loading...</div>;
    if (madeError || receivedError) return <div>Error: {madeError?.message || receivedError?.message}</div>;

    return (
        <div>
            <h1>Attestation Counts</h1>
            <p>Attestations Made: {madeData}</p>
            <p>Attestations Received: {receivedData}</p>
        </div>
    );
}
