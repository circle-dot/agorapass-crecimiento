"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAttestation } from "@/lib/fetchers/attestations";

export default function Page({ params }: { params: { slug: string } }) {
    // Fetch attestation data
    const { data, error, isLoading } = useQuery({
        queryKey: ["attestation", params.slug],
        queryFn: () => fetchAttestation(params.slug),
        placeholderData: null,
        // Ensure to set staleTime to 0 to prevent displaying placeholder data before actual data arrives
        staleTime: 0,
    });

    // Check isLoading first to display "Loading..." message
    if (isLoading) return <div>Loading...</div>;

    // Handle errors
    if (error) return <div>Error: {error.message}</div>;

    // Handle case where data is not yet loaded
    if (!data) return <div>Loading...</div>; // Alternatively, you can customize this message

    // Once data is loaded, display the attestation details
    return (
        <div>
            <h1>Attestation Details</h1>
            <div>
                <p>ID: {data.id}</p>
                <p>Data: {data.data}</p>
                <p>Decoded Data: {JSON.stringify(data.decodedDataJson)}</p>
                <p>Attester: {data.attester}</p>
                <p>Time: {new Date(data.time * 1000).toLocaleString()}</p>
                <p>Time Created: {new Date(data.timeCreated * 1000).toLocaleString()}</p>
                <p>Recipient: {data.recipient}</p>
                <p>Expiration Time: {data.expirationTime ? new Date(data.expirationTime * 1000).toLocaleString() : "N/A"}</p>
                <p>Revocation Time: {data.revocationTime ? new Date(data.revocationTime * 1000).toLocaleString() : "N/A"}</p>
                <p>Ref UID: {data.refUID}</p>
                <p>Revocable: {data.revocable ? "Yes" : "No"}</p>
                <p>Revoked: {data.revoked ? "Yes" : "No"}</p>
                <p>Schema ID: {data.schemaId}</p>
            </div>
        </div>
    );
}
