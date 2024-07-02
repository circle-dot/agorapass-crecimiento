"use client";
import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";

const GET_ATTESTATIONS_BY_ATTESTER = gql`
  query Attestations($attester: String!) {
    attestations(where: { attester: { equals: $attester } }) {
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
`;

const GET_ATTESTATIONS_BY_RECIPIENT = gql`
  query Attestations($recipient: String!) {
    attestations(where: { recipient: { equals: $recipient } }) {
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
`;

const UserAttestations = ({ user }) => {
    const { loading: loadingByAttester, error: errorByAttester, data: dataByAttester } = useQuery(GET_ATTESTATIONS_BY_ATTESTER, {
        variables: { attester: user },
    });

    const { loading: loadingByRecipient, error: errorByRecipient, data: dataByRecipient } = useQuery(GET_ATTESTATIONS_BY_RECIPIENT, {
        variables: { recipient: user },
    });

    if (loadingByAttester || loadingByRecipient) return <p>Loading...</p>;
    if (errorByAttester) return <p>Error: {errorByAttester.message}</p>;
    if (errorByRecipient) return <p>Error: {errorByRecipient.message}</p>;

    const attestations = [
        ...(dataByAttester ? dataByAttester.attestations : []),
        ...(dataByRecipient ? dataByRecipient.attestations : [])
    ];

    return (
        <div>
            {attestations.map((attestation) => (
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
    const user = "0xeee68aECeB4A9e9f328a46c39F50d83fA0239cDF"; // Replace with the user address you want to query

    return (
        <div>
            <UserAttestations user={user} />
        </div>
    );
}

export default Page;
