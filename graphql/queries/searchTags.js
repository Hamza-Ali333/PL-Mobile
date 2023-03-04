import gql from "graphql-tag";

export default gql`
  query ($q: String, $cursor: Int) {
    tagSearch(first: 100, page: $cursor, tag_title: $q) {
      data {
        id
        tag_title
      }
      paginatorInfo {
        total
        perPage
        lastItem
        currentPage
        hasMorePages
      }
    }
  }
`;
