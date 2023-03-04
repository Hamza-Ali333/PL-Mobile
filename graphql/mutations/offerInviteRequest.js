import gql from "graphql-tag";

export default gql`
  mutation offerInviteRequest($offer_id:Int!) {
    offerInviteRequest(offer_id:$offer_id){
        id
        isRequestSent
    }
  }
`;
