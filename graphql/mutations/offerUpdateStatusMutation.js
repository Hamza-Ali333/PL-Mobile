import gql from "graphql-tag";

export default gql`
  mutation offerUpdateStatus($offer_id: Int, $status: String) {
    offerUpdateStatus(offer_id: $offer_id, offer_status:$status) {
      id
      visibility
    }
  }
`;
