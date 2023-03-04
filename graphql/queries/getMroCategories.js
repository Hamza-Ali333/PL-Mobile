import gql from "graphql-tag";

export default gql`
  query ($search: String) {
    mro_categories(first: 10, search: $search) {
      data {
        id
        name
        code
        parent_id
        items {
          id
          name
          code
          parent_id
          items {
            id
            name
            code
            parent_id
          }
        }
      }
    }
  }
`;
