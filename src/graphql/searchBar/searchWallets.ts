import { gql } from "@apollo/client";

const SEARCH_WALLETS = gql`
  query SearchWallets($query: String!) {
    attestations(where: { recipient: { contains: $query } }) {
      recipient
      id
    }
  }
`;
export default SEARCH_WALLETS;
