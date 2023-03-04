import gql from "graphql-tag";

export default gql`
  mutation ($course_id: Int) {
    course_clicked(course_id: $course_id) {
      error
      message
    }
  }
`;
