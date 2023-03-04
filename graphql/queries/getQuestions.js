import gql from "graphql-tag";

export default gql`
  query (
    $cursor: Int
    $course_id: Int
    $category: Int
    $getTagQuestion: Int
    $getSavedQuestions: Boolean
    $question: String
    $unanswered: Boolean
    $new: Boolean
    $hot: Boolean
    $my: Boolean
    $my_relevant: Boolean
  ) {
    questions(
      first: 10
      category: $category
      get_tag_question: $getTagQuestion
      page: $cursor
      orderBy: [{ field: "updated_at", order: DESC }]
      getSavedQuestions: $getSavedQuestions
      UnansweredQuestions: $unanswered
      getNewQuestions: $new
      get_hotQuestions: $hot
      get_MyDiscussions: $my
      question: $question
      course_id: $course_id
      my_relevant: $my_relevant
    ) {
      data {
        id
        question
        description
        created_at
        voteStatus
        saveForCurrentUser
        status
        slug
        meta_text
        tags {
          id
          tag_title
        }
        attachments {
          id
          url
          type
          width
          height
        }
        users {
          id
          firstname
          lastname
          profile_photo
          color
          is_follower
        }
        likes(first: 1) {
          data {
            users {
              id
            }
          }
          paginatorInfo {
            total
          }
        }
        dislikes(first: 1) {
          data {
            users {
              id
            }
          }
          paginatorInfo {
            total
          }
        }
        answers(first: 1) {
          paginatorInfo {
            total
          }
        }
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
