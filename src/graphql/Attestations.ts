import { gql } from "@apollo/client";
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
export default GET_ATTESTATIONS