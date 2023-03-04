import gql from "graphql-tag";

export default gql`
  mutation deleteOffer(
  $offer_id:Int
) {
    deleteOffer(
      offer_id:$offer_id
    ) {
      id
    }
  }
`;

