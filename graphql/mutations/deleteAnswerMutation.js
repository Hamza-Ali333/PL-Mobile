import gql from "graphql-tag";

export default gql`
  mutation deleteAnswer($answer_id: Int!) {
    deleteAnswer(answer_id: $answer_id) {
      message
    }
  }
`;
