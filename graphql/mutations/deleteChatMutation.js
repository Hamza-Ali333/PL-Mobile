import gql from "graphql-tag";

export default gql`
  mutation ($sender_id: Int) {
    delete_messages_list(sender_id: $sender_id) {
      id
      is_deleted
    }
  }
`;
