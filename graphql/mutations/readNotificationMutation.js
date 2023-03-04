import gql from "graphql-tag";

export default gql`
  mutation readNotification($id: String!) {
    readNotification(id: $id) {
      read_at
    }
  }
`;
