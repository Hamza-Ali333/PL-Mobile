import gql from "graphql-tag";

export default gql`
  mutation updateUnlikeQuestion(
    $question_id: Int!
  ) {
    dislikeQuestion(
      question_id: $question_id
    ) {
      total_like_votes
      total_unlike_votes
    }
  }
`;
