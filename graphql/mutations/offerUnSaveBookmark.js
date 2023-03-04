import gql from "graphql-tag";

export default gql`
  mutation offerUnSaveBookmark($offer_id: Int) {
    offerUnSaveBookmark(offer_id: $offer_id) {
      id
      isBookmarked
    }
  }
`;
