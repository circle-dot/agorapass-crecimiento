import { gql } from "@apollo/client";

const GET_ATTESTATIONS = gql`
  query GetAttestations($where: SchemaWhereUniqueInput!, $skip: Int!, $take: Int!) {
    schema(where: $where) {
      attestations(skip: $skip, take: $take) {
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
        __typename
      }
      __typename
    }
  }
`;

export default GET_ATTESTATIONS;
