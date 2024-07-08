import gql from 'graphql-tag';

const COUNT_ATTESTATIONS_RECEIVED = gql`
  query CountAttestationsReceived($where: AttestationWhereInput) {
    aggregateAttestation(where: $where) {
      _count {
        recipient
      }
    }
  }
`;

export default COUNT_ATTESTATIONS_RECEIVED