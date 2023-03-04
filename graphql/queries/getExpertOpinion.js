import { gql } from "@apollo/client";

export default gql`
  query expert_opinion($cursor: Int, $search: String) {
    expert_opinion(
      first: 12
      page: $cursor
      search: $search
      orderBy: [{ field: "updated_at", order: DESC }]
    ) {
      data {
        id
        title
        description
        last_date
        created_at
        is_closed
        reference_number
        quantity
        uom
        type
        readable_status
        status
        user {
          id
          username
          firstname
          lastname
          profile_photo
          email
        }
        attachment {
          id
          url
          type
          size
        }
        tags {
          id
          name
        }
        categories {
          id
          name
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
`;
