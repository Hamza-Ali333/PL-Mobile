import gql from "graphql-tag";

  export default gql`
  query($offer_id:Int $me:Int $cursor:Int) {
    recommendation_comments(
      first: 10
      page: $cursor
      offer_id:$offer_id
      me:$me
    ) {
      data {
        id
        user
        comment_body
        is_verified
        created_at
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