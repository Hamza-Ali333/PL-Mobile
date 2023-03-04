import gql from "graphql-tag";

export default gql`
  query ($cursor: Int, $course_id: Int!) {
    courseQuestions(first: 10, course_id: $course_id, page: $cursor) {
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
        users {
          username
          firstname
          lastname
        }
        attachments {
          id
          url
          type
          width
          height
        }
        tags {
          id
          tag_title
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
        answers(first: 10) {
          paginatorInfo {
            total
          }
          data {
            answer
            users {
              username
              firstname
              lastname
            }
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
