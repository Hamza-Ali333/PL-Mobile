import gql from "graphql-tag";

export default gql`
  query($id: ID) {
    offer(id: $id) {
      id
      applications {
        id
        firstname
        lastname
        profile_photo
        email
        username
        pivot {
          offer_id
          user_id
          direction
          status
        }
      }
    }
  }
`;
