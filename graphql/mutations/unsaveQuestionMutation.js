import gql from "graphql-tag";

export default gql`
  mutation unsaveQuestion($question_id: Int!) {
    unsaveQuestion(question_id: $question_id) {
      message
    }
  }
`;
