import gql from "graphql-tag";

export default gql`
  mutation unfollowUser($user_id: Int!) {
    unfollowUser(user_id: $user_id){
    	message
    	status
    }
  }
`;
