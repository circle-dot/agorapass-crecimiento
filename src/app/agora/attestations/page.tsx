"use client";
import { useQuery } from "@apollo/client";
import GET_ATTESTATIONS from "@/graphql/Attestations";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";


export default function TaskPage() {
    // Use the schemaId environment variable
    const schemaId = process.env.NEXT_PUBLIC_SCHEMA_ID;

    if (!schemaId) {
        throw new Error("Schema ID is not defined");
    }

    // Fetch data using Apollo Client's useQuery hook
    const { loading, error, data } = useQuery(GET_ATTESTATIONS, {
        variables: { where: { id: schemaId } },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    // Map data to match the attestationSchema
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

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <DataTable data={tasks} columns={columns} />
        </div>
    );
}
