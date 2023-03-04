import gql from "graphql-tag";

export default gql`
mutation offerAnswerReject(
    $answer_id:Int
  ) {
    offerAnswerReject(
        answer_id: $answer_id
      ) {
        id
          mark
      }
    }
`;
