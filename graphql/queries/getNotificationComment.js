import gql from "graphql-tag";

export default gql`
  query ($ID: ID, $cursor: Int) {
    questionanswer(id: $ID) {
      id
      answer
      voteStatus
      created_at
      questions {
        id
      }
      users {
        id
        firstname
        lastname
        profile_photo
        color
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
      comments(first: 10, page: $cursor) {
        data {
          id
          comment
          created_at
          users {
            id
            firstname
            lastname
            profile_photo
            color
          }
        }
        paginatorInfo {
          total
          count
          currentPage
          lastPage
        }
      }
    }
  }
`;
