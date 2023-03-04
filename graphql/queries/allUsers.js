import gql from "graphql-tag";

export default gql`
  query($q: String, $cursor: Int) {
    UserSearch(first: 5, page: $cursor, email: $q) {
      data {
        id
        username
        firstname
        lastname
        profile_photo
      }
      paginatorInfo {
        total
      }
    }
  }
`;

