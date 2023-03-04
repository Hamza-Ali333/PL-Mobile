import gql from "graphql-tag";

export default gql`
  mutation offerSaveBookmark($offer_id: Int) {
    offerSaveBookmark(offer_id: $offer_id) {
      id
      isBookmarked
    }
  }
`;
