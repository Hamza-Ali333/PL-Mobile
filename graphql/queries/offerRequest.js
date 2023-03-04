import gql from "graphql-tag";

export default gql`
query($id: ID) {
    offer(id: $id) {
      id
      
      invites{
        id
        firstname,
        lastname,
        email
        username
        pivot{
          status
          direction
        }
      }

    }
}
`;