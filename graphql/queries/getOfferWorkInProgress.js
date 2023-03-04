import gql from "graphql-tag";

export default gql`
  query($id: ID) {
    offer(id: $id) {
      id
      workInProgress {
        id
        firstname
        lastname
        profile_photo
        email
        username
      }
    }
  }
`;
