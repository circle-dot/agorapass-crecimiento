"use client";
import React from "react";
import { gql, useQuery } from "@apollo/client";

const GET_ATTESTATIONS = gql`
  query Attestations($where: SchemaWhereUniqueInput!) {
    schema(where: $where) {
      attestations {
        id
        data
        decodedDataJson
        recipient
        attester
        time
        timeCreated
        expirationTime
        revocationTime
        refUID
        revocable
        revoked
        txid
        schemaId
        ipfsHash
        isOffchain
      }
    }
  }
`;

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
            <Attestations schemaId="0x3969bb076acfb992af54d51274c5c868641ca5344e1aacd0b1f5e4f80ac0822f" />
        </div>
    );
}

export default Page;
