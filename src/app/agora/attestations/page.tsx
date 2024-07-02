"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import GET_ATTESTATIONS from "@/graphql/Attestations";


const Attestations = ({ schemaId }) => {
    const { loading, error, data } = useQuery(GET_ATTESTATIONS, {
        variables: { where: { id: schemaId } },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            {data.schema.attestations.map((attestation) => (
                <div key={attestation.id}>
                    <p>ID: {attestation.id}</p>
                    <p>Data: {attestation.data}</p>
                    <p>Decoded Data: {attestation.decodedDataJson}</p>
                    <p>Recipient: {attestation.recipient}</p>
                    <p>Attester: {attestation.attester}</p>
                    <p>Time: {new Date(attestation.time * 1000).toLocaleString()}</p>
                    {/* Render other fields as needed */}
                </div>
            ))}
        </div>
    );
};

function Page() {
    return (
        <div>
            <Attestations schemaId={process.env.NEXT_PUBLIC_SCHEMA_ID} />
        </div>
    );
}

export default Page;
