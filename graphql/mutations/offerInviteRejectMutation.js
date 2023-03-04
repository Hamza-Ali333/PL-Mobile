import gql from "graphql-tag";

export default gql`
  mutation offerInviteReject($offer_id:Int!, $user_id: Int!) {
    offerInviteReject(offer_id:$offer_id user_id: $user_id){
    	id
    }
  }
`;
