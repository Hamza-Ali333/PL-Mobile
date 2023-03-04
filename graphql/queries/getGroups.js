import gql from "graphql-tag";

export default gql`
  query ($cursor: Int) {
    general_groups(first: 5, page: $cursor, MyGroups: true) {
      data {
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
        group_massages(
          first: 1
          orderBy: [{ field: "updated_at", order: DESC }]
        ) {
          data {
            id
            message
          }
        }
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
      paginatorInfo {
        total
        lastItem
        currentPage
        hasMorePages
      }
    }
  }
`;
