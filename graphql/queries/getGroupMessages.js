import gql from "graphql-tag";

export default gql`
  query ($cursor: Int, $group_id: ID) {
    group_messages_list(
      group_id: $group_id
      first: 20
      page: $cursor
      orderBy: [{ field: "id", order: DESC }]
    ) {
      data {
        id
        group_id
        updated_at
        user {
          id
          firstname
          lastname
          username
          profile_photo
        }
        message
        total
      }
      paginatorInfo {
        total
        count
        currentPage
        lastPage
        hasMorePages
      }
    }
  }
`;
