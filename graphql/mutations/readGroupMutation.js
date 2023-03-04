import gql from "graphql-tag";

export default gql`
  mutation readGroupMessage($id: String!) {
    readGroupMessage(message_id: $id) {
      read_at
    }
  }
`;
