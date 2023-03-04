import { gql } from "@apollo/client";

export default gql`
  mutation (
    $name: String!
    $email: String!
    $description: String!
    $reason: String
    $type: String!
  ) {
    create_contactus(
      user_name: $name
      user_email: $email
      description: $description
      reason: $reason
      ticket_type: $type
    ) {
      id
      user_name
      user_email
      description
      reason
      ticket_type
      is_active
    }
  }
`;
