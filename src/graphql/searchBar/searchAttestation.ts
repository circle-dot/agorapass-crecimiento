import { gql } from "@apollo/client";

const SEARCH_ATTESTATIONS = gql`
  query SearchAttestations($query: String!) {
    attestations(where: { id: { contains: $query } }) {
      id
      recipient
    }
  }
`;

export default SEARCH_ATTESTATIONS;
