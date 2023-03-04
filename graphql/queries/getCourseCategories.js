import gql from "graphql-tag";

export default gql`
  query {
    course_categories {
      id
      name
      parent_id
      items {
        id
        name
        parent_id
      }
    }
  }
`;
