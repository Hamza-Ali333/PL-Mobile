import { gql } from "@apollo/client";

export default gql`
  mutation add_or_update_sg_offer_comment(
    $id: Int
    $comment: String
    $offer_id: Int
  ) {
    add_or_update_sg_offer_comment(
      id: $id
      comment: $comment
      offer_id: $offer_id
    ) {
      id
      comments(first: 20, orderBy: [{ field: "created_at", order: DESC }]) {
        data {
          id
          user
          comment_body
          created_at
          comment_id
          is_verified
        }
      }
    }
  }
`;
