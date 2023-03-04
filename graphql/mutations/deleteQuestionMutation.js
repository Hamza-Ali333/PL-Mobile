import gql from "graphql-tag";

export default gql`
  mutation deleteQuestion($question_id: Int!) {
    deleteQuestion(question_id: $question_id) {
      message
    }
  }
`;
