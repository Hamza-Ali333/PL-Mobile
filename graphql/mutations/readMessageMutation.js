import gql from "graphql-tag";

export default gql`
  mutation readMessage($id: String!) {
    readMessage(message_id: $id) {
      read_at
    }
  }
`;
