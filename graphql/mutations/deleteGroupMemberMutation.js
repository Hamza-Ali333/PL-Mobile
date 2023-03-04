import gql from "graphql-tag";

export default gql`
  mutation ($user_id: Int, $group_id: Int) {
    remove_groupMembers(user_id: $user_id, group_id: $group_id) {
      id
      course_id
      general_privacy
      name
      description
      created_by
      created_at
      updated_at
      image_path
      count
      members {
        id
        user_id
        group_id
        user {
          id
          firstname
          lastname
          username
          profile_photo
        }
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
      }
    }
  }
`;
