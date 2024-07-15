import client from '../ApolloClient';
import GET_ATTESTATIONS from '@/graphql/Attestations';
import GET_ATTESTATIONS_REDUCED from '@/graphql/AttestationsReduced';
import GET_AGGREGATE_ATTESTATIONS from '@/graphql/AggregateAttestation';
import GET_ATTESTATION from '@/graphql/getAttestation';
import COUNT_ATTESTATIONS_MADE from '@/graphql/AttestationsMade';
import COUNT_ATTESTATIONS_RECEIVED from '@/graphql/AttestationsReceived';
import SEARCH_ENS_NAMES_BY_ADDRESS from '@/graphql/getENSNamebyAddress';
import { Attestation } from "@/types/attestations";

export const fetchAttestations = async (page: number, pageSize: number) => {
    const { data } = await client.query({
        query: GET_ATTESTATIONS,
        variables: {
            where: { id: process.env.NEXT_PUBLIC_SCHEMA_ID },
            skip: page * pageSize,
            take: pageSize,
        },
    });
    return data.schema.attestations;
};

export const fetchAggregateAttestations = async () => {
    const { data } = await client.query({
        query: GET_AGGREGATE_ATTESTATIONS,
        variables: {
            where: {
                schemaId: {
                    equals: process.env.NEXT_PUBLIC_SCHEMA_ID
                }
            }
        },
    });
    return data.aggregateAttestation._count._all;
};

export const fetchAttestation = async (id: string) => {
    const { data } = await client.query({
        query: GET_ATTESTATION,
        variables: {
            where: { id },
        },
    });
    return data.getAttestation;
};

export const fetchAttestationsMade = async (schemaId: string, address: string) => {
    const { data } = await client.query({
        query: COUNT_ATTESTATIONS_MADE,
        variables: {
            where: {
                schemaId: { equals: schemaId },
                attester: { equals: address },
            },
        },
    });
    return data.aggregateAttestation._count.attester;
};

export const fetchAttestationsReceived = async (schemaId: string, address: string) => {
    const { data } = await client.query({
        query: COUNT_ATTESTATIONS_RECEIVED,
        variables: {
            where: {
                schemaId: { equals: schemaId },
                recipient: { equals: address },
            },
        },
    });
    return data.aggregateAttestation._count.recipient;
};

export const fetchEnsNamesByAddress = async (address: string) => {
    const { data } = await client.query({
        query: SEARCH_ENS_NAMES_BY_ADDRESS,
        variables: {
            where: {
                id: {
                    equals: address,
                },
            },
        },
    });
    return data.ensNames;
};

export const fetchAttestationsReduced = async (page: number, pageSize: number): Promise<Attestation[]> => {
    const { data } = await client.query({
        query: GET_ATTESTATIONS_REDUCED,
        variables: {
            where: { id: process.env.NEXT_PUBLIC_SCHEMA_ID },
            skip: page * pageSize,
            take: pageSize,
        },
    });

    return data?.schema?.attestations ?? [];
};