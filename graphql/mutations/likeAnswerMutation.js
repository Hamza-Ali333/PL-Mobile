import gql from "graphql-tag";

export default gql`
  mutation updateLikeAnswer($question_id: Int!, $answer_id: Int!) {
    likeAnswer(question_id: $question_id, answer_id: $answer_id) {
      total_like_votes
      total_unlike_votes
    }
  }
`;
