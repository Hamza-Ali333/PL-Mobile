import gql from "graphql-tag";

export default gql`
  mutation followUser($user_id: Int!) {
    followUser(user_id: $user_id){
    	message
    	status
    }
  }
`;
