import gql from "graphql-tag";

export default gql`
  mutation offerInviteAccept($offer_id:Int!, $user_id: Int!) {
    offerInviteAccept(offer_id:$offer_id user_id: $user_id){
    	id
    }
  }
`;
