import gql from "graphql-tag";

export default gql`
  query ($cursor: Int) {
    me {
      id
      messages_list(first: 10, page: $cursor, activeUsers: true) {
        data {
          id
          message
          is_deleted
          updated_at
          read_at
          total
          user {
            id
            firstname
            lastname
            profile_photo
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
