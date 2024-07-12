import { gql } from "@apollo/client";

const SEARCH_ENS_NAMES = gql`
  query SearchEnsNames($query: String!) {
    ensNames(where: { name: { contains: $query } }) {
      name
      id
    }
  }
`;

export default SEARCH_ENS_NAMES;