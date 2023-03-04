import gql from "graphql-tag";

export default gql`
mutation offerAnswerAccept(
    $answer_id:Int
  ) {
      offerAnswerAccept(
        answer_id: $answer_id
      ) {
        id
          mark
      }
    }
`;
