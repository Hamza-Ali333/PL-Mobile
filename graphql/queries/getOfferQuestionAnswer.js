import gql from "graphql-tag";

export default gql`
  query($id: Int) {
    offerQuestionAnswer(id: $id) {
      id
      question_id
      answer
      answer_id
      question
    }
  }
`;
