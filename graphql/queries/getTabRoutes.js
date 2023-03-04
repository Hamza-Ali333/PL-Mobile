import gql from "graphql-tag";

export default gql`
  query($id: ID) {
    offer(id: $id) {
      id
      tabRoutes {
        name
      }
    }
  }
`;
