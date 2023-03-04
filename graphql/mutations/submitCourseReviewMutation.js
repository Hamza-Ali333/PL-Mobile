import gql from "graphql-tag";

export default gql`
  mutation ($course_id: Int!, $rating: Float!, $review: String!) {
    add_course_review(course_id: $course_id, rating: $rating, review: $review) {
      id
      rating
      review
      user {
        username
      }
      is_published
    }
  }
`;
