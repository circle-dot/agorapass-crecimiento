import { gql } from "@apollo/client";

const GET_AGGREGATE_ATTESTATIONS = gql`
  query AggregateAttestation($where: AttestationWhereInput!) {
    aggregateAttestation(where: $where) {
      _count {
        _all
      }
    }
  }
`;

export default GET_AGGREGATE_ATTESTATIONS;
