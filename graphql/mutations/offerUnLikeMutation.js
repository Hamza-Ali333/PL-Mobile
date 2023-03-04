import gql from "graphql-tag";

export default gql`
  mutation offerUnLike($offer_id: Int) {
    offerUnLike(offer_id: $offer_id) {
      id
      isLiked
      totalLikes
    }
  }
`;
