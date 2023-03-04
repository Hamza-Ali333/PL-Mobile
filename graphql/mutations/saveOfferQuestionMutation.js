import gql from "graphql-tag";

export default gql`
  mutation saveOfferQuestion(
  $offer_id:Int
  $questions:[String!]!
) {
    saveOfferQuestion(
      offer_id:$offer_id
      questions: $questions
    ) {
      id
    }
  }
`;

