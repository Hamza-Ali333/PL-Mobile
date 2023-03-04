import gql from "graphql-tag";

export default gql`
  query($ID: ID, $cursor: Int) {
    questionanswer(id: $ID) {
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