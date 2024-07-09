import { gql } from "@apollo/client";

const SEARCH_ENS_NAMES_BY_ADDRESS = gql`
  query EnsNames($where: EnsNameWhereInput) {
    ensNames(where: $where) {
      id
      name
      timestamp
    }
  }
`;
export default SEARCH_ENS_NAMES_BY_ADDRESS