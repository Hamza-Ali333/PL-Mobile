import gql from "graphql-tag";

export default gql`
  query($id: ID) {
    offer(id: $id) {
      id
      winners{    
        id
        user{
          id
          firstname
          lastname
          profile_photo
          username
          email
        }
        total
        correct
      }
    }
  }
`;
