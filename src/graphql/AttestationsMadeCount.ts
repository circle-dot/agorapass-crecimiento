import gql from 'graphql-tag';

const COUNT_ATTESTATIONS_MADE = gql`
  query CountAttestationsMade($where: AttestationWhereInput) {
    aggregateAttestation(where: $where) {
      _count {
        attester
      }
    }
  }
`;

export default COUNT_ATTESTATIONS_MADE