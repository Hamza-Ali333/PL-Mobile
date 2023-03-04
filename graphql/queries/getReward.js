import gql from "graphql-tag";

export default gql`
query($id: ID) {
    offer(id: $id) {
      id
      user{
          id
      }
    participants{
      id
      total
      correct
      user{
        id
        firstname
        lastname
        profile_photo
        username
      }
    }
    }
  }
`;