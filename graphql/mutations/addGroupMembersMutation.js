import gql from "graphql-tag";

export default gql`
  mutation ($user_id: [Int!]!, $group_id: Int, $member_type: String) {
    add_groupMembers(
      user_id: $user_id
      group_id: $group_id
      member_type: $member_type
    ) {
      id
      username
      firstname
      lastname
      color
      email
      profile_photo
      tagline
    }
  }
`;
