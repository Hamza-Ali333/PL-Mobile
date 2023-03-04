import gql from "graphql-tag";

export default gql`
  query ($course_id: ID) {
    is_enroll(course_id: $course_id)
  }
`;
