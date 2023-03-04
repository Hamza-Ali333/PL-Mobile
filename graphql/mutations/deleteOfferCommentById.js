import { gql } from "@apollo/client";

export default gql`
  mutation delete_sg_offer_comment_by_id($id: ID!) {
    delete_sg_offer_comment_by_id(id: $id) {
      id
      user
      comment_body
      created_at
      comment_id
      is_verified
    }
  }
`;
