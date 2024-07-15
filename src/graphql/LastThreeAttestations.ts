import gql from 'graphql-tag';

const LAST_THREE_ATTESTATIONS = gql`
  query LastThreeAttestations($schemaId: String!, $attester: String!, $take: Int!) {
    attestations(
      where: {
        schemaId: { equals: $schemaId }
        attester: { equals: $attester }
      }
      take: $take
    ) {
      id
      schemaId
      attester
      data
      timeCreated
      recipient
    }
  }
`;

export default LAST_THREE_ATTESTATIONS;
