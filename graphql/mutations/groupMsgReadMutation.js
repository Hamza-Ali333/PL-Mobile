import gql from "graphql-tag";

export default gql`
  mutation ($group_id: Int) {
    group_message_read(group_id: $group_id) {
      message
      error
    }
  }
`;
