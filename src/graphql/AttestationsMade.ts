import gql from 'graphql-tag';

const ATTESTATIONS_MADE = gql`
  query AttestationsMade($schemaId: String!, $address: String!) {
    attestations(
      where: {
        schemaId: { equals: $schemaId },
        attester: { equals: $address }
      }
    ) {
      id
      recipient
      time
      timeCreated
      revoked
      revocationTime
      txid
    }
  }
`;

export default ATTESTATIONS_MADE;
