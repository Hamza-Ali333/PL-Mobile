import gql from "graphql-tag";

export default gql`
  query ($cursor: Int $id:ID){
    user(id:$id) {
      id
      questions(first: 10 page:$cursor) {
        data {
          id
          question
          description
          created_at
          voteStatus
          saveForCurrentUser
          status
          slug
          meta_text
          attachments{
            url
          }
          categories {
            id
            name
          }
          tags{
            id
            tag_title
          }
          users {
            id
            firstname
            lastname
            profile_photo
            color
            is_follower
          }
          likes(first: 1) {
            data {
              users {
                id
              }
            }
            paginatorInfo {
              total
            }
          }
          answers(first: 1) {
            paginatorInfo {
              total
            }
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
  }
`;
