import gql from "graphql-tag";

export default gql`
  mutation offerLike($offer_id: Int) {
    offerLike(offer_id: $offer_id) {
      id
      isLiked
      totalLikes
    }
  }
`;
