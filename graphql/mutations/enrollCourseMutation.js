import gql from "graphql-tag";

export default gql`
  mutation ($course_id: Int) {
    course_enrollment(course_id: $course_id) {
      message
      error
    }
  }
`;
