import gql from 'graphql-tag';

const LAST_THREE_ATTESTATIONS = gql`
  query LastThreeAttestations($schemaId: String!, $attester: String!, $take: Int!, $orderBy: [AttestationOrderByWithRelationInput!]!) {
    attestations(
      where: {
        schemaId: { equals: $schemaId }
        attester: { equals: $attester }
      }
      take: $take, orderBy: $orderBy
    ) {
      id
      schemaId
      attester
      data
      timeCreated
      recipient
      revoked
    }
  }
`;

export default LAST_THREE_ATTESTATIONS;
