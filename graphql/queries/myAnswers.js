import gql from "graphql-tag";

export default gql`
  query ($cursor: Int) {
    me {
      id
      answers(first: 10, page: $cursor) {
        data {
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
          }
          comments(first: 1) {
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
  }
`;
