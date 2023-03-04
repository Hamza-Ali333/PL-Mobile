import gql from "graphql-tag";

export default gql`
  mutation deleteComment($comment_id: Int!) {
    deleteComment(comment_id: $comment_id) {
      message
    }
  }
`;
