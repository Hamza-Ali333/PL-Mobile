import gql from "graphql-tag";

export default gql`
mutation updateCategories(
    $categories:[Int!]!
  ) {
    updateCategories(
      categories:$categories
      ) {
          id
      }
    }
`;