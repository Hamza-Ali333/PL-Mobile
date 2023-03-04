import gql from "graphql-tag";

export default gql`
  mutation offerWatched($offer_id: Int) {
    offerWatched(offer_id: $offer_id) {
      id
      isWatched
    }
  }
`;
