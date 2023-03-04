import { gql } from "@apollo/client";

export default gql`
  query expert_opinion_by_id($id: ID!) {
    expert_opinion_by_id(id: $id) {
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
      comments(first: 20) {
        data {
          id
          user
          comment_body
          created_at
          comment_id
          is_verified
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
