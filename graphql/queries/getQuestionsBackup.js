import gql from "graphql-tag";

export default gql`
  query($cursor: Int $category:Int $getSavedQuestions:Boolean $question:String) {
    questions(
      first: 10
      category:$category
      page: $cursor
      orderBy: [{ field: "created_at", order: DESC }]
      getSavedQuestions:$getSavedQuestions
      question:$question
    ) {
      data {
        id
        question
        created_at
        voteStatus
        saveForCurrentUser
        categories{
          id
          name
        }
        users {
          id
          firstname
          lastname
          profile_photo
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
