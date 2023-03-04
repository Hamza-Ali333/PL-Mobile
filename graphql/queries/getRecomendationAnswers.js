import gql from "graphql-tag";

export default gql`
  query ($id: ID) {
    recommendation(id: $id) {
      id
      is_closed
      offer_id
      title
      description
      total_comment
      user
      categories
      tags
      attachments
      comments {
        id
        comment_body
        user
        is_verified
      }
    }
  }
`;
