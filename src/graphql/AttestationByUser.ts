import { gql } from "@apollo/client";

const GET_ATTESTATIONS_BY_USER = gql`
  query Attestations($where: SchemaWhereUniqueInput!, $user: String) {
    schema(where: $where) {
      attestations(where: { OR: [{ recipient: { equals: $user } }, { attester: { equals: $user } }] }) {
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

export default GET_ATTESTATIONS_BY_USER