import { gql } from "@apollo/client";

const GET_ATTESTATIONS_REDUCED = gql`
  query GetAttestations($where: SchemaWhereUniqueInput!, $skip: Int!, $take: Int!, $orderBy: [AttestationOrderByWithRelationInput!]!) {
    schema(where: $where) {
      attestations(skip: $skip, take: $take, orderBy: $orderBy) {
        id
        recipient
        attester
        timeCreated
        expirationTime
        txid
        __typename
      }
      __typename
    }
  }
`;

export default GET_ATTESTATIONS_REDUCED;
