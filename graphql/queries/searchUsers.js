import gql from "graphql-tag";

export default gql`
  query ($cursor: Int, $groupSearch: Boolean, $q: String) {
    UserSearch(first: 10, page: $cursor, email: $q, groupSearch: $groupSearch) {
      data {
        id
        username
        firstname
        lastname
        email
        tagline
        profile_photo
        color
      }
      paginatorInfo {
        total
        count
        currentPage
        lastPage
      }
    }
  }
`;
