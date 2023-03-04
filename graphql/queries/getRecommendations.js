import gql from "graphql-tag";

export default gql`
  query ($cursor: Int, $categories: [String], $name: String) {
    recommendations(
      first: 10
      page: $cursor
      categories: $categories
      name: $name
    ) {
      data {
        id
        offer_id
        is_closed
        title
        description
        user
        categories
        tags
        attachments
        total_comment
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
