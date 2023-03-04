import gql from "graphql-tag";

export default gql`
  mutation updateLikeQuestion(
    $question_id: Int!
  ) {
    likeQuestion(
      question_id: $question_id
    ) {
      total_like_votes
      total_unlike_votes
    }
  }
`;
