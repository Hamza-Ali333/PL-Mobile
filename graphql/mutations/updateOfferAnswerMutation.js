import gql from "graphql-tag";

export default gql`
  mutation offerAnswerQuestion($offer_id: Int, $answers: [Object]!) {
    offerAnswerQuestion(offer_id: $offer_id, answers: $answers) {
      id
    }
  }
`;
