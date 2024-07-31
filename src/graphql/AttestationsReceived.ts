import gql from 'graphql-tag';

const ATTESTATIONS_RECEIVED = gql`
  query AttestationsMade($schemaId: String!, $address: String!) {
    attestations(
      where: {
        schemaId: { equals: $schemaId },
        recipient: { equals: $address }
      }
    ) {
      id
      attester
      time
      timeCreated
      revoked
      revocationTime
      txid
    }
  }
`;

export default ATTESTATIONS_RECEIVED;
