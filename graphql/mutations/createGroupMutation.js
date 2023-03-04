import gql from "graphql-tag";

export default gql`
  mutation (
    $name: String
    $member_ids: [Int]
    $description: String
    $group_id: Int
  ) {
    createGroup(
      name: $name
      member_ids: $member_ids
      description: $description
      group_id: $group_id
    ) {
      id
      owner {
        id
        username
      }
      course_id
      general_privacy
      name
      description
      created_by
      created_at
      updated_at
      members {
        id
        user_id
        group_id
        invited_by
        rejected_by
        accepted_by
        member_type
        invited
        joined
        quit
        rejected
        blocked
        requested
        created_at
        updated_at
        user {
          id
          username
        }
      }
    }
  }
`;
