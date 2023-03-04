import { gql } from "@apollo/client";

export default gql`
  mutation AddCourseInterest(
    $course_id: Int!
    $email: String!
    $firstname: String!
    $lastname: String!
    $new_user: Boolean!
  ) {
    add_course_interest(
      course_id: $course_id
      email: $email
      firstname: $firstname
      lastname: $lastname
      new_user: $new_user
    ) {
      id
      email
      firstname
      lastname
    }
  }
`;
