import gql from "graphql-tag";

export default gql`
  query($ID: ID, $cursor: Int) {
    question(id: $ID) {
      answers(first: 10, page: $cursor) {
        data {
          id
          answer
          voteStatus
          created_at
          users {
            id
            firstname
            lastname
            profile_photo
          }
          comments(first: 4) {
            data {
              comment
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
  }
`;