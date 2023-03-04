import gql from "graphql-tag";

export default gql`
  mutation saveQuestion($question_id: Int!) {
    saveQuestion(question_id: $question_id) {
      message
    }
  }
`;
