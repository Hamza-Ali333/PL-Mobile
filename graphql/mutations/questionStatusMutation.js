import gql from "graphql-tag";

export default gql`
  mutation changeQuestionStatus(
    $question_id: Int!
    $status: Int!
  ) {
    changeQuestionStatus(
      question_id: $question_id
      status: $status
    ) {
      message
    }
  }
`;
