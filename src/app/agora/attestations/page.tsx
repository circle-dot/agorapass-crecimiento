"use client"
import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import GET_ATTESTATIONS from "@/graphql/Attestations";
import GET_AGGREGATE_ATTESTATIONS from "@/graphql/AggregateAttestation";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

const Attestations = () => {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const { loading, error, data } = useQuery(GET_ATTESTATIONS, {
        variables: {
            where: { id: process.env.NEXT_PUBLIC_SCHEMA_ID },
            skip: page * pageSize,
            take: pageSize
        },
        fetchPolicy: "cache-and-network",
    });

    const { loading: loadingCount, error: errorCount, data: dataCount } = useQuery(GET_AGGREGATE_ATTESTATIONS, {
        variables: {
            where: {
                schemaId: {
                    equals: process.env.NEXT_PUBLIC_SCHEMA_ID
                }
            }
        },
        fetchPolicy: "cache-and-network",
    });

    // Log aggregate data whenever it changes
    useEffect(() => {
        if (dataCount) {
            console.log("Aggregate Data:", dataCount.aggregateAttestation._count._all);
        }
    }, [dataCount]);

    if (loading || loadingCount) return <p>Loading...</p>;
    if (error || errorCount) return <p>Error: {error?.message || errorCount?.message}</p>;

    const tasks = data.schema.attestations.map((attestation: any) => ({
        id: attestation.id,
        attester: attestation.attester,
        recipient: attestation.recipient,
        timeCreated: attestation.timeCreated,
        revocable: attestation.revocable,
        revocationTime: attestation.revocationTime,
        expirationTime: attestation.expirationTime,
        data: attestation.data,
    }));

    const totalPages = dataCount?.aggregateAttestation._count._all
        ? Math.ceil(dataCount.aggregateAttestation._count._all / pageSize)
        : 0;

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
            />
        </div>
    );
};

export default Attestations;
