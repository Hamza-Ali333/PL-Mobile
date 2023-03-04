import gql from "graphql-tag";

export default gql`
  query ($cursor: Int, $course_id: Int) {
    course_review(
      course_id: $course_id
      first: 5
      page: $cursor
      orderBy: [{ field: "created_at", order: DESC }]
    ) {
      data {
        id
        course_id
        user_id
        rating
        user {
          username
          firstname
          lastname
          profile_photo
        }
        review
        IntructorAbilitityRating
        CourseMaterialRating
        InstructorReview
        is_published
        readable_created_at
      }
      paginatorInfo {
        total
        lastItem
        currentPage
        hasMorePages
      }
    }
  }
`;
