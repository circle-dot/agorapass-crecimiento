import { gql } from "@apollo/client";

const GET_ATTESTATION = gql`
    query GetAttestation($where: AttestationWhereUniqueInput!) {
        getAttestation(where: $where) {
            id
            data
            decodedDataJson
            attester
            time
            timeCreated
            recipient
            expirationTime
            revocationTime
            refUID
            revocable
            revoked
            schemaId
        }
    }
`;

export default GET_ATTESTATION;