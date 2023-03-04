import gql from "graphql-tag";

export default gql`
  mutation ($id: Int) {
    course_watched(id: $id) {
      is_completed
    }
  }
`;
