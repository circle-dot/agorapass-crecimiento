// lib/fetchers.ts
import client from '../ApolloClient';
import GET_ATTESTATIONS from '@/graphql/Attestations';
import GET_AGGREGATE_ATTESTATIONS from '@/graphql/AggregateAttestation';

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
